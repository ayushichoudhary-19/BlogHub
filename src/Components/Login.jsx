import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as authLogin } from "../store/authSlice";
import authService from '../appwrite/auth';
import { Logo, Button, Input } from "./index";
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Loader } from './index';

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

    return (
        <div className='flex items-center justify-center md:min-h-[80vh]'>
            <div className={`mx-auto w-full md:max-w-sm rounded-xl p-5 md:p-8 bg-customGray shadow-grayBorder`}>
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
                            className="focus:border-solid focus:border-x-2 focus:border-customPink"
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
                            className="focus:border-solid focus:border-x-2 focus:border-customPink"
                            {...register("password", {
                                required: true,
                            })}
                        />
                        {loading? 
                            <div className='w-full grid place-items-center'> <Loader></Loader></div>
                            :
                            <Button
                                type="submit"
                                className="my-3 py-2 px-4 w-full text-white bg-customPink button-custom rounded-lg shadow-lg hover:bg-[#EFFF3A] hover:text-black duration-400 hover:cursor-pointer"
                            >
                                Sign in
                            </Button>
                        }
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
