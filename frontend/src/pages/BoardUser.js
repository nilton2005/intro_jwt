import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";

const BoardUser = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    UserService.getUserBoard().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(_content);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-hacker-dark-700 p-6 rounded-sm border border-hacker-green-700 shadow-lg">
        <header className="mb-6">
          <h3 className="text-2xl font-bold">
            <span className="text-hacker-green-300">&lt;</span> User Dashboard <span className="text-hacker-green-300">/&gt;</span>
          </h3>
        </header>
        
        <div className="font-mono text-hacker-green-400 bg-hacker-dark-800 p-6 rounded-sm border border-hacker-green-700 shadow-inner">
          <p className="mb-3">$ ./user_access.sh</p>
          <p className="mb-3 text-hacker-green-300">== User Access Terminal ==</p>
          <p className="mb-3">Authentication: <span className="text-hacker-green-500">VERIFIED</span></p>
          <p className="mb-3">Status: <span className="text-hacker-green-500">ACTIVE</span></p>
          <p className="mb-3">Message: {content}</p>
          <p className="mb-3">$ _<span className="animate-pulse">|</span></p>
        </div>
        
        <div className="mt-8">
          <h4 className="text-xl font-bold mb-4">User Actions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-hacker-dark-800 p-4 rounded-sm border border-hacker-green-700">
              <h5 className="text-lg font-bold mb-2">Personal Settings</h5>
              <p className="text-hacker-green-400 mb-4">Configure your account preferences</p>
              <button className="bg-hacker-dark-700 text-hacker-green-500 border border-hacker-green-500 px-4 py-2 rounded-sm hover:bg-hacker-dark-600">
                Access Settings
              </button>
            </div>
            
            <div className="bg-hacker-dark-800 p-4 rounded-sm border border-hacker-green-700">
              <h5 className="text-lg font-bold mb-2">Security Check</h5>
              <p className="text-hacker-green-400 mb-4">Review your account security</p>
              <button className="bg-hacker-dark-700 text-hacker-green-500 border border-hacker-green-500 px-4 py-2 rounded-sm hover:bg-hacker-dark-600">
                Run Check
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardUser;