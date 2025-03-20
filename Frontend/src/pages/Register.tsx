import React, { useState } from "react";
import SignUp from "../components/signup";
import VerifyEmail from "../components/VerifyEmail";

const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [showVerification, setShowVerification] = useState<boolean>(false);

  const handleSignup = async (
    email: string,
    password: string,
    role: string
  ) => {
    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (res.status === 200) {
        setEmail(email);
        setShowVerification(true);
      } else {
        console.log(`Signup failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Something went wrong. Please try again later.....");
    }
  };

  const handleVerify = async (
    code: string,
    setIsVerified: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    try {
      const res = await fetch("http://locahost:3000/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (res.status === 200) {
        setIsVerified(true);
        setTimeout(() => (window.location.href = "/dashboard"), 2000);
      } else {
        alert(`verification failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error during verification:", error);
      alert("Verification failed. try again later");
    }
  };

  const handleResendCode = async () => {
    try {
      await fetch("http://localhost:3000/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "appication/json" },
        body: JSON.stringify({ email }),
      });
      alert("New Verification code sent to your email.");
    } catch (error) {
      console.error("Error resending code:", error);
      alert("Failed to resend code.");
    }
  };

  return showVerification ? (
    <VerifyEmail
      onVerify={handleVerify}
      onResend={handleResendCode}
      email={email}
    />
  ) : (
    <SignUp onSignup={handleSignup} />
  );
};

export default Register;
