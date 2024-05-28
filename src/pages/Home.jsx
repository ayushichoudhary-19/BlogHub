import React, {useRef, useEffect} from "react";
import { Container, Button } from "../Components";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Spotlight } from "../Components/ui/Spotlight";
import { cn } from "@/utils/cn";
("use client");
import { TextGenerateEffect } from "../Components/ui/text-generate-effect";
import DummyPostCard from "../Components/Home/DummyPostCard";

const welcomeMessage = `Find your next great read, share your story with the world. Write, connect, and be heard.`;

function Home() {
  const status = useSelector((state) => state.auth.status);

  const navigate = useNavigate();
  const navigateHome = () => {
    if (status) {
      navigate("/all-posts");
    } else {
      navigate("/login");
    }
  };
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.5;
    }
  }, []);

  return (
    <div className="w-full my-20 md:py-8 text-center md:min-h-auto">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <Container>
        <div className="flex flex-col gap-20 my-20 md:my-14 items-center justify-around">
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-[52px] md:text-[52px] lg:text-[72px] hero-heading mx-auto">
              Welcome to the <span className="text-customPurple">BlogHub!</span>
            </h1>
            <p className="md:text-lg text-sm lg:px-5 px-10 md:px-0 mx-auto">
              <TextGenerateEffect words={welcomeMessage} />
            </p>
            <div className="mx-auto">
              <Button
                onClick={() => navigateHome()}
                className="my-7 md:py-[0.7rem] py-0 px-5 text-white font-weight-400 bg-customPurple rounded-2xl shadow-lg duration-200 hover:cursor-pointer hover:bg-white hover:text-black hover:scale-105 md:mx-2 md:my-6"
              >
                {status ? "See Posts" : "Get Started"}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse lg:flex-row my-5 lg:mt-[12rem] gap-5">
          <DummyPostCard />
          <div className="lg:min-h-[12rem] flex flex-col items-end w-full">
            <div className="h-50 w-full border-b flex justify-end text-customPurple border-customPurple text-md md:text-2xl">
              {" "}
              Find the Best Reads
            </div>
            <div className="text-gray-300 text-sm text-start">
              Login to unlock a world of blogs posted by others
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row my-5 lg:mt-[12rem] gap-5">
          <div className="lg:min-h-[12rem] flex flex-col items-start w-full">
            <div className="h-50 w-full border-b flex justify-start text-customPurple border-customPurple text-md md:text-2xl">
              Write your ideas and thoughts
            </div>
            <div className="text-gray-300 text-sm text-start">
              Through a Richt Text Editor craft engaging content
            </div>
          </div>
          <img src={`/EditorDemo.png`} className=" w-full lg:w-[52rem]" />
        </div>

        <div className="flex flex-col lg:flex-row my-5 lg:mt-[12rem] gap-5">
  <div className="lg:min-h-[12rem] flex flex-col items-start w-full">
  <div className="h-50 w-full font-bold flex justify-center pb-3 lg:py-5 text-customPurple  md:text-2xl">
    LIKE YOUR FAVOURITES
    </div>
    <video ref={videoRef} src="/LikePostVideoDemo.mov" autoPlay muted loop width="100%" height="auto" />
   
  </div>
  <div>
    <img src={`/UserProfileDemo.png`} className=" w-full lg:w-[52rem]" />
    <div className="h-50 w-full font-bold flex justify-center pt-3 lg:pt-5 text-customPurple  md:text-2xl">
    & FIND THEM IN YOUR PROFILE
    </div>
  </div>
  
</div>

      </Container>
    </div>
  );
}

export default Home;
