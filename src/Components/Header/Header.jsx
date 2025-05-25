import React, { useState } from "react";
import { LogoutBtn, Container, Logo, Button } from "../index";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import hamburgerIcon from "/icon-hamburger.svg";
import closeIcon from "/icon-close.svg";
import "./Header.css";
import UserProfilePhoto from "../ui/userProfilePhoto";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const [navOpen, setNavOpen] = useState(false);
  const userId = useSelector((state) => state.auth.userData?.$id);
  const userName = useSelector((state) => state.auth.userData?.name);

  const closeNavbar = () => {
    setNavOpen(false);
  };

  const toggleNavbar = () => {
    setNavOpen(!navOpen);
  };
  
  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ];

  return (
    <header className={`py-4 sticky top-0 z-50 transition-colors duration-300 ${navOpen ? 'bg-[#040813]' : 'bg-transparent backdrop-blur-sm'}`}>
      <Container>
        <nav className="flex justify-between items-center relative">
          {/* Logo and GitHub Link */}
          <div className="flex items-center z-20">
            <Link to="/" onClick={closeNavbar}>
              <Logo width="100px" />
            </Link>
            <div className="inline-block px-4 py-2 duration-200 hover:text-white">
              <a
                href="https://github.com/ayushichoudhary-19/BlogHub"
                target="_blank"
                rel="noopener noreferrer"
                className="github-link"
              >
                <svg
                  width="30"
                  height="30"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 100"
                  className="github-icon"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                    fill="#fff"
                    className="github-path"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={toggleNavbar} 
            className="md:hidden z-20 w-10 h-10 flex items-center justify-center focus:outline-none"
            aria-label="Toggle menu"
          >
            <img src={navOpen ? closeIcon : hamburgerIcon} alt="" className="w-6 h-6" />
          </button>

          <div 
            className={`${navOpen ? 'flex' : 'hidden'} md:flex fixed md:relative inset-0 md:inset-auto flex-col md:flex-row items-center justify-center md:justify-end bg-[#040813] md:bg-transparent pt-16 md:pt-0 z-10 transition-all duration-300 ease-in-out`}
          >
            <ul className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 mb-8 md:mb-0">
              {navItems.map(
                (item) =>
                  item.active && (
                    <li key={item.name}>
                      <NavLink
                        onClick={closeNavbar}
                        to={item.slug}
                        className={({isActive}) => 
                          `block px-4 py-2 text-lg md:text-base transition-colors duration-200 ${isActive ? 'text-customPurple' : 'text-white hover:text-gray-300'}`
                        }
                      >
                        {item.name}
                      </NavLink>
                    </li>
                  )
              )}
            </ul>
            
            {/* User Profile and Logout */}
            {authStatus ? (
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-3 md:ml-4">
                <Link 
                  to={`/profile/${userId}`} 
                  onClick={closeNavbar}
                  className="profile-link hover:opacity-80 transition-opacity duration-200"
                >
                  <UserProfilePhoto userName={userName} />
                </Link>
                <div onClick={closeNavbar}>
                  <LogoutBtn />
                </div>
              </div>
            ) : (
              <div className="mt-6 md:mt-0 md:ml-4">
                <NavLink
                  onClick={closeNavbar}
                  to={"/signup"}
                  className="py-2 px-5 text-white rounded-lg shadow-sm hover:scale-105 duration-200 hover:cursor-pointer bg-customPurple hover:bg-white hover:text-black"
                >
                  Signup
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
