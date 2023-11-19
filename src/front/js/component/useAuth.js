import { useState, useEffect } from "react";
import axios from "axios";

export default function useAuth() {
  const [accessToken, setAccessToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  const refreshTokenUrl = "http://localhost:3001/refresh"; // Replace with your actual refresh token endpoint

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(refreshTokenUrl, {
        // Pass refresh token if needed
      });

      setAccessToken(response.data.accessToken);
      setExpiresIn(response.data.expiresIn);
    } catch (error) {
      // Handle token refresh failure (e.g., redirect to login)
      console.error("Error refreshing access token:", error);
    }
  };

  useEffect(() => {
    // Initial token fetch or any logic to obtain the access token
    // (e.g., you might have a login process that sets the initial token)

    // Mocking initial token fetch for demonstration purposes
    setAccessToken("initialAccessToken");
    setExpiresIn(3600); // assuming token expires in 1 hour

    // Start the token refresh interval
    const interval = setInterval(refreshAccessToken, (expiresIn - 60) * 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return accessToken;
}
