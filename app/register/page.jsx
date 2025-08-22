"use client"

import React from 'react'
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

import GoogleLoginButton from '../../components/googlesignup'

const Register = () => {
  const router = useRouter();

  return(
    <>
      <div 
        className="d-flex flex-column align-items-center"
        style={{
          width: '100vw',
          position: 'relative'
        }}
      >
        {/* Log In Button Top Right Corner */}
        <button
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            padding: '0.5rem 1rem',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '1.5rem'
          }}
          onClick={() => router.push("/login")}
        >
          Log In
        </button>

        <button
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
        </button>

        <h1 style={{marginTop:'2vh'}}>Create Your MinesweeperVs Account</h1>

        <img src="Minesweepervslogo.png" style={{width:'10vw'}}></img>

        <button 
          className="convex-red"
          style={{
            width: '25vw',
            height: '6vh',
            margin: 0,
            marginTop:'5vh',
            marginBottom: '0.75rem',
            cursor:'pointer',
            backgroundColor:'red',
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={()=> router.push("/signup")}
        >
          Sign Up
        </button>

        <div className="d-flex align-items-center" style={{ width: '40vw' }}>
          <hr style={{ flex: 1, border: '1px solid #171717' }} />
          <span style={{ margin: '0 10px', whiteSpace: 'nowrap' }}>Or</span>
          <hr style={{ flex: 1, border: '1px solid #171717' }} />
        </div>
        
        <GoogleLoginButton></GoogleLoginButton>
      </div>
    </>
  )
}

export default Register
