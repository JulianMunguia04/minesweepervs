import { GoogleLogin } from '@react-oauth/google';
import { decodeJwt } from "jose";

function GoogleSignUpButton() {
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        if (!credentialResponse.credential) return;
        const decoded = decodeJwt(credentialResponse.credential);
        console.log(decoded); 
        
        fetch("/api/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ user: decoded })
        });
      }}

      onError={() => {
        console.log("Login Failed");
      }}
    />
  );
}

export default GoogleSignUpButton;