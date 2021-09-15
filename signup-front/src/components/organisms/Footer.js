import React from 'react';

const API_GOUV_HOST = process.env.VITE_API_GOUV_HOST;

const Footer = () => (
  <footer className="fr-footer" role="contentinfo" id="footer">
    <div className="fr-container">
      <div className="fr-footer__body">
        <div className="fr-footer__brand fr-enlarge-link">
          <a href="/" title="Retour à l’accueil">
            <p className="fr-logo" title="république française">
              république
              <br />
              française
            </p>
          </a>
        </div>
        <div className="fr-footer__content">
          <p className="fr-footer__content-desc">
            Api.gouv.fr : les habilitations juridiques
          </p>
          <ul className="fr-footer__content-list">
            <li className="fr-footer__content-item">
              <a
                className="fr-footer__content-link"
                href="https://legifrance.gouv.fr"
              >
                legifrance.gouv.fr
              </a>
            </li>
            <li className="fr-footer__content-item">
              <a
                className="fr-footer__content-link"
                href="https://gouvernement.fr"
              >
                gouvernement.fr
              </a>
            </li>
            <li className="fr-footer__content-item">
              <a
                className="fr-footer__content-link"
                href="https://service-public.fr"
              >
                service-public.fr
              </a>
            </li>
            <li className="fr-footer__content-item">
              <a
                className="fr-footer__content-link"
                href="https://data.gouv.fr"
              >
                data.gouv.fr
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="fr-footer__bottom">
        <ul className="fr-footer__bottom-list">
          <li className="fr-footer__bottom-item">
            <a className="fr-footer__bottom-link" href="/accessibilite">
              Accessibilité: partiellement conforme
            </a>
          </li>
          <li className="fr-footer__bottom-item">
            <a
              className="fr-footer__bottom-link"
              href={`${API_GOUV_HOST}/apropos`}
            >
              À propos
            </a>
          </li>
          <li className="fr-footer__bottom-item">
            <a className="fr-footer__bottom-link" href="/stats">
              Statistiques d'utilisation
            </a>
          </li>
          <li className="fr-footer__bottom-item">
            <a
              className="fr-footer__bottom-link"
              href={`/docs/cgu_datapass.pdf`}
            >
              Conditions générales d'utilisation
            </a>
          </li>
        </ul>
        <div className="fr-footer__bottom-copy">
          <p>
            Sauf mention contraire, tous les textes de ce site sont sous{' '}
            <a
              href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
              target="_blank"
              rel="noreferrer"
            >
              licence etalab-2.0
            </a>
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
