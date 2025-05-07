import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h2 className="text-5xl font-bold text-hacker-green-400 mb-4">404</h2>
          <h3 className="text-3xl font-bold mb-6">Page Not Found</h3>
          <div className="font-mono text-hacker-green-400 bg-hacker-dark-800 p-6 rounded-sm border border-hacker-green-700 shadow-inner text-left overflow-auto mb-8">
            <p className="mb-3">$ ./locate.sh</p>
            <p className="mb-3 text-red-500">Error: Target not found in system</p>
            <p className="mb-3 text-hacker-green-300">
              &gt; Connection terminated: The requested resource does not exist
            </p>
            <p className="mb-3 text-hacker-green-500">
              &gt; Suggestion: Return to secure zone
            </p>
            <p className="mb-3">$ _<span className="animate-pulse">|</span></p>
          </div>
          <p className="text-lg mb-8">
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>
          <Link
            to="/"
            className="inline-block bg-hacker-dark-700 text-hacker-green-500 border border-hacker-green-500 px-6 py-3 rounded-sm hover:bg-hacker-dark-600"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
