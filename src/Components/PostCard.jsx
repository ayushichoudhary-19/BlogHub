import React from 'react';
import appwriteService from "../appwrite/config";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import UserProfilePhoto from './ui/userProfilePhoto';
import parse from "html-react-parser";
import calculateReadingTime from '../utils/readingTime';
import { IoReaderOutline } from "react-icons/io5";
import { BiLike } from "react-icons/bi";

function PostCard({
    $id,
    title,
    featuredImage,
    author,
    $createdAt,
    likes,
    content,
}) {
    const truncateHTML = (html, length) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const textContent = tempDiv.textContent || tempDiv.innerText || "";
        if (textContent.length <= length) {
          return html;
        }
        return textContent.slice(0, length) + '...';
      };
    const readingTime = calculateReadingTime(content);

    return (
        <Link to={`/post/${$id}`}>
            <div className='flex flex-col border border-gray-900 rounded-lg p-4 lg:h-[260px] hover:bg-gray-900'>
            <div className="grid md:grid-cols-3 ">
                <div className='flex flex-col md:col-span-2 items-center justify-start gap-2 lg:mr-3'>
                    <div className="flex items-center justify-start w-full gap-2 my-2">
                    <UserProfilePhoto userName={author}/>
                    <div className="flex flex-col">
                    <p className="justify-left">{author}</p>
                    <p className="text-xs text-gray-600"> {new Date($createdAt).toLocaleDateString('en-US', { day:'2-digit' ,month: 'short', year: 'numeric' })}</p>
                    </div>
                    </div>
                <h2 className='text-lg w-full justify-start font-bold'>{title}</h2>
                <p className='text-sm text-gray-400 justify-left w-full'>{parse(truncateHTML(content, 200))}</p>
                </div>
                <div className=' flex items-center justify-center w-full my-2'>
                <img src={appwriteService.getFilePreview(featuredImage)} alt={title} className='rounded-xl w-full sm:w-[12rem] max-h-[12rem] max-w-full lg:min-h-[12rem] object-cover' />
                </div>
            </div>
            <div className='flex items-center justify-start w-full gap-10'>
                   
                   <div className='flex items-center text-sm gap-5'>
                    <div className='flex items-center text-sm gap-1'>
                    <BiLike />
                       <span className="text-sm">
                           {likes} Likes
                       </span>
                    </div>
                    <p className='flex items-center text-sm gap-1'>
                    <IoReaderOutline />
                    {readingTime} min Read</p>
                   </div>
               </div>
            </div>
        </Link>
    );
}

export default PostCard;
