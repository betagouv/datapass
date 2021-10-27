import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import {
  DATA_PROVIDER_ICONS,
  DATA_PROVIDER_LABELS,
} from '../../config/data-provider-parameters';
import { withUser } from './UserContext';
import { loginUrl } from '../templates/Login';
import Link from '../atoms/Link';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

const Header = ({ user, logout }) => {
  const [displayContactLink, setDisplayContactLink] = useState();
  const [targetApi, setTargetApi] = useState();
  let location = useLocation();

  useEffect(() => {
    const targetApiInUrl = Object.keys(DATA_PROVIDER_LABELS).find(
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
                {targetApi && !!DATA_PROVIDER_ICONS[targetApi] && (
                  <div className="fr-header__operator">
                    <img
                      src={`/images/${DATA_PROVIDER_ICONS[targetApi]}`}
                      className="fr-responsive-img"
                      style={{
                        maxHeight: '67px',
                        width: 'auto',
                        maxWidth: '6em',
                      }}
                      alt={`Logo ${DATA_PROVIDER_LABELS[targetApi]}`}
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
                <a href="/" title="Accueil - api.gouv.fr - DINUM">
                  <p className="fr-header__service-title">api.gouv.fr</p>
                </a>
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
                        <Link icon="user" href="#logout">
                          {user.given_name} {user.family_name}
                        </Link>
                        <div className="dropdown-content">
                          <a
                            onClick={logout}
                            href="#logout"
                            style={{ fontSize: '0.85em' }}
                          >
                            Se déconnecter
                          </a>
                        </div>
                      </div>
                    </li>
                  ) : (
                    <li>
                      <a
                        className="fr-link fr-fi-lock-line"
                        href={loginUrl}
                        referrerPolicy="no-referrer-when-downgrade"
                      >
                        Se connecter
                      </a>
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

Header.propTypes = {
  user: PropTypes.object,
  logout: PropTypes.func.isRequired,
};

Header.defaultProps = {
  user: null,
};

export default withUser(Header);
