import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const SignAdmin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isGoogle, setIsGoogle] = useState(false);

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/signup",
        {
          email,
          password,
        }
      );
      alert("OTP sent to your email!");
    } catch (error) {
      console.error(error);
      alert("Signup failed!");
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/google",
        {
          token: credentialResponse.credential,
        }
      );
      alert(response.data.message || "Logged in with Google!");
    } catch (error) {
      console.error(error);
      alert("Google Login failed!");
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button onClick={handleSignup}>Sign Up</button>
      </form>
      <hr />
      <h2>Or</h2>
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => console.error("Google Login Failed")}
      />
    </div>
  );
};

export default SignAdmin;
