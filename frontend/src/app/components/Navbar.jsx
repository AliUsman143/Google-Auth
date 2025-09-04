"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) setUser(JSON.parse(userData));

    if (localStorage.getItem("showLoginAfterVerify") === "true") {
      setShowModal(true);
      localStorage.removeItem("showLoginAfterVerify");
    }

    // ✅ If reset link is clicked from email
    if (searchParams.get("reset") === "true" && searchParams.get("token")) {
      setShowModal(true); // open modal
    }
  }, [searchParams]);

  const handleLoginSuccess = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setShowModal(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <>
      <nav className="bg-white shadow-md py-3">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">Logo</span>

          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-600">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600">
              About
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600">
              Services
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600">
              Contact
            </a>
          </div>

          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {showModal && (
        <AuthModal
          onClose={() => setShowModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
}
