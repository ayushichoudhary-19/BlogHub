import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../Components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import MiniLoader from "../Components/MiniLoader";
import  authService from '../appwrite/auth.js';
import { GoBack } from "../Components/ui/goBack.jsx";
import UserProfilePhoto from "../Components/ui/userProfilePhoto.jsx";
import calculateReadingTime from "../utils/readingTime.js";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

export default function Post() {
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const isAuthor = post && userData ? post.userId === userData.$id : false;
  const readingTime = post ? calculateReadingTime(post.content) : 0;

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) {
          setPost(post);
          setLikesCount(post.likes || 0);
          if (userData) {
            checkUserLikedPost(userData.$id, post.$id);
          }
        } else {
          navigate("/");
        }
      });
    } else {
      navigate("/");
    }
  }, [slug, navigate, userData]);

  const checkUserLikedPost = async (userId, postId) => {
    try {
      const liked = await appwriteService.getLikesByUserAndPost(userId, postId);
      setLiked(liked);
    } catch (error) {
      console.error("Error checking if user liked the post:", error);
    }
  };

  const handleLike = async () => {
    if (!userData) {
      navigate("/login");
      return;
    }
    
    setLoading(true);
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount(prev => wasLiked ? Math.max(prev - 1, 0) : prev + 1);
    
    try {
      if (wasLiked) {
        const userIdSuffix = userData.$id.slice(-5);
        await appwriteService.deleteLike(`${userIdSuffix}_${post.$id}`);
      } else {
        await appwriteService.createLike(post.$id);
      }
    } catch (error) {
      console.error("Error liking the post:", error);
      setLiked(wasLiked);
      setLikesCount(prev => wasLiked ? prev + 1 : Math.max(prev - 1, 0));
    } finally {
      setLoading(false);
    }
  };

  const deletePost = () => {
    appwriteService.deletePost(post.$id).then((status) => {
      if (status) {
        navigate("/");
      }
    });
  };

  if (!post) {
    return (
      <div className="py-8 flex justify-center items-center min-h-[60vh]">
        <MiniLoader />
      </div>
    );
  }

  return (
    <div className="py-8 flex flex-col justify-start items-center min-h-screen">
      <Container>
        <article className="rounded-xl shadow-sm p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <GoBack />
            {isAuthor && (
              <div className="flex items-center gap-2">
                <Link to={`/edit-post/${post.$id}`}>
                  <Button className="rounded-lg py-1 px-3 hover:bg-white/10 text-white/50 flex items-center gap-1 transition duration-200">
                    <CiEdit /> Edit
                  </Button>
                </Link>
                <Button 
                  className="rounded-lg py-1 px-3 hover:bg-white/10 text-red-600 flex items-center gap-1 transition duration-200"
                  onClick={deletePost}
                >
                  <MdDeleteOutline /> Delete
                </Button>
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-50">{post.title}</h1>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 pb-4 border-b border-white/60">
            <div className="flex items-center gap-3 mb-3 sm:mb-0">
              <UserProfilePhoto userName={post.author} />
              <div>
                <p className="font-medium text-gray-200">by {post.author}</p>
                <p className="text-sm text-gray-500">
                  {new Date(post.$createdAt).toLocaleDateString('en-US', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-white/50 border flex items-center gap-1 px-3 py-1 rounded-full border-white/50">
                {readingTime} min read
              </div>
              
              <Button
                className={`flex items-center bg-none gap-2 px-4 py-1 rounded-full transition duration-200 ${liked ? 'text-[#605BFF]' : 'text-gray-600 hover:bg-white/10'}`}
                onClick={handleLike}
                disabled={loading}
              >
                <FontAwesomeIcon 
                  icon={faHeart} 
                  className={liked ? "text-customPurple" : "text-gray-400"} 
                />
                {loading ? (
                  <MiniLoader />
                ) : (
                  <span>{likesCount}</span>
                )}
              </Button>
            </div>
          </div>
          <div className="prose prose-lg max-w-none text-white/100 leading-relaxed">
            {parse(String(post.content))}
          </div>
        </article>
      </Container>
    </div>
  );
}
