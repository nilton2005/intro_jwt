import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";

const Register = () => {
  const form = useRef();
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!username.trim()) {
      formErrors.username = "Username is required";
      isValid = false;
    } else if (username.length < 3) {
      formErrors.username = "Username must be at least 3 characters";
      isValid = false;
    } else if (username.length > 20) {
      formErrors.username = "Username must not exceed 20 characters";
      isValid = false;
    }

    if (!email.trim()) {
      formErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(email)) {
      formErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!password) {
      formErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      formErrors.password = "Password must be at least 6 characters";
      isValid = false;
    } else if (password.length > 40) {
      formErrors.password = "Password must not exceed 40 characters";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);

    if (validateForm()) {
      AuthService.register(username, email, password).then(
        (response) => {
          setMessage(response.data.message);
          setSuccessful(true);
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setMessage(resMessage);
          setSuccessful(false);
        }
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="bg-hacker-dark-700 p-6 rounded-sm border border-hacker-green-700 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Sign Up</h1>
          <div className="text-sm text-hacker-green-400 mt-2">
            &lt; Create your account /&gt;
          </div>
        </div>

        {!successful && (
          <form onSubmit={handleRegister} ref={form}>
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
              <label htmlFor="email" className="block mb-2 text-hacker-green-400">
                Email
              </label>
              <input
                type="text"
                className={`w-full ${errors.email ? 'border-red-500' : ''}`}
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <div className="text-red-500 mt-1 text-sm">{errors.email}</div>
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
              >
                Sign Up
              </button>
            </div>
          </form>
        )}

        {message && (
          <div
            className={`mt-4 p-3 rounded-sm border ${
              successful
                ? "bg-green-900 border-green-700 text-white"
                : "bg-red-900 border-red-700 text-white"
            }`}
          >
            {message}
          </div>
        )}

        {successful && (
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-hacker-green-400 hover:text-hacker-green-300"
            >
              Proceed to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;