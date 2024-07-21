import React from 'react';
import "./Mint.css";

const MintNFT = ({ requestNFT, userName, isUserNameSubmitted, showNameField, loading, minted, displayCounter, counter, dynamicLoadingMessage, defaultLoadingMessage }) => (
  <>
    {!userName || !isUserNameSubmitted ? showNameField() :
      !loading ? <button onClick={requestNFT} disabled={minted}>Let's choose your house</button> :
        <p className="loading-button-msg">{displayCounter ? (counter ? dynamicLoadingMessage : defaultLoadingMessage) : defaultLoadingMessage}</p>
    }
  </>
);

export default MintNFT;
