import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";
import MatrixRain from "../components/MatrixRain";

const Home = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    UserService.getPublicContent().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <MatrixRain />
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">
          <span className="text-hacker-green-300">&lt;</span>
          Hacker Authentication
          <span className="text-hacker-green-300">/&gt;</span>
        </h1>
        
        <div className="border-t border-b border-hacker-green-800 py-8 my-8">
          <div className="max-w-2xl mx-auto">
            <div className="font-mono text-hacker-green-400 bg-hacker-dark-800 p-6 rounded-sm border border-hacker-green-700 shadow-inner text-left overflow-auto">
              <p className="mb-3">$ ./welcome.sh</p>
              <p className="mb-3 text-hacker-green-300 text-lg">== Welcome to the Secure Terminal ==</p>
              <p className="mb-3 typing-animation">
                {content || "Loading public content..."}
              </p>
              <p className="mb-3 text-hacker-green-500">
                Use the navigation menu to access restricted areas.
              </p>
              <p className="mb-3">$ _<span className="animate-pulse">|</span></p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-hacker-dark-800 p-4 rounded-sm border border-hacker-green-700">
            <h3 className="text-xl font-bold mb-2">User Access</h3>
            <p className="text-hacker-green-400 mb-4">Basic authenticated user features</p>
            <div className="text-sm text-hacker-green-600">Login required</div>
          </div>
          
          <div className="bg-hacker-dark-800 p-4 rounded-sm border border-hacker-green-700">
            <h3 className="text-xl font-bold mb-2">Moderator Panel</h3>
            <p className="text-hacker-green-400 mb-4">Content moderation tools</p>
            <div className="text-sm text-hacker-green-600">Moderator role required</div>
          </div>
          
          <div className="bg-hacker-dark-800 p-4 rounded-sm border border-hacker-green-700">
            <h3 className="text-xl font-bold mb-2">Admin Console</h3>
            <p className="text-hacker-green-400 mb-4">Full system administration</p>
            <div className="text-sm text-hacker-green-600">Admin role required</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;