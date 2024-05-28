import React from 'react';
import appwriteService from "../appwrite/config";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

function MiniPostCard({
    $id,
    title,
    featuredImage,
    author,
    likes
}) {
    return (
        <Link to={`/post/${$id}`}>
            <div className='w-full flex flex-col items-center text-left card-hover rounded-xl p-4 h-full'>
                <div className='w-full flex justify-center mb-4 h-[80%]'>
                    <img src={appwriteService.getFilePreview(featuredImage)} alt={title} className='rounded-xl h-full object-cover' />
                </div>
                <h2 className='text-md font-bold w-full'>{title.slice(0,15)}...</h2>
                <div className='flex items-center gap-10'>
                    <p className="text-gray-500 justify-left text-sm">{author}</p>
                    <div className='flex items-center text-sm'>
                     <FontAwesomeIcon icon={faHeart} className='mr-1' />
                        <span className="text-sm">
                            {likes}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default MiniPostCard;
