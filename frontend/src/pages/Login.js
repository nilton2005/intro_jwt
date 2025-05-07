import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const Login = () => {
  const form = useRef();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!username.trim()) {
      formErrors.username = "Username is required";
      isValid = false;
    }

    if (!password) {
      formErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      formErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage("");
    
    if (validateForm()) {
      setLoading(true);

      AuthService.login(username, password).then(
        () => {
          navigate("/profile");
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setLoading(false);
          setMessage(resMessage);
        }
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-hacker-dark-700 p-6 rounded-sm border border-hacker-green-700 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Login</h1>
          <div className="text-sm text-hacker-green-400 mt-2">
            &lt; Access the system /&gt;
          </div>
        </div>

        <form onSubmit={handleLogin} ref={form}>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2 text-hacker-green-400">
              Username
            </label>
            <input
              type="text"
              className={`w-full ${errors.username ? 'border-red-500' : ''}`}
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && (
              <div className="text-red-500 mt-1 text-sm">{errors.username}</div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-hacker-green-400">
              Password
            </label>
            <input
              type="password"
              className={`w-full ${errors.password ? 'border-red-500' : ''}`}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <div className="text-red-500 mt-1 text-sm">{errors.password}</div>
            )}
          </div>

          <div className="mt-6">
            <button
              className="w-full py-3 font-bold text-hacker-green-400 bg-hacker-dark-800 hover:bg-hacker-dark-600 border border-hacker-green-500"
              disabled={loading}
            >
              {loading ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-hacker-green-500" xmlns="https://www.svgrepo.com/show/512522/mr-robot-120.svg " fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </div>

          {message && (
            <div className="mt-4 bg-red-900 p-3 rounded-sm border border-red-700 text-white">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;