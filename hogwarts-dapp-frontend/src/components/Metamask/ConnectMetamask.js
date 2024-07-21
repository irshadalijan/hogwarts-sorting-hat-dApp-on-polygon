import React from 'react';
import "./MetamaskButton.css";

const ConnectMetamask = ({ connectMetamask }) => (
  <button className="metamask-button" onClick={connectMetamask}>Connect Wallet</button>
);

export default ConnectMetamask;
