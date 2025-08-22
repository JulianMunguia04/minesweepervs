"use client"

import { useGoogleLogin } from '@react-oauth/google';
import { useRouter } from "next/navigation";

function GoogleSignUpButton() {
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (!tokenResponse.access_token) return;

      try {
        // Fetch user info from Google
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`
          }
        });

        const user = await res.json(); // now user.sub, user.email, etc. exist
        console.log("Google user info:", user);

        // Send user info to your backend
        const response = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Signup failed");
        }

        console.log("Server response:", data);

        setTimeout(() => {
          router.push("/");
        }, 500);
      } catch (err) {
        console.error(err.message);
      }
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  return (
    <button
      onClick={() => login()} // trigger Google login
      className="convex-darkgray "
      style={{
        width: '25vw',
        height: '6vh',
        padding: "12px 24px",
        backgroundColor: "#9E9E9E",
        fontWeight: "bold",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        marginTop:'3vh',
      }}
    >
      <img
        src="/GoogleLogo.png" // optional Google logo
        alt="Google"
        style={{ height: "100%" }}
      />
      Sign up with Google
    </button>
  );
}

export default GoogleSignUpButton;
