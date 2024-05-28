import React from 'react';
import appwriteService from "../../appwrite/config";
import { Link } from 'react-router-dom';
import UserProfilePhoto from '../ui/userProfilePhoto';
import parse from "html-react-parser";
import calculateReadingTime from '../../utils/readingTime';
import { IoReaderOutline } from "react-icons/io5";
import { BiLike } from "react-icons/bi";

function DummyPostCard({
}) {
    const $id = "my-first-blog";
    const title = "What I learnt from this project";
    const featuredImage = "https://images.unsplash.com/photo-1634170380004-4b3b3b3b3b3b";
    const author = "Ayushi Choudhary";
    const $createdAt = "2024-02-04T20:47:28.904+00:00";
    const likes = 100;
    const content= "<p>As I sit down to reflect on my journey through my first full-stack React project, \"BlogHub,\" I am filled with a sense of accomplishment and a wealth of newfound knowledge. This project has been more than just a coding exercise; it has been a journey of discovery, growth, and overcoming challenges. In this blog post, I'd like to share with you the key lessons and insights I've gained along the way.<\/p>\n<p>&nbsp;<\/p>\n<p><strong>Embracing React: <\/strong><\/p>\n<p>Working extensively with React, I've come to appreciate its simplicity and power in building dynamic user interfaces. From creating reusable components to managing state efficiently, React has proven to be an invaluable tool!<\/p>\n<p>&nbsp;<\/p>\n<p><strong>Styling with Tailwind CSS: <\/strong><\/p>\n<p>Incorporating Tailwind CSS into the project introduced me to a whole new approach to styling. Its utility-first methodology allowed me to rapidly prototype designs and create responsive layouts with ease.<\/p>\n<p>&nbsp;<\/p>\n<p><strong>User Authentication and Leveraging Appwrite Backend: <\/strong><\/p>\n<p>Learning to integrate user authentication features seamlessly into my application was a challenging yet rewarding experience. Utilizing Appwrite as the backend infrastructure simplified many aspects of backend development, such as user authentication and data storage. Its seamless integration with my front end allowed me to focus more on building features and less on managing server-side complexities.<\/p>\n<p>&nbsp;<\/p>\n<p><strong>Continuous Learning and Growth: <\/strong><\/p>\n<p>In conclusion, this project has been an enriching experience that has deepened my understanding of React. As I embark on future projects, I carry with me the lessons learned from this journey, eager to tackle new challenges and push the boundaries of what I can achieve as a developer.<\/p>";
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
            <div className='flex flex-col border border-gray-900 rounded-lg p-4 lg:h-[260px]'>
            <div className="grid md:grid-cols-3 ">
                <div className='flex flex-col md:col-span-2 items-center justify-start gap-2 lg:mr-3'>
                    <div className="flex items-center justify-start w-full gap-2 my-2">
                    <UserProfilePhoto userName={author}/>
                    <div className="flex flex-col">
                    <p className="justify-left">{author}</p>
                    <p className="text-xs text-gray-600 w-full justify-start flex"> {new Date($createdAt).toLocaleDateString('en-US', { day:'2-digit' ,month: 'short', year: 'numeric' })}</p>
                    </div>
                    </div>
                <h2 className='text-lg font-bold w-full justify-start flex'>{title}</h2>
                <p className='text-sm text-gray-400 justify-left w-full justify-start flex text-start'>{parse(truncateHTML(content, 300))}</p>
                </div>
                <div className=' flex items-center justify-center w-full my-2'>
                <img src={"https://en.idei.club/uploads/posts/2023-08/thumbs/1690933244_en-idei-club-p-coding-room-setup-dizain-instagram-16.jpg"} alt={title} className='rounded-xl w-full sm:w-[12rem] max-h-[12rem] max-w-full lg:min-h-[12rem] object-cover' />
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
    );
}

export default DummyPostCard;
