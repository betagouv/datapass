import { BrowserRouter } from 'react-router-dom';
import {
  createInstance,
  MatomoProvider,
  useMatomo,
} from '@datapunt/matomo-tracker-react';
import './App.css';
import Footer from './components/organisms/Footer';
import Header from './components/organisms/Header';
import { useAuth } from './components/organisms/AuthContext';
import Loader from './components/atoms/Loader';
import Routes from './Routes';
import Alert from './components/atoms/Alert';
import React, { useEffect } from 'react';
import { ErrorBoundary } from '@sentry/react';
import ErrorBoundaryFallback from './components/organisms/ErrorBoundaryFallback';
import matomoConfiguration from './config/matomo-configuration';
import { AuthProvider } from './components/organisms/AuthProvider';

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
      {!isLoading && connectionError && (
        <main className="full-page">
          <Alert type="error" title="Erreur de connexion">
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
    <AuthProvider>
      <MatomoProvider value={instance}>
        <BrowserRouter>
          <Page />
        </BrowserRouter>
      </MatomoProvider>
    </AuthProvider>
  </ErrorBoundary>
);

export default App;
