import React from 'react';
import "./Mint.css";

const ShowNameField = ({ userName, setUserName, submitUserName }) => (
  <div className="form">
    <input className="input-box"
      type="text" 
      placeholder="Enter your name" 
      value={userName} 
      onChange={(e) => setUserName(e.target.value)}
    />
    <button className="form-button" onClick={submitUserName}>Submit</button>
  </div>
);

export default ShowNameField;
