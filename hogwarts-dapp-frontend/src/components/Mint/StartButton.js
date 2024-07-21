import React from 'react';
import "./Mint.css";

const StartButton = ({ checkNetwork }) => (
  <button className="start-button" onClick={checkNetwork}>
    Let's go to the Great Hall
  </button>
);

export default StartButton;
