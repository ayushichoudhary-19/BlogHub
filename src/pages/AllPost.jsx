import React, { useState, useEffect } from 'react';
import { Container, PostCard, Button, Loader } from '../Components';
import appwriteService from "../appwrite/config";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  useEffect(() => {
    const delayLoading = setTimeout(() => {
      appwriteService.getPosts([]).then((posts) => {
        if (posts) {
          setPosts(posts.documents);
          setLoading(false);
        }
      });
    }, 2000);

    return () => clearTimeout(delayLoading);
  }, []);

  const handleAddPostClick = () => {
    navigate('/add-post');
  };

  return (
    <div className='w-full py-8'>
      <div>
        <h1 className='text-[2rem] md:text-[2.5rem] text-center font-semibold'>All Posts</h1>
      </div>
      <Container>
        {loading ? (
          <div className="flex items-center justify-center mt-40 mb-40">
            <Loader />
          </div>
        ) : posts.length > 0 ? (
          <div className='flex flex-wrap flex-row'>
            {posts.map((post) => (
              <div key={post.$id} className='p-2 w-full sm:w-full lg:w-1/2'>
                <PostCard {...post} />
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center'>
            <p>Nothing to Show</p>
            {authStatus ? (
              <Button
                onClick={handleAddPostClick}
                className="mt-4 bg-customPurple text-white rounded-xl px-5 py-2 hover:bg-white hover:text-black hover:border hover:border-solid hover:border-grayBorder hover:cursor-pointer"
              >
                Add Post
              </Button>
            ) : (
              <Button to="/signup" className="mt-4 bg-customPurple text-white rounded-xl px-5 py-2 hover:bg-white hover:text-black hover:border hover:border-solid hover:border-grayBorder hover:cursor-pointer">
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
