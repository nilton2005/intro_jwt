import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";

const BoardModerator = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    UserService.getModeratorBoard().then(
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
            <span className="text-hacker-green-300">&lt;</span> Moderator Console <span className="text-hacker-green-300">/&gt;</span>
          </h3>
        </header>
        
        <div className="font-mono text-hacker-green-400 bg-hacker-dark-800 p-6 rounded-sm border border-hacker-green-700 shadow-inner">
          <p className="mb-3">$ ./moderator_console.sh</p>
          <p className="mb-3 text-hacker-green-300">== Moderator Access Granted ==</p>
          <p className="mb-3">Authentication: <span className="text-hacker-green-500">VERIFIED</span></p>
          <p className="mb-3">Role: <span className="text-hacker-green-500">MODERATOR</span></p>
          <p className="mb-3">Message: {content}</p>
          <p className="mb-3">$ _<span className="animate-pulse">|</span></p>
        </div>
        
        <div className="mt-8">
          <h4 className="text-xl font-bold mb-4">Moderation Tools</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-hacker-dark-800 p-4 rounded-sm border border-hacker-green-700">
              <h5 className="text-lg font-bold mb-2">Content Review</h5>
              <p className="text-hacker-green-400 mb-4">Review and moderate user content</p>
              <button className="bg-hacker-dark-700 text-hacker-green-500 border border-hacker-green-500 px-4 py-2 rounded-sm hover:bg-hacker-dark-600">
                Access Tool
              </button>
            </div>
            
            <div className="bg-hacker-dark-800 p-4 rounded-sm border border-hacker-green-700">
              <h5 className="text-lg font-bold mb-2">Activity Logs</h5>
              <p className="text-hacker-green-400 mb-4">Review recent system activity</p>
              <button className="bg-hacker-dark-700 text-hacker-green-500 border border-hacker-green-500 px-4 py-2 rounded-sm hover:bg-hacker-dark-600">
                View Logs
              </button>
            </div>
            
            <div className="bg-hacker-dark-800 p-4 rounded-sm border border-hacker-green-700">
              <h5 className="text-lg font-bold mb-2">Reports</h5>
              <p className="text-hacker-green-400 mb-4">View user reports and issues</p>
              <button className="bg-hacker-dark-700 text-hacker-green-500 border border-hacker-green-500 px-4 py-2 rounded-sm hover:bg-hacker-dark-600">
                Check Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardModerator;