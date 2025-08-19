"use client"

import React from 'react'
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setMessage("Signup successful!");
      console.log("Server response:", data);
      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (err) {
      setError(err.message);
    }
  };

  return(
    <>
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
        ></img>
      </div>
      <div 
        className="d-flex flex-column align-items-center"
        style={{
          height: `calc(100vh - 10vh)`,
          paddingTop:`2vh`
        }}
      >
        <h1>Create Your MinesweeperVs Account</h1>
        {/* <img src="Minesweepervslogo.png"
          style={{
            height: ``
          }}
        ></img> */}
        <form 
          onSubmit={handleSubmit} 
          className="convex-minesweeper-no-hover" 
          style={{ 
            width: "20vw",
            padding: `1vw`,
            marginTop:`3vh`
          }}
        >
          <h3 className="text-center mb-3">Sign Up</h3>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

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

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              className="form-control"
              value={formData.confirmPassword}
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

          <button type="submit" className="btn btn-primary w-100">Sign Up</button>
        </form>
      </div>
    </>
  )
}

export default Register
