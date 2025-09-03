"use client";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifySuccess() {
  const router = useRouter();

  useEffect(() => {
    Swal.fire({
      icon: "success",
      title: "🎉 Email Verified",
      text: "Your account is now active. Please login to continue.",
      confirmButtonText: "Go to Login",
    }).then(() => {
      router.push("/login"); // redirect after alert
    });
  }, []);

  return (
    <div className="h-screen flex items-center justify-center text-lg">
      Verifying your account...
    </div>
  );
}
