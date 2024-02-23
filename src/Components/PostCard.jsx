import React from 'react';
import appwriteService from "../appwrite/config";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

function PostCard({
    $id,
    title,
    featuredImage,
    author,
    likes
}) {
    return (
        <Link to={`/post/${$id}`}>
            <div className='w-full flex flex-col items-center text-center card-hover rounded-xl p-4 h-full'>
                <div className='w-full flex justify-center mb-4 h-[80%]'>
                    <img src={appwriteService.getFilePreview(featuredImage)} alt={title} className='rounded-xl h-full object-cover' />
                </div>
                <h2 className='text-lg font-bold'>{title}</h2>
                <div className='flex items-center gap-10'>
                    <p className="text-gray-500 justify-left">{author ? author : "Anonymous"}</p>
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

export default PostCard;
