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
      const userWhoLiked = await appwriteService.displaylikes(postId);
      for (const user of userWhoLiked) {
        const name = await authService.getUserName(user); // Ensure user.userId is passed
        // console.log(name);
      }
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
        setLiked(false);
        setLikesCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
      } else {
        // Like post
        await appwriteService.createLike(post.$id);
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
    <div className="py-8 flex justify-center">
      <div className="max-w-[57rem]">
        <Container>
          <div className="w-full flex justify-center mb-4 relative border rounded-xl max-h-80">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-xl object-cover"
            />

            {isAuthor && (
              <div className="absolute right-2 top-2">
                <Link to={`/edit-post/${post.$id}`}>
                  <Button className="mr-3 rounded-lg bg-[#ffffff] py-1 hover:bg-[#ffffff80]">
                    ✏️
                  </Button>
                </Link>
                <Button
                  className="rounded-lg bg-[#ffffff] py-1 hover:bg-[#ffffff80]"
                  onClick={deletePost}
                >
                  🗑️
                </Button>
              </div>
            )}
          </div>
          <div className="w-full mb-6">
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <p className="text-gray-600">Author: {post.author}</p>

            <div className="flex items-center gap-3">
              <Button
                className="flex items-center gap-3 sm:text-xl text-lg"
                onClick={handleLike}
              >
                {liked ? (
                  <FontAwesomeIcon icon={faHeart} className="text-customPink" />
                ) : (
                  <FontAwesomeIcon icon={faHeart} className="text-customGray" />
                )}
                {loading ? (
                  <MiniLoader />
                ) : (
                  <p className="text-gray-600 text-sm">{likesCount}</p>
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
