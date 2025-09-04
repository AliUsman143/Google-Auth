"use client";

import { useState } from "react";
import AuthModal from "../components/AuthModal";

export default function LoginPage() {
  const [showModal, setShowModal] = useState(true);

  const handleLoginSuccess = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    // redirect to homepage after login
    window.location.href = "/";
  };

  return (
    <>
      {showModal && (
        <AuthModal
          onClose={() => setShowModal(false)}
          onLoginSuccess={(user, token) => {
            console.log("Logged in:", user);
          }}
        />
      )}
    </>
  );
}
