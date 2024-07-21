import React from 'react';
import Lottie from 'lottie-react';
import HPLoader from '../../loaders/hpLoader.json';
import "./Loading.css";

const LoadingMessage = ({ style }) => (
  <Lottie animationData={HPLoader} style={style} loop={true} />
);

export default LoadingMessage;
