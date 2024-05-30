import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as authLogin } from "../store/authSlice";
import authService from '../appwrite/auth';
import { Logo, Button, Input } from "./index";
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Loader } from './index';
import { MovingButton } from './ui/moving-border';

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const login = async (data) => {
        setLoading(true);
        setError("");
        try {
            const session = await authService.login(data);
            if (session) {
                const userData = await authService.getCurrentUser();
                if (userData) {
                    dispatch(authLogin(userData));
                }
                navigate("/all-posts");
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRecruiterDemoLogin = async () => {
        const testCredentials = {
            email: 'talentseeker.logincheck@gmail.com',
            password: '12345678'
        };
        await login(testCredentials);
    };

    return (
        <div className=' items-center justify-center md:min-h-[80vh] text-sm'>
            <div className={`mx-auto w-full md:max-w-sm rounded-xl p-5 md:p-8 border-slate-800 border `}>
                <div className="mb-4 flex justify-center">
                    <span className="inline-block w-full max-w-[80px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-lg font-bold leading-tight">Sign in to your account</h2>
                <p className="mt-2 text-center text-sm text-white/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-white/80 hover:text-white transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-6 text-center">{error}</p>}
                
                <form onSubmit={handleSubmit(login)} className='mt-6'>
                    <div className='space-y-4'>
                        <Input
                            label="Email: "
                            placeholder="Enter your email"
                            type="email"
                            className="focus:border-solid focus:border-x-2 focus:border-customPurple"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",
                                }
                            })}
                        />
                        <Input
                            label="Password: "
                            type="password"
                            placeholder="Enter your password"
                            className="focus:border-solid focus:border-x-2 focus:border-customPurple"
                            {...register("password", {
                                required: true,
                            })}
                        />
                        {loading? 
                            <div className='w-full grid place-items-center'> <Loader></Loader></div>
                            :
                            <Button
                                type="submit"
                                style={{ marginTop: "1.5rem"}}
                                className="my-3 py-2 px-4 w-full md:py-3 text-white bg-customPurple button-custom rounded-lg shadow-lg hover:bg-[#7974f8f5] duration-400 hover:cursor-pointer"
                            >
                                Sign in
                            </Button>
                        }
                    </div>
                </form>
            </div>
            <MovingButton
                onClick={handleRecruiterDemoLogin}
                className="rounded-lg border-slate-800">
                    Login with Demo Account
                </MovingButton>
        </div>
    );
}

export default Login;
