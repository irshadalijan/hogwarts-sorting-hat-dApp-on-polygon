import React from 'react';
import HogwartsLogo from "../../assets/hogwarts_logo.png";
import "./Header.css";

const Header = ({ userName }) => (
  <div className="header">
    <img className="hogwarts-logo" src={HogwartsLogo} alt="Hogwarts Logo" />
    <h1>Welcome to Hogwarts {userName}</h1>
  </div>
);

export default Header;
