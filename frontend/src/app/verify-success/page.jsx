"use client";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifySuccess() {
  const router = useRouter();

  useEffect(() => {
    Swal.fire({
      icon: "success",
      title: "Registration successful!",
      text: "Your account is now verified. Please log in.",
    }).then(() => {
      router.push("login"); // ya phir homepage pe bhejna ho to "/"
    });
  }, []);

  return (
    <div className="h-screen flex items-center justify-center text-lg">
      Verifying your account...
    </div>
  );
}
