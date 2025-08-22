"use client"

import React, { useState } from 'react'
import { useRouter } from "next/navigation";
import GoogleLoginButton from "../../components/googlelogin"

const Register = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const FRONTEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

      const res = await fetch(`${FRONTEND_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include"
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
      } else {
        setMessage(data.message);
        router.push("/");
      }

    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again.");
    }
  };

  return(
    <>
      {/* Logo */}
      <div 
        className="d-flex justify-content-center align-items-center"
        style={{
          paddingTop:`2vh`,
          margin:`none`
        }}
        onClick={() => window.location.href = '/'}
      >
        <img src="logo-full.png"
          style={{
            height: '5vh'
          }}
        />
      </div>

      {/* Main Content */}
      <div 
        className="d-flex flex-column align-items-center"
        style={{
          height: `calc(100vh - 10vh)`,
          paddingTop:`2vh`
        }}
      >
        <h1>Log In To Your MinesweeperVs Account</h1>

        {/* Wrapper for form + Google login */}
        <div 
          className="convex-minesweeper-no-hover d-flex flex-column align-items-center"
          style={{ 
            width: "20vw",
            padding: `1vw`,
            marginTop:`3vh`
          }}
        >
          {/* Form */}
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <h3 className="text-center mb-3">Log In</h3>

            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Show Password */}
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="showPasswordCheck"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label className="form-check-label" htmlFor="showPasswordCheck">
                Show Password
              </label>
            </div>

            {error && <p className="text-danger">{error}</p>}
            {message && <p className="text-success">{message}</p>}

            <button type="submit" className="btn btn-primary w-100">Log In</button>
          </form>

          {/* Divider */}
          <div className="d-flex align-items-center w-100" style={{marginTop:"2vh"}}>
            <hr className="flex-grow-1 m-0" />
            <span className="mx-2 small text-muted">OR</span>
            <hr className="flex-grow-1 m-0" />
          </div>

          {/* Google Login Button*/}
          <GoogleLoginButton />
          <div style={{marginTop:"2vh"}}>New? <a href="/register">Sign Up</a> and start playing</div>
        </div>
      </div>
    </>
  )
}

export default Register
