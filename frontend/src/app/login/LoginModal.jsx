"use client";

import { useState } from "react";

export default function LoginModal({ onClose, onLoginSuccess }) {
  const [view, setView] = useState("choice");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      let url = "";
      let body = {};

      if (view === "login") {
        url = "http://localhost:5000/api/auth/login";
        body = { email: data.email, password: data.password };
      } else if (view === "signup") {
        if (data.password !== data.confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        url = "http://localhost:5000/api/auth/register";
        body = { name: data.name, email: data.email, password: data.password };
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (result.status === "success") {
        onLoginSuccess?.(result.data?.user, result.token);
        onClose();
      } else {
        setError(result.message || "Request failed");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative shadow-lg">
        {/* Close */}
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Choice screen */}
        {view === "choice" && (
          <>
            <h2 className="text-gray-900 font-extrabold text-xl mb-1">
              Welcome!
            </h2>
            <p className="text-gray-700 text-sm mb-6">
              Sign up or log in to continue
            </p>

            {/* Google */}
            <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-900 font-normal py-2 rounded mb-3 flex items-center justify-center gap-2">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                alt="Google logo"
                className="w-5 h-5"
              />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center mb-6">
              <hr className="border-gray-300 flex-grow" />
              <span className="text-gray-400 text-xs mx-3">or</span>
              <hr className="border-gray-300 flex-grow" />
            </div>

            {/* Login / Signup buttons */}
            <button
              onClick={() => setView("login")}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded mb-3"
            >
              Log in
            </button>
            <button
              onClick={() => setView("signup")}
              className="w-full border border-gray-700 text-gray-900 font-normal py-2 rounded"
            >
              Sign up
            </button>
          </>
        )}

        {/* Login form */}
        {view === "login" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Login</h2>
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 border rounded-md"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-3 border rounded-md"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-sm text-center mt-4">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => setView("signup")}
                className="text-blue-500 hover:underline"
              >
                Sign up here
              </button>
            </p>
          </form>
        )}

        {/* Signup form */}
        {view === "signup" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sign Up</h2>
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full p-3 border rounded-md"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 border rounded-md"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-3 border rounded-md"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full p-3 border rounded-md"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-blue-500 hover:underline"
              >
                Login here
              </button>
            </p>
          </form>
        )}

        {/* Terms */}
        <p className="text-xs text-gray-500 mt-6 leading-tight text-center">
          By signing up, you agree to our{" "}
          <a href="#" className="text-pink-600 hover:underline font-semibold">
            Terms and Conditions
          </a>{" "}
          and{" "}
          <a href="#" className="text-pink-600 hover:underline font-semibold">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
