// Navbar.js

import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <a className="navbar-brand" href="#">
        Sound Escape
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto"> {/* ml-auto to push the items to the right */}
          <li className="nav-item active">
            <a className="nav-link" href="#">
              Home <span className="sr-only">(current)</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Search
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
			Recommendations
            </a>
          </li>
		  <li className="nav-item">
            <a className="nav-link" href="#">
			Curated Playlists
            </a>
          </li>
		  <li className="nav-item">
            <a className="nav-link" href="#">
              New Releases
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
