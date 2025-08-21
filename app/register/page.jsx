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
          width: '100vw'
        }}
      >
        <div>Sign Up</div>
        <GoogleLoginButton></GoogleLoginButton>
      </div>
    </>
  )
}

export default Register
