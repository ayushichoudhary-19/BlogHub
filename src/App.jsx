import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import authService from "./appwrite/auth";
import { login, logout } from './store/authSlice';
import { Footer, Header, Loader } from './Components';
import { Outlet } from 'react-router-dom';

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(login(userData));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      }finally
      {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  return (
    <div className='min-h-screen flex flex-wrap content-between text-white bg-[#00040F] items-center justify-center'>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#00040F]">
          <Loader />
        </div>
      )}
      {!loading && (
        <>
          <div className="w-full block">
            <Header />
            <main>
              <Outlet />
            </main>
            <Footer />
          </div>
          <div className="absolute z-[3] -left-1/2 top-0 w-[50%] h-[50%] rounded-full white__gradient" />
          <div className="absolute z-[0] w-[30%] h-[30%] -left-1/2 bottom-0 rounded-full blue__gradient" />
        </>
      )}
    </div>
  );
}

export default App;
