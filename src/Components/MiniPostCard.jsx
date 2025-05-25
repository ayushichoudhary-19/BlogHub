import React from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";
import { IoReaderOutline } from "react-icons/io5";
import { BiLike } from "react-icons/bi";
import calculateReadingTime from "../utils/readingTime";
function MiniPostCard({
  $id,
  title,
  // featuredImage,
  author,
  $createdAt,
  likes,
  content,
}) {
  const readingTime = calculateReadingTime(content);
  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full flex flex-col items-center border border-gray-800 text-left hover:bg-gray-900 rounded-xl p-4 h-full">
        <div className="w-full flex justify-center mb-4 h-[80%]">
          {/* <img
            src={appwriteService.getFilePreview(featuredImage)}
            alt={title}
            className="rounded-xl h-full object-cover"
          /> */}
        </div>
        <h2 className="text-sm text-gray-300 font-bold w-full">
          {title.slice(0, 15)}...
        </h2>
        <div className="grid w-full">
          <div className="flex flex-col md:col-span-2 items-center justify-start gap-2 lg:mr-3">
            <div className="flex items-center justify-start w-full gap-2 my-2">
              <div className="flex flex-col justify-start items-start">
                <p className="justify-left text-gray-400 text-xs">{author}</p>
                <p className="text-[10px] text-gray-600">
                  {" "}
                  {new Date($createdAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-start w-full gap-10">
          <div className="flex flex-col items-start md:items-center md:flex-row text-sm md:gap-5">
            <div className="flex text-gray-400 items-center text-xs gap-1">
              <BiLike />
              <span className="text-xs">{likes} Likes</span>
            </div>
            <p className="flex text-gray-400 items-center text-xs gap-1">
              <IoReaderOutline />
              {readingTime} min Read
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MiniPostCard;
