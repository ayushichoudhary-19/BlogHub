import React from 'react';
import { Container, Button } from '../Components';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Home() {
    const status = useSelector(state => state.auth.status);

    const navigate = useNavigate();
    const navigateHome = () => {
        if (status) {
            navigate('/all-posts');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="w-full my-20 md:py-8 text-center md:min-h-auto">
            <Container>
                <div className="flex flex-col gap-20 my-20 md:my-14 items-center justify-around">

                    <div className='flex flex-col items-center md:items-start'>
                        <h1 className='text-3xl md:text-[52px] lg:text-[72px] hero-heading mx-auto'>
                            Welcome to the <span className='text-customPink'>BlogHub!</span>
                        </h1>
                        <p className='md:text-lg text-sm lg:px-5 px-10 md:px-0 mx-auto'>
                        Find your next great read, share your story with the world. Write, connect, and be heard.
                        </p>
                        <div className="mx-auto">
                            <Button
                                onClick={() => navigateHome()}
                                className="my-4 py-2 px-5 text-white font-weight-400 bg-customPink rounded-xl shadow-lg duration-200 hover:cursor-pointer hover:bg-white hover:text-black hover:scale-105 md:mx-2 md:my-6"
                            >
                                {status ? "See Posts" : "Get Started"}
                            </Button>
                        </div>
                    </div>

                    <div className='md:w-[100%] mt-10 md:mt-0 flex justify-center'>
                        <div className='w-full max-w-[1000px] rounded-xl overflow-hidden '>
                            <img src="/landing-page-img.jpg" alt="blogginImage" />
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default Home;
