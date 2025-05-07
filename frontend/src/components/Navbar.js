import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";

const Navbar = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    setShowModeratorBoard(false);
    setShowAdminBoard(false);
  };

  const toggleMenu = () => {
    setExpanded(!expanded);
  };

  return (
    <nav className="bg-hacker-dark-900 text-hacker-green-500 border-b border-hacker-green-700 py-4 px-6">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        {/* Logo and Hamburger */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link to={"/"} className="font-bold text-xl no-underline">
            <span className="text-hacker-green-400">&lt;</span>
            HackerAuth
            <span className="text-hacker-green-400">/&gt;</span>
          </Link>
          
          <button 
            className="md:hidden border-hacker-green-500 border p-1 rounded"
            onClick={toggleMenu}
          >
            <svg className="w-6 h-6 fill-current text-hacker-green-500" viewBox="0 0 24 24">
              {expanded ? (
                <path fillRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z" />
              ) : (
                <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div className={`${expanded ? 'block' : 'hidden'} w-full md:flex md:items-center md:w-auto mt-4 md:mt-0`}>
          <div className="md:flex-grow">
            <Link to={"/home"} className="block mt-4 md:inline-block md:mt-0 mr-6 no-underline hover:text-hacker-green-300">
              Home
            </Link>

            {showModeratorBoard && (
              <Link to={"/mod"} className="block mt-4 md:inline-block md:mt-0 mr-6 no-underline hover:text-hacker-green-300">
                Moderator Board
              </Link>
            )}

            {showAdminBoard && (
              <Link to={"/admin"} className="block mt-4 md:inline-block md:mt-0 mr-6 no-underline hover:text-hacker-green-300">
                Admin Board
              </Link>
            )}

            {currentUser && (
              <Link to={"/user"} className="block mt-4 md:inline-block md:mt-0 mr-6 no-underline hover:text-hacker-green-300">
                User Board
              </Link>
            )}
          </div>

          {currentUser ? (
            <div className="md:flex items-center">
              <Link to={"/profile"} className="block mt-4 md:inline-block md:mt-0 mr-6 no-underline hover:text-hacker-green-300">
                <span className="mr-1">@</span>{currentUser.username}
              </Link>
              <a href="/login" className="block mt-4 md:inline-block md:mt-0 no-underline hover:text-hacker-green-300" onClick={logOut}>
                LogOut
              </a>
            </div>
          ) : (
            <div className="md:flex items-center">
              <Link to={"/login"} className="block mt-4 md:inline-block md:mt-0 mr-6 no-underline hover:text-hacker-green-300">
                Login
              </Link>
              <Link to={"/register"} className="block mt-4 md:inline-block md:mt-0 no-underline hover:text-hacker-green-300">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;