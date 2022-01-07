import { BrowserRouter } from 'react-router-dom';
// import { createBrowserHistory } from 'history';
// import PiwikReactRouter from 'piwik-react-router';
import './App.css';
import Footer from './components/organisms/Footer';
import Header from './components/organisms/Header';
import { AuthStore, AuthContext } from './components/organisms/AuthContext';
import Loader from './components/atoms/Loader';
import Routes from './Routes';
// @ts-ignore
import Alert from './components/atoms/Alert';

// const history = createBrowserHistory();

// const piwik = PiwikReactRouter({
//   url: process.env.REACT_APP_PIWIK_URL,
//   siteId: process.env.REACT_APP_PIWIK_SITE_ID,
// });

const App = () => (
  <BrowserRouter>
    <AuthStore>
      <div className="page">
        <Header />

        <AuthContext.Consumer>
          {({ isLoading, connectionError }) => (
            <>
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
            </>
          )}
        </AuthContext.Consumer>

        <Footer />
      </div>
    </AuthStore>
  </BrowserRouter>
);

export default App;
