import React from "react";
import { useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";

export function GoBack(){
    const navigate = useNavigate();
    function navigateBack(){
        navigate('/all-posts');
    }
    return (
        <button className="flex items-center justify-center gap-2 my-2"
        onClick={navigateBack}
        >
            <>
            <IoMdArrowBack />
            Go Back
            </>
        </button>
    );
}