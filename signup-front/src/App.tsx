import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import PiwikReactRouter from 'piwik-react-router';

import './App.css';
import './template-data-gouv-fixes.css';
import './template-data-gouv-overrides.css';
import './dsfr-fixes.css';

import Footer from './components/organisms/Footer';
import Header from './components/organisms/Header';
import { UserStore, UserContext } from './components/organisms/UserContext';
import Loader from './components/atoms/Loader';
import Routes from './Routes';

const history = createBrowserHistory();

const piwik = PiwikReactRouter({
  url: process.env.REACT_APP_PIWIK_URL,
  siteId: process.env.REACT_APP_PIWIK_SITE_ID,
});

const App = () => (
  <Router history={piwik.connectToHistory(history)}>
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
