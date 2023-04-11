import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDataProvider } from '../templates/hooks/use-data-provider';
import { useDataProviderConfigurations } from '../templates/hooks/use-data-provider-configurations';
import { useAuth } from './AuthContext';
import { loginUrl } from '../atoms/MonComptePro';
import Link from '../atoms/hyperTexts/Link';
import Button from '../atoms/hyperTexts/Button';

import './Header.css';
import { isEmpty } from 'lodash';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

const Header = () => {
  const [displayContactLink, setDisplayContactLink] = useState();
  const [targetApi, setTargetApi] = useState();
  let location = useLocation();
  const { user, logout } = useAuth();
  const { dataProviderConfigurations } = useDataProviderConfigurations();
  const { label, icon } = useDataProvider(targetApi);

  useEffect(() => {
    if (dataProviderConfigurations) {
      const targetApiInUrl = Object.keys(dataProviderConfigurations).find(
        (target_api) => {
          return window.location.pathname
            .replace(/-/g, '_')
            .startsWith(`/${target_api}`);
        }
      );

      setTargetApi(targetApiInUrl);
      setDisplayContactLink(!targetApiInUrl);
    }
  }, [dataProviderConfigurations, location]);

  let logoClassNames = 'fr-logo';

  if (user) {
    logoClassNames += ' minimized';
  }

  return (
    <header role="banner" className="fr-header">
      <div className="fr-header__body">
        <div className="fr-container">
          <div className="fr-header__body-row">
            <div className="fr-header__brand fr-enlarge-link">
              <div className="fr-header__brand-top">
                <div className="fr-header__logo">
                  <p className={logoClassNames}>
                    {!user && (
                      <>
                        République
                        <br />
                        Française
                      </>
                    )}
                  </p>
                </div>
                {icon && !user && (
                  <div className="fr-header__operator">
                    <img
                      src={`/images/${icon}`}
                      className="fr-responsive-img"
                      style={{
                        maxHeight: '67px',
                        width: 'auto',
                        maxWidth: '6em',
                      }}
                      alt={`Logo ${label}`}
                    />
                  </div>
                )}
                <div className="fr-header__navbar">
                  <button
                    className="fr-btn--menu fr-btn"
                    data-fr-opened="false"
                    aria-controls="modal-833"
                    aria-haspopup="menu"
                    title="Menu"
                  >
                    Menu
                  </button>
                </div>
              </div>
              <div className="fr-header__service">
                <Link inline href="/" title="Accueil - DataPass">
                  <p className="fr-header__service-title">DataPass</p>
                </Link>
                {!user && (
                  <p className="fr-header__service-tagline">
                    habilitations juridiques
                  </p>
                )}
              </div>
            </div>
            <div className="fr-header__tools">
              <div className="fr-header__tools-links">
                <ul className="fr-btns-group">
                  {user && (
                    <li>
                      <Button
                        icon="table"
                        tertiaryNoOutline
                        href={
                          user &&
                          isEmpty(user.roles) &&
                          user.organizations.length < 5
                            ? '/'
                            : '/habilitations'
                        }
                      >
                        Toutes mes habilitations
                      </Button>
                    </li>
                  )}
                  {displayContactLink && (
                    <li>
                      <Button icon="question" tertiaryNoOutline href="/faq">
                        Aide
                      </Button>
                    </li>
                  )}
                  {user && user.roles.includes('administrator') && (
                    <>
                      <li>
                        <Button icon="calendar" href="/admin">
                          Administration
                        </Button>
                      </li>
                      <li>
                        <Button icon="eye" href={`${BACK_HOST}/sidekiq/`}>
                          Monitoring
                        </Button>
                      </li>
                    </>
                  )}
                  {user ? (
                    <li>
                      <div className="dropdown">
                        <Button icon="logout-box-r" onClick={logout}>
                          {user.given_name} {user.family_name}
                        </Button>
                      </div>
                    </li>
                  ) : (
                    <li>
                      <form action={loginUrl} method="post">
                        <Button iconFill icon="account-circle" tertiary submit>
                          Se connecter
                        </Button>
                      </form>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
