import React from 'react'
import appwriteService from "../appwrite/config"
import { Link } from 'react-router-dom'


function PostCard({
    $id,
    title,
    featuredImage
}) {
  return (
  <Link to={`/post/${$id}`}>
      <div className='w-full flex flex-col items-center text-center card-hover rounded-xl p-4 h-full'>
          <div className='w-full flex justify-center mb-4 h-[80%]'>
              <img src={appwriteService.getFilePreview(featuredImage)} alt={title} className='rounded-xl h-full object-cover' />
          </div>
          <h2 className='text-xl font-bold'>{title}</h2>
      </div>
  </Link>

  )
}

export default PostCard