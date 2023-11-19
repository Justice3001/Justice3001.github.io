// Import react into the bundle
import React from 'react';
import ReactDOM from 'react-dom';

// Include your index.scss file into the bundle
import '../styles/index.css';

// Import your own components
import Layout from './layout';
import Search from './pages/search.jsx';
import Recommendations from './pages/Recon.jsx';
import App from './pages/App.jsx';

// Import the SpotifyAuthWrapper component
import SpotifyAuthWrapper from './component/SpotifyAuthWrapper.js';

// Render your react application wrapped in SpotifyAuthWrapper
ReactDOM.render(
  <SpotifyAuthWrapper>
    {/* Your other components that require Spotify authentication */}
     <Layout /> 
    {/* Example: <Search /> */}
     {/*<Recommendations /> */}
    {/* Example: <App /> */}
  </SpotifyAuthWrapper>,
  document.querySelector('#app')
);
