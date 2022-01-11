import React from 'react';
import Link from '../atoms/Link';
const { REACT_APP_API_GOUV_HOST: API_GOUV_HOST } = process.env;

const Footer = () => (
  <footer className="fr-footer" role="contentinfo" id="footer">
    <div className="fr-container">
      <div className="fr-footer__body">
        <div className="fr-footer__brand fr-enlarge-link">
          <Link inline href="/" title="Retour à l’accueil">
            <p className="fr-logo" title="république française">
              république
              <br />
              française
            </p>
          </Link>
        </div>
        <div className="fr-footer__content">
          <p className="fr-footer__content-desc">
            Api.gouv.fr : les habilitations juridiques
          </p>
          <ul className="fr-footer__content-list">
            <li className="fr-footer__content-item">
              <Link
                className="fr-footer__content-link"
                href="https://legifrance.gouv.fr"
              >
                legifrance.gouv.fr
              </Link>
            </li>
            <li className="fr-footer__content-item">
              <Link
                className="fr-footer__content-link"
                href="https://gouvernement.fr"
              >
                gouvernement.fr
              </Link>
            </li>
            <li className="fr-footer__content-item">
              <Link
                className="fr-footer__content-link"
                href="https://service-public.fr"
              >
                service-public.fr
              </Link>
            </li>
            <li className="fr-footer__content-item">
              <Link
                className="fr-footer__content-link"
                href="https://data.gouv.fr"
              >
                data.gouv.fr
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="fr-footer__bottom">
        <ul className="fr-footer__bottom-list">
          <li className="fr-footer__bottom-item">
            <Link className="fr-footer__bottom-link" href="/accessibilite">
              Accessibilité: partiellement conforme
            </Link>
          </li>
          <li className="fr-footer__bottom-item">
            <Link
              className="fr-footer__bottom-link"
              href={`${API_GOUV_HOST}/apropos`}
            >
              À propos
            </Link>
          </li>
          <li className="fr-footer__bottom-item">
            <Link className="fr-footer__bottom-link" href="/stats">
              Statistiques d'utilisation
            </Link>
          </li>
          <li className="fr-footer__bottom-item">
            <Link
              className="fr-footer__bottom-link"
              href={`/docs/cgu_datapass.pdf`}
            >
              Conditions générales d'utilisation
            </Link>
          </li>
          <li className="fr-footer__bottom-item">
            <Link className="fr-footer__bottom-link" href="/faq">
              Aide
            </Link>
          </li>
        </ul>
        <div className="fr-footer__bottom-copy">
          <p>
            Sauf mention contraire, tous les textes de ce site sont sous{' '}
            <Link
              inline
              newTab
              href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
            >
              licence etalab-2.0
            </Link>
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
