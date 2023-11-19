import React, { useState, useEffect } from 'react';
import SpotifyLoginButton from '../component/SpotLogin';
import 'react-spotify-auth/dist/index.css';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('spotifyAuthToken'));

  const onAccessToken = (token) => {
    // Handle the retrieved access token, e.g., store it in localStorage
    localStorage.setItem('spotifyAuthToken', token);
    setToken(token);
  };

  useEffect(() => {
    // Your code to perform actions after authentication (e.g., fetching user data)
    if (token) {
      // Perform actions when the user is logged in
      console.log('User is logged in!');
    }
  }, [token]);

  return (
    <div>
      {/* Your components */}
      {token ? (
        <p>User is logged in!</p>
      ) : (
        <SpotifyLoginButton
          clientID="5aa86719c259487c82565468bbaa1d2e"
          redirectUri="https://www.google.com/"
          onAccessToken={onAccessToken}
        />
      )}
    </div>
  );
};

export default App;
