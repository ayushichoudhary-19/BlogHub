import React, { useState } from 'react';
import authService from '../../appwrite/auth';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import Loader from '../Loader';

function LogoutBtn() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const logoutHandler = async () => {
    try {
      setLoading(true);
      await authService.logout();
      dispatch(logout());
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="py-2 px-5 bg-customPurple text-white rounded-lg shadow-lg duration-400 hover:drop-shadow-2xl hover:bg-white hover:text-black hover:cursor-pointer"
        onClick={logoutHandler}
      >
        Logout
      </button>
    </>
  );
}

export default LogoutBtn;
