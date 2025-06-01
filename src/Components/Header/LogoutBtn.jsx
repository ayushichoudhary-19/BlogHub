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
    <button
      className="py-2 px-5 bg-[#605BFF] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:bg-white hover:text-black"
      onClick={logoutHandler}
      disabled={loading}
    >
      {loading ? <Loader className="w-5 h-5" /> : 'Logout'}
    </button>
  );
}

export default LogoutBtn;
