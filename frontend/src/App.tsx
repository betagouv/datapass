import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Footer from './components/organisms/Footer';
import Header from './components/organisms/Header';
import { AuthStore, useAuth } from './components/organisms/AuthContext';
import Loader from './components/atoms/Loader';
import Routes from './Routes';
import Alert, { AlertType } from './components/atoms/Alert';
import React from 'react';
import { ErrorBoundary } from '@sentry/react';
import ErrorBoundaryFallback from './components/organisms/ErrorBoundaryFallback';

const Page: React.FC = () => {
  const { isLoading, connectionError } = useAuth();

  return (
    <div className="page">
      <Header />
      {isLoading && (
        <main className="full-page">
          <Loader />
        </main>
      )}
      {!isLoading && connectionError && (
        <main className="full-page">
          <Alert type={AlertType.error} title="Erreur de connexion">
            {connectionError}
          </Alert>
        </main>
      )}
      {!isLoading && !connectionError && <Routes />}
      <Footer />
    </div>
  );
};

const App = () => (
  <ErrorBoundary fallback={ErrorBoundaryFallback}>
    <BrowserRouter>
      <AuthStore>
        <Page />
      </AuthStore>
    </BrowserRouter>
  </ErrorBoundary>
);

export default App;
