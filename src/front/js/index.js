//import react into the bundle
import React from "react";
import ReactDOM from "react-dom";

//include your index.scss file into the bundle
import "../styles/index.css";

//import your own components
import Layout from "./layout";
//import PlaylistDetails from "./pages/home.jsx";
import Search from "./pages/search.jsx";
import Recommendations from "./pages/Recon.jsx";
import App from "./pages/App.jsx";

//render your react application
//ReactDOM.render(<Layout />, document.querySelector("#app"));
//ReactDOM.render(<Search />, document.querySelector("#app"));
//ReactDOM.render(<Recommendations/>, document.querySelector("#app"));
ReactDOM.render(<App/>, document.querySelector("#app"));

