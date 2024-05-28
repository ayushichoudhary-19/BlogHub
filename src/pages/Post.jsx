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
  const [likesCount, setLikesCount] = useState(post?.likes || 0);
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const isAuthor = post && userData ? post.userId === userData.$id : false;
  const postId = slug;
  const readingTime = calculateReadingTime(post?.content);

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) {
          setPost(post);
          setLikesCount(post.likes || 0);
          checkUserLikedPost(userData.$id, post.$id);
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

  const displaylikes = async () => {
    try {
      const usersWhoLiked = await appwriteService.displaylikes(postId);
      usersWhoLiked.forEach(async (user) => {
        console.log(user);
        const name = await authService.getUserName(user); 
        console.log(name);
      }
      );
    } catch (error) {
      console.error("Error::", error);
    }
  };
  

  const handleLike = async () => {
    setLoading(true);
    try {
      if (liked) {
        // Unlike post
        const userIdSuffix = userData.$id.slice(-5);
        await appwriteService.deleteLike(`${userIdSuffix}_${post.$id}`);
        await appwriteService.removePostFromUsersLiked(post.$id, userData.$id);
        setLiked(false);
        setLikesCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
      } else {
        // Like post
        await appwriteService.createLike(post.$id);
        await appwriteService.addPostToUsersLiked(post.$id, userData.$id);
        setLiked(true);
        setLikesCount((prevCount) => prevCount + 1);
      }
    } catch (error) {
      console.error("Error liking the post:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = () => {
    appwriteService.deletePost(post.$id).then((status) => {
      if (status) {
        appwriteService.deleteFile(post.featuredImage);
        navigate("/");
      }
    });
  };

  return post ? (
    <div className="py-8 flex flex-col justify-center items-center">
      <div className="max-w-[57rem]">
        <Container>
          <div className="flex justify-between">
          <GoBack />
          {isAuthor && (
              <div className="flex items-center">
                <Link to={`/edit-post/${post.$id}`}>
                  <Button className="rounded-lg py-1 hover:text-gray-400 flex items-center gap-1">
                  <CiEdit /> Edit
                  </Button>
                </Link>
                   <Button className="rounded-lg py-1 hover:text-gray-400 flex items-center gap-1"
                  onClick={deletePost}
                >
                <MdDeleteOutline /> Delete
                </Button>
              </div>
            )}
            </div>
          <div className="w-full flex justify-center mb-4 relative max-h-80">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded- object-cover"
            />
          </div>
          <div className="w-full mb-6">
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <div className="flex justify-between">
            <div className="text-gray-400 flex items-center justify-cemter gap-2 my-2">
              <UserProfilePhoto userId={post.userId} userName={post.author} />
              <div className="flex flex-col">
              <p>by  {post.author} </p>
              <p className="text-xs text-gray-600"> {new Date(post.$createdAt).toLocaleDateString('en-US', { day:'2-digit' ,month: 'short', year: 'numeric' })}</p>
              </div>
            </div>
            <div className="text-sm text-gray-400 flex items-center px-5 py-2 rounded-md my-5 "> {readingTime} min Read
            </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                className="flex items-center gap-3 sm:text-xl text-md px-3 py-1 lg:py-1 my-3 rounded-md bg-gray-800"
                onClick={handleLike}
              >
                {liked ? (
                  <FontAwesomeIcon icon={faHeart} className="text-customPurple" />
                ) : (
                  <FontAwesomeIcon icon={faHeart} className="text-customGray" />
                )}
                {loading ? (
                  <MiniLoader />
                ) : (
                  <p className="text-gray-300 text-sm">{likesCount}</p>
                )}
              </Button>
              {/* <a className="text-gray-600 underline" onClick={displaylikes}>
                ${postId} and {likesCount-1} others
              </a> */}
              <div></div>
            </div>
          </div>
          <div className="browser-css text-left leading-relaxed">
            {parse(String(post.content))}
          </div>
        </Container>
      </div>
    </div>
  ) : null;
}
