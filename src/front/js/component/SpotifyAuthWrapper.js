import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SpotifyAuthWrapper = ({ children }) => {
  const [accessToken, setAccessToken] = useState('');

  const getRefreshToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    const clientId = '5aa86719c259487c82565468bbaa1d2e'; // Replace with your actual client ID
    const url = 'https://accounts.spotify.com/api/token';

    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
      }),
    };

    try {
      const response = await fetch(url, payload);
      const data = await response.json();

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);

      setAccessToken(data.access_token);
    } catch (error) {
      console.error('Error refreshing access token:', error);
      // Handle errors (e.g., reauthentication)
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!accessToken) {
          await getRefreshToken();
        }

        // Now you have the refreshed access token, proceed with your API calls
        // (You may want to pass the accessToken to the child components)
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle errors (e.g., reauthentication)
      }
    };

    fetchData();

    // Set an interval to refresh the token every 40 minutes
    const tokenRefreshInterval = setInterval(getRefreshToken, 40 * 60 * 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(tokenRefreshInterval);
  }, [accessToken]);

  return React.Children.map(children, (child) =>
    React.cloneElement(child, { accessToken }) // Pass accessToken as a prop to children
  );
};

export default SpotifyAuthWrapper;
