import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import './App.css';
import './template-data-gouv-fixes.css';
import './template-data-gouv-overrides.css';
import './dsfr-fixes.css';

import Footer from './components/organisms/Footer';
import Header from './components/organisms/Header';
import { UserStore, UserContext } from './components/organisms/UserContext';
import Loader from './components/atoms/Loader';
import Routes from './Routes';

let history = createBrowserHistory();

if (process.env.PROD) {
  const piwik = require('piwik-react-router')({
    url: process.env.VITE_PIWIK_URL,
    siteId: process.env.VITE_PIWIK_SITE_ID,
  });
  history = piwik.connectToHistory(history);
}

const App = () => (
  <Router history={history}>
    <UserStore>
      <div className="page">
        <Header />

        <UserContext.Consumer>
          {({ isLoading, connectionError }) => (
            <main>
              {isLoading && (
                <section className="section-grey layout-full-page">
                  <Loader />
                </section>
              )}
              {!isLoading && connectionError && (
                <section className="section-grey layout-full-page">
                  <div className="notification error">{connectionError}</div>
                </section>
              )}
              {!isLoading && !connectionError && <Routes />}
            </main>
          )}
        </UserContext.Consumer>

        <Footer />
      </div>
    </UserStore>
  </Router>
);

export default App;
