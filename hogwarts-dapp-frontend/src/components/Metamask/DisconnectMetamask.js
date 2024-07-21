import React from 'react';
import "./MetamaskButton.css";

const DisconnectMetamask = ({ disconnectMetamask }) => (
  <button className="metamask-button" onClick={disconnectMetamask}>Disconnect Wallet</button>
);

export default DisconnectMetamask;
