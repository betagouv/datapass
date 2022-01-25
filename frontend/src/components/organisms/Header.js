import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DATA_PROVIDER_PARAMETERS } from '../../config/data-provider-parameters';
import { useAuth } from './AuthContext';
import { loginUrl } from '../templates/Login';
import Link from '../atoms/hyperTexts/Link';
import Button from '../atoms/hyperTexts/Button';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

const Header = () => {
  const [displayContactLink, setDisplayContactLink] = useState();
  const [targetApi, setTargetApi] = useState();
  let location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const targetApiInUrl = Object.keys(DATA_PROVIDER_PARAMETERS).find(
      (target_api) => {
        return window.location.pathname.startsWith(
          `/${target_api.replace(/_/g, '-')}`
        );
      }
    );

    setTargetApi(targetApiInUrl);
    setDisplayContactLink(!targetApiInUrl);
  }, [location]);

  return (
    <header role="banner" className="fr-header">
      <div className="fr-header__body">
        <div className="fr-container">
          <div className="fr-header__body-row">
            <div className="fr-header__brand fr-enlarge-link">
              <div className="fr-header__brand-top">
                <div className="fr-header__logo">
                  <p className="fr-logo">
                    République
                    <br />
                    Française
                  </p>
                </div>
                {targetApi && !!DATA_PROVIDER_PARAMETERS[targetApi]?.icon && (
                  <div className="fr-header__operator">
                    <img
                      src={`/images/${DATA_PROVIDER_PARAMETERS[targetApi]?.icon}`}
                      className="fr-responsive-img"
                      style={{
                        maxHeight: '67px',
                        width: 'auto',
                        maxWidth: '6em',
                      }}
                      alt={`Logo ${DATA_PROVIDER_PARAMETERS[targetApi]?.label}`}
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
                <Link inline href="/" title="Accueil - api.gouv.fr - DINUM">
                  <p className="fr-header__service-title">api.gouv.fr</p>
                </Link>
                <p className="fr-header__service-tagline">
                  habilitations juridiques
                </p>
              </div>
            </div>
            <div className="fr-header__tools">
              <div className="fr-header__tools-links">
                <ul className="fr-links-group">
                  {displayContactLink && (
                    <li>
                      <Link icon="question" href="/faq">
                        Aide
                      </Link>
                    </li>
                  )}
                  {user && user.roles.includes('administrator') && (
                    <li>
                      <Link icon="calendar" href="/admin">
                        Administration
                      </Link>
                    </li>
                  )}
                  {user && user.roles.includes('administrator') && (
                    <li>
                      <Link icon="eye" href={`${BACK_HOST}/sidekiq/`}>
                        Monitoring
                      </Link>
                    </li>
                  )}
                  {user ? (
                    <li>
                      <div className="dropdown">
                        <Link icon="user" href="#">
                          {user.given_name} {user.family_name}
                        </Link>
                        <div className="dropdown-content">
                          <Link
                            inline
                            onClick={logout}
                            style={{ fontSize: '0.85em' }}
                          >
                            Se déconnecter
                          </Link>
                        </div>
                      </div>
                    </li>
                  ) : (
                    <li>
                      <form
                        action={loginUrl}
                        method="post"
                        style={{ cursor: 'pointer' }}
                      >
                        <Button icon="lock" outline submit>
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
