import React from 'react';
import '../css/ErrorPage/ErrorPage.scss';
import '../css/App.scss';
import image from '../assets/error_404.png';
import { useTranslation } from 'react-i18next';
const ErrorPage = () => {
  const { t } = useTranslation();

  return (
    <div id="error-container">
      <div className="AppBgContainer">
        <div className="center">
          <a href="/">
            <img src={image} alt={'Illustration of an 404 error'} width="40%" />
            <p>{t('ERROR_PAGE')}</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
