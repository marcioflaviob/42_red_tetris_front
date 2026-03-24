import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card/Card';
import Button from '../components/ui/Buttons/Button';
import HomePageBg from '../components/ui/Backgrounds/HomePageBg';
import styles from './ErrorPage.module.css';

const ErrorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const error = location.state?.error;

  console.log(error);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className={`text-white flex flex-col h-full`}>
      <HomePageBg />
      <div className="container mx-auto flex items-center justify-center flex-1 p-8">
        <Card className={styles.errorCard}>
          <div className="flex flex-col items-center gap-4 p-6 text-center">
            <img src="/assets/others/error.gif" alt="Error glitch animation" className={styles.glitchImage} />
            <h1 style={{ fontSize: '1.75rem', margin: 0 }}>Oops! Something went wrong.</h1>
            <p style={{ fontSize: '1rem', margin: 0, color: '#94a3b8' }}>
              {error?.data?.error || 'The page you are looking for does not exist or an error has occurred.'}
            </p>
            <Button variant="play" size="large" onClick={handleGoHome}>
              Go Back Home
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ErrorPage;
