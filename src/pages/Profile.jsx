import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import authService from "../appwrite/auth.js";
import Loader from "../Components/Loader.jsx";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";

import MiniPostCard from "../Components/MiniPostCard.jsx";
import { BiError } from "react-icons/bi";
import LocationSelector from "../Components/Profile/Location.jsx";
import AboutMe from "../Components/Profile/AboutMe.jsx";

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postsAuthored, setPostsAuthored] = useState([]);
  const [postsLiked, setPostsLiked] = useState([]);
  const [userExists, setUserExists] = useState(true);
  const [edit, setEdit] = useState(false);
  const [location, setLocation] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [showAllAuthored, setShowAllAuthored] = useState(false);
  const [showAllLiked, setShowAllLiked] = useState(false);

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

    const getUserProfileAbouts = async () => {
      try {
        const userAbouts = await appwriteService.getUserAbouts(userId);
        if (userAbouts) {
          setLocation(userAbouts.location);
          setAboutMe(userAbouts.About);
        }
      } catch (error) {
        console.error("Failed to fetch or create user abouts", error);
      }
    };
    getUserProfileAbouts();
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

  const updateProfile = async () => {
    if (!edit) return;
    try {
      const userId = user.$id;
      await appwriteService.updateUserAbouts(userId, location, aboutMe);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

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

  // Limit the number of posts shown initially
  const displayedAuthoredPosts = showAllAuthored
    ? postsAuthored
    : postsAuthored.slice(0, 3);
  const displayedLikedPosts = showAllLiked
    ? postsLiked
    : postsLiked.slice(0, 3);

  return (
    <div className="m-10">
      <div className="flex flex-col md:grid md:grid-cols-3 lg:py-10 gap-8">
        {/* Left sidebar - keep as is */}
        <div className="col-span-1 border border-gray-700 w-full rounded-xl p-10 py-20">
          <div className="w-full flex justify-start gap-2 md:gap-5 pb-5 md:pb-10 border-b border-gray-900">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`}
              alt={user?.name}
              className="lg:w-[5rem] lg:h-[5rem] w-15 h-15 rounded-2xl"
            />
            <div className="flex flex-col justify-center items-start">
              <h1 className="text-sm md:text-xl text-start">{user?.name}</h1>
              <p
                className="text-[12px] md:text-xs text-start text-gray-400"
                style={{ overflowWrap: "anywhere" }}
              >
                {user.$id}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 justify-center items-start py-2 md:py-8 text-[12px] md:text-sm text-gray-400">
            {location && aboutMe && (
              <>
                <LocationSelector
                  edit={edit}
                  location={location}
                  setLocation={setLocation}
                />
                <AboutMe
                  edit={edit}
                  aboutMe={aboutMe}
                  setAboutMe={setAboutMe}
                />
              </>
            )}
            <button
              className="border border-gray-700 hover:border-gray-500 duration-50 transition-all w-full py-2 my-2 lg:my-5 px-4 rounded-xl text-gray-400 hover:text-gray-300"
              onClick={() => {
                setEdit(!edit);
                updateProfile();
              }}
            >
              {edit ? "Save" : "Edit Profile"}
            </button>
          </div>

          <div className="my-2 lg:my-5">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "20px 0",
              }}
            >
              <hr
                style={{
                  flex: 1,
                  border: "none",
                  borderTop: "1px solid rgb(17 24 39)",
                }}
              />
              <span
                style={{
                  padding: "0 10px",
                  whiteSpace: "nowrap",
                  color: "#9CA3AF",
                  fontSize: "14px",
                }}
              >
                OVERVIEW
              </span>
              <hr
                style={{
                  flex: 1,
                  border: "none",
                  borderTop: "1px solid rgb(17 24 39)",
                }}
              />
            </div>
          </div>
          <div className="flex gap-5 justify-evenly items-center">
            <div className="border px-3 py-2 flex flex-col items-center justify-center border-gray-700 rounded-[15px] lg:w-[5rem] lg:h-[5rem] w-15 h-15  ">
              <h1 className="text-gray-400 text-md lg:text-2xl font-bold">
                {postsAuthored.length}
              </h1>
              <p className="text-gray-600 text:xs">Posts</p>
            </div>
            <div className="border px-3 py-2 gap-0 flex flex-col items-center justify-center border-gray-700 rounded-[15px] lg:w-[5rem] lg:h-[5rem] w-15 h-15  ">
              <h1 className="text-gray-400 text-md lg:text-2xl font-bold">
                {postsLiked.length}
              </h1>
              <p className="text-gray-600 text:xs">Liked</p>
            </div>
          </div>
          <div className="text-gray-600 mt-5">
            <div className="flex gap-0 mt-8 flex-col justify-center items-center">
              <h1 className="text-xs">
                {`Member Since  `}
                {new Date(user?.$createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </h1>
              <h1 className="text-xs">
                {`Last Updated in  `}
                {new Date(user?.$updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </h1>
            </div>
            <div className="flex items-center justify-center mt-5 w-full">
              <div style={{ width: "10%" }}>
                <hr
                  style={{
                    width: "100%",
                    border: "none",
                    borderTop: "1px solid rgb(17 24 39)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2 grid gap-8">
          {/* Your Posts Section */}
          <div className="border border-gray-700 w-full rounded-xl p-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-md text-[#9CA3AF]">Your Posts</h2>
              {postsAuthored.length > 3 && (
                <button
                  onClick={() => setShowAllAuthored(!showAllAuthored)}
                  className="text-sm text-gray-400 hover:text-gray-300"
                >
                  {showAllAuthored ? "Show Less" : "View All"}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {postsAuthored.length > 0 ? (
                <>
                  {displayedAuthoredPosts.map((post) => (
                    <div key={post.$id} className="w-full">
                      <MiniPostCard {...post} />
                    </div>
                  ))}
                </>
              ) : (
                <p className="col-span-full">No posts authored by you so far</p>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button className="border border-gray-700 hover:border-gray-500 duration-50 transition-all py-2 px-4 rounded-xl text-gray-400 hover:text-gray-300 w-full sm:w-auto">
                <Link to="/add-post">Add More +</Link>
              </button>
            </div>
          </div>

          {/* Liked Posts Section */}
          <div className="border border-gray-700 w-full rounded-xl p-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-md text-[#9CA3AF]">Liked Posts</h2>
              {postsLiked.length > 3 && (
                <button
                  onClick={() => setShowAllLiked(!showAllLiked)}
                  className="text-sm text-gray-400 hover:text-gray-300"
                >
                  {showAllLiked ? "Show Less" : "View All"}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {postsLiked.length > 0 ? (
                <>
                  {displayedLikedPosts.map((post) => (
                    <div key={post.$id} className="w-full">
                      <MiniPostCard {...post} />
                    </div>
                  ))}
                </>
              ) : (
                <p className="col-span-full">No posts liked by you so far</p>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button className="border border-gray-700 hover:border-gray-500 duration-50 transition-all py-2 px-4 rounded-xl text-gray-400 hover:text-gray-300 w-full sm:w-auto">
                <Link to="/all-posts">Read More +</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
