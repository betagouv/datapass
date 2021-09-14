import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { API_ICONS, TARGET_API_LABELS } from '../../lib/api';
import { withUser } from './UserContext';
import { loginUrl } from '../templates/Login';

const Header = ({ user, logout }) => {
  const [displayContactLink, setDisplayContactLink] = useState();
  const [targetApi, setTargetApi] = useState();
  let location = useLocation();

  useEffect(() => {
    const targetApiInUrl = Object.keys(TARGET_API_LABELS).find((target_api) => {
      return window.location.pathname.startsWith(
        `/${target_api.replace(/_/g, '-')}`
      );
    });

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
                {targetApi && !!API_ICONS[targetApi] && (
                  <div className="fr-header__operator">
                    <img
                      src={`/images/${API_ICONS[targetApi]}`}
                      className="fr-responsive-img"
                      style={{
                        maxHeight: '67px',
                        width: 'auto',
                        maxWidth: '6em',
                      }}
                      alt={`Logo ${TARGET_API_LABELS[targetApi]}`}
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
                      <a
                        className="fr-link fr-fi-mail-line"
                        href="mailto:contact@api.gouv.fr?subject=Contact%20via%20datapass.api.gouv.fr"
                      >
                        Nous contacter
                      </a>
                    </li>
                  )}
                  {user && user.roles.includes('administrator') && (
                    <li>
                      <a className="fr-link fr-fi-calendar-line" href="/admin">
                        Administration
                      </a>
                    </li>
                  )}
                  {user ? (
                    <li>
                      <div className="dropdown">
                        <a className="fr-link fr-fi-user-line" href="#logout">
                          {user.given_name} {user.family_name}
                        </a>
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
