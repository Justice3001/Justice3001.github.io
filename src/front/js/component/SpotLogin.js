import React from 'react';
import { SpotifyAuth, Scopes } from 'react-spotify-auth';

const SpotifyLoginButton = () => {
  return (
    <SpotifyAuth
      redirectUri="https://www.google.com/"
      clientID="5aa86719c259487c82565468bbaa1d2e"
      scopes={[Scopes.userReadPrivate, Scopes.userReadEmail]} // Add necessary scopes
    />
  );
};

export default SpotifyLoginButton;
