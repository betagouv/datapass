import React from 'react';
import { hashToQueryParams } from '../../../lib';
import './style.css';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

type Props = {};

export const loginUrl = `${BACK_HOST}/users/auth/api_gouv${hashToQueryParams({
  prompt: 'login',
})}`;

const MonComptePro: React.FC<Props> = () => {
  return (
    <div className="fr-connect-group">
      <form action={loginUrl} method="post" className="fr-m-0">
        <button className="fr-connect fr-connect">
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
};

export default MonComptePro;
