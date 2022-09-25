import { BrowserRouter } from 'react-router-dom';
import {
  createInstance,
  MatomoProvider,
  useMatomo,
} from '@datapunt/matomo-tracker-react';
import './App.css';
import Footer from './components/organisms/Footer';
import Header from './components/organisms/Header';
import { AuthStore, useAuth } from './components/organisms/AuthContext';
import Loader from './components/atoms/Loader';
import Routes from './Routes';
import Alert, { AlertType } from './components/atoms/Alert';
import React, { useEffect } from 'react';
import { ErrorBoundary } from '@sentry/react';
import ErrorBoundaryFallback from './components/organisms/ErrorBoundaryFallback';
import matomoConfiguration from './config/matomo-configuration';

const instance = createInstance(matomoConfiguration);

const Page: React.FC = () => {
  const { isLoading, connectionError } = useAuth();
  const { trackPageView, enableLinkTracking } = useMatomo();

  enableLinkTracking();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => trackPageView({}), []);

  return (
    <div className="page">
      <Header />
      {isLoading && (
        <main className="full-page">
          <Loader />
        </main>
      )}
      {/* if there is an error */}
      {!isLoading && connectionError && (
        <main className="full-page">
          <Alert type={AlertType.error} title="Erreur de connexion">
            {connectionError}
          </Alert>
        </main>
      )}
      {/* if it's ok */}
      {!isLoading && !connectionError && <Routes />}
      <Footer />
    </div>
  );
};

const App = () => (
  <ErrorBoundary fallback={ErrorBoundaryFallback}>
    <MatomoProvider value={instance}>
      <BrowserRouter>
        <AuthStore>
          <Page />
        </AuthStore>
      </BrowserRouter>
    </MatomoProvider>
  </ErrorBoundary>
);

export default App;
