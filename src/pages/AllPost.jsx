import React, { useState, useEffect } from "react";
import { Container, PostCard, Button, Loader } from "../Components";
import appwriteService from "../appwrite/config";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  useEffect(() => {
    appwriteService.getPosts([]).then((posts) => {
      if (posts) {
        setPosts(posts.documents);
        setLoading(false);
      }
    });
  }, []);

  const handleAddPostClick = () => {
    navigate("/add-post");
  };

  const calculateReadingTime = (content = "") => {
    const wordsPerMinute = 200;
    const textLength = content.trim().split(/\s+/).length;
    return Math.ceil(textLength / wordsPerMinute);
  };

  const sortedPosts = posts.sort((a, b) => {
    if (sort === "newest")
      return new Date(b.$createdAt) - new Date(a.$createdAt);
    if (sort === "oldest")
      return new Date(a.$createdAt) - new Date(b.$createdAt);
    if (sort === "readtime") {
      const readA = calculateReadingTime(a.content);
      const readB = calculateReadingTime(b.content);
      return readA - readB;
    }
    if (sort === "likes") return (b.likes || 0) - (a.likes || 0);
    return 0;
  });

  return (
    <div className="w-full py-8">
      <div>
        <h1 className="text-[2rem] md:text-[2.5rem] text-center font-semibold">
          All Posts
        </h1>
      </div>
      <Container>
        <div className="border border-white/10 rounded-xl p-4 mb-6 sm:w-[30%] w-full">
          <div className="grid sm:grid-cols-1 gap-4">
            <div>
              <label className="text-white/70 text-sm block mb-1">
                Sort By
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full bg-transparent border border-white/20 rounded-lg px-3 py-2 text-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="readtime">Shortest Read Time</option>
                <option value="likes">Most Liked</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center mt-40 mb-40">
            <Loader />
          </div>
        ) : sortedPosts.length > 0 ? (
          <div className="flex flex-wrap flex-row">
            {sortedPosts.map((post) => (
              <div key={post.$id} className="p-2 w-full sm:w-full lg:w-1/2">
                <PostCard {...post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p>Nothing to Show</p>
            {authStatus ? (
              <Button
              onClick={handleAddPostClick}
              className="mt-4 bg-[#605BFF] text-white rounded-lg px-5 py-2 hover:bg-white hover:text-black hover:cursor-pointer"
              style={{
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "inset 0 0 0 1px #5A5C60";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Add Post
            </Button>
            
            ) : (
              <Button
                to="/signup"
                className="mt-4 bg-[#605BFF] text-white rounded-lg px-5 py-2 hover:bg-white hover:text-black hover:border hover:border-solid hover:border-[inset 0 0 0 1px #5A5C60] hover:cursor-pointer"
              >
                Signup
              </Button>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}

export default AllPosts;