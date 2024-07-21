import React from 'react';
import "./Mint.css";

const MintedView = ({ loading, house, houseSlogan, displayCounter, counter, dynamicLoadingMessage, defaultLoadingMessage }) => (
  <>
    {loading || !house ? (
      <p>{displayCounter ? (counter ? dynamicLoadingMessage : defaultLoadingMessage) : defaultLoadingMessage}</p>
    ) : (
      <>
        <p>{house}</p>
        {houseSlogan.split('. ').map((slogan, index) => (
          <p key={index}>{slogan}</p>
        ))}
      </>
    )}
  </>
);

export default MintedView;
