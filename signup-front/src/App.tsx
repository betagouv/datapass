import { BrowserRouter } from 'react-router-dom';
import {
  MatomoProvider,
  createInstance,
  useMatomo,
} from '@datapunt/matomo-tracker-react';
import './App.css';
import Footer from './components/organisms/Footer';
import Header from './components/organisms/Header';
import { AuthStore, useAuth } from './components/organisms/AuthContext';
import Loader from './components/atoms/Loader';
import Routes from './Routes';
import Alert from './components/atoms/Alert';
import React, { useEffect } from 'react';
import { ErrorBoundary } from '@sentry/react';
import ErrorBoundaryFallback from './components/organisms/ErrorBoundaryFallback';

const urlBase: string = process.env.REACT_APP_PIWIK_URL || 'https://matomo.org';
// 1 is default value for no siteId since matomo considers 0 as an empty id and does not accept null value
const siteId: number =
  parseInt(process.env.REACT_APP_PIWIK_SITE_ID as string) || 1;
const disabled: boolean = !urlBase || siteId === 1;

const instance = createInstance({
  urlBase,
  siteId,
  trackerUrl: `${urlBase}/piwik.php`,
  srcUrl: `${urlBase}/piwik.js`,
  disabled,
  linkTracking: false,
});

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
