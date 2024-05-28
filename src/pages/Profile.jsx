import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import authService from "../appwrite/auth.js";
import Loader from "../Components/Loader.jsx";
import appwriteService from "../appwrite/config";
import { BsCalendar3 } from "react-icons/bs";
import { Link } from "react-router-dom";
import { TfiWrite } from "react-icons/tfi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "@material-tailwind/react";
import MiniPostCard from "../Components/MiniPostCard.jsx";
import { BiError } from "react-icons/bi";

const Profile = () => {
  const { userId } = useParams(); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postsAuthored, setPostsAuthored] = useState([]);
  const [postsLiked, setPostsLiked] = useState([]);
  const [userExists, setUserExists] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser.$id === userId) {
          setUser(currentUser);
        } else {
          const userProfile = await auth.getUserProfile(userId);
          if (userProfile) {
            setUser(userProfile);
          } else {
            setUserExists(false);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
        setUserExists(false);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    const fetchUserRelatedData = async () => {
      if (user) {
        try {
          const posts = await appwriteService.getPosts([]);
          const likedPosts = await appwriteService.getLikedPosts(user.$id);
          const IdsOfLikedPosts = likedPosts.documents.map(
            (post) => post.postId
          );
          if (posts) {
            setPostsAuthored(
              posts.documents.filter((post) => post.userId === user.$id)
            );
            setPostsLiked(
              posts.documents.filter((post) =>
                IdsOfLikedPosts.includes(post.$id)
              )
            );
          }
        } catch (error) {
          console.error("Failed to fetch posts or liked posts", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserRelatedData();
  }, [user]);

  if (loading) {
    return (
      <div className="h-[80vh] w-full flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!userExists) {
    return (
      <div className="h-[80vh] w-full flex flex-col justify-center items-center">
        <BiError className="size-20" />
        <p className="text-2xl text-white">User does not exist</p>
      </div>
    );
  }

  return (
    <div className="m-10">
      <div className="flex flex-col md:grid md:grid-cols-3 lg:p-10 gap-8">
        <div className="col-span-1 bg-gray-900 w-full rounded-xl p-10 py-20">
          <div className="w-full flex justify-center">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`}
              alt={user?.name}
              className="w-32 h-32 rounded-full"
            />
          </div>
          <div className="text-white mt-5">
            <h1 className="text-2xl text-center flex gap-2 font-bold items-center justify-center">
              {user?.name}
            </h1>
            <div className="flex gap-5 mt-8 flex-col">
              <h1 className="text-md lg:text-lg flex gap-2 items-center">
                <BsCalendar3 /> {`Member Since  `}
                {new Date(user?.$createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </h1>
              <h1 className="text-md lg:text-lg flex gap-2 items-center">
                <BsCalendar3 /> {`Last Updated in  `}
                {new Date(user?.$updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </h1>
              <h1 className="text-md  lg:text-lg flex gap-2 items-center">
                {" "}
                <TfiWrite /> Total Posts Created: {postsAuthored.length}
              </h1>
              <h1 className="text-md  lg:text-lg flex gap-2 items-center">
                <FontAwesomeIcon icon={faHeart} />
                Total Liked Posts: {postsLiked.length}
              </h1>
              <Tooltip
                content="Coming Soon"
                className="p-5 text-white rounded-xl bg-gray-950 "
              >
                <button
                  className="bg-customPurple w-full py-2 px-4 rounded-xl cursor-not-allowed text-white"
                  disabled
                >
                  <Link to="/edit-profile" className="pointer-events-none">
                    Edit Profile
                  </Link>
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="col-span-2 grid gap-8">
          <div className="bg-gray-900 p-8 rounded-xl">
            <h2 className="text-xl mb-4 px-8">Your Posts</h2>
            <div className="md:grid md:grid-cols-4 ">
              {postsAuthored.length > 0 ? (
                <div className="col-span-3 md:flex md:gap-8">
                  {postsAuthored.map((post) => (
                    <div
                      key={post.$id}
                      className=" w-full sm:w-1/3 xl:w-1/4 md:bg-gray-800 rounded-xl md:min-w-[12rem]"
                    >
                      <MiniPostCard {...post} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="col-span-3">No posts authored by you so far</p>
              )}
              <div className="flex justify-center items-center md:col-span-1">
                <button className=" bg-customPurple w-full hover:bg-white hover:text-black text-white  py-2 px-4 rounded-xl">
                  <Link to="/add-post"> + Add More</Link>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-8 rounded-xl">
            <h2 className="text-xl mb-4 px-8">Liked Posts</h2>
            <div className="md:grid md:grid-cols-4">
              {postsLiked.length > 0 ? (
                <div className="col-span-3 md:flex md:gap-8">
                  {postsLiked.map((post) => (
                    <div
                      key={post.$id}
                      className=" w-full sm:w-1/3 xl:w-1/4 md:bg-gray-800 rounded-xl md:min-w-[12rem]"
                    >
                      <MiniPostCard {...post} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="col-span-3">No posts liked by you so far</p>
              )}
              <div className="flex justify-center items-center md:col-span-1">
                <button className=" bg-customPurple w-full hover:bg-white hover:text-black text-white  py-2 px-4 rounded-xl">
                  <Link to="/all-posts"> + Read More</Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
