import React from 'react';
import '../css/ErrorPage/ErrorPage.css';
import '../css/App.css';
import image from '../assets/error_404.png';
import Header from '../components/Header';

const ErrorPage = () => {
  return (
    <div id="error-container">
      <div className="AppBgContainer">
        <Header />
        <div className="center">
          <a href="/">
            <img src={image} alt={'Illustration of an 404 error'} width="40%" />
            <p>Click to return back to our landing page.</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
