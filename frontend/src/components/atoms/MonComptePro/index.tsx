import { FunctionComponent } from 'react';
import './style.css';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

export const loginUrl = `${BACK_HOST}/users/auth/api_gouv`;

const MonComptePro: FunctionComponent = () => (
  <div className="fr-connect-group">
    <form action={loginUrl} method="post" className="fr-m-0">
      <button className="fr-connect fr-moncomptepro">
        <span className="fr-connect__login">S’identifier avec</span>
        <span className="fr-connect__brand">MonComptePro</span>
      </button>
    </form>
    <p>
      <a
        href="https://moncomptepro.beta.gouv.fr/"
        target="_blank"
        rel="noopener noreferrer"
        title="Qu’est-ce que MonComptePro ? - nouvelle fenêtre"
      >
        Qu’est-ce que MonComptePro ?
      </a>
    </p>
  </div>
);

export default MonComptePro;
