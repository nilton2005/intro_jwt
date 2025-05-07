import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const Profile = () => {
  const [redirect, setRedirect] = useState(null);
  const [userReady, setUserReady] = useState(false);
  const [currentUser, setCurrentUser] = useState({ username: "" });

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) {
      setRedirect("/login");
    } else {
      setUserReady(true);
      setCurrentUser(currentUser);
    }
  }, []);

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      {userReady ? (
        <div className="bg-hacker-dark-700 p-6 rounded-sm border border-hacker-green-700 shadow-lg">
          <header className="text-center mb-8">
            <h3 className="text-2xl font-bold">
              <span className="text-hacker-green-300">&lt;</span> User Profile <span className="text-hacker-green-300">/&gt;</span>
            </h3>
          </header>
          
          <div className="mb-6 p-4 bg-hacker-dark-800 rounded-sm border border-hacker-green-700">
            <p className="mb-2">
              <strong className="text-hacker-green-400 mr-2">Token:</strong>
              <span className="text-xs break-all">{currentUser.accessToken.substring(0, 20)} ... {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}</span>
            </p>
            <p className="mb-2">
              <strong className="text-hacker-green-400 mr-2">Id:</strong>
              {currentUser.id}
            </p>
            <p className="mb-2">
              <strong className="text-hacker-green-400 mr-2">Email:</strong>
              {currentUser.email}
            </p>
            <div>
              <strong className="text-hacker-green-400 mr-2">Authorities:</strong>
              <ul className="pl-6 mt-1 list-disc">
                {currentUser.roles &&
                  currentUser.roles.map((role, index) => (
                    <li key={index} className="text-hacker-green-300">
                      {role}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-4 text-xs text-hacker-green-700 font-mono">
            <p className="mb-1">* User data is securely stored in localStorage</p>
            <p>* Token will expire after the server-defined period</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Profile;