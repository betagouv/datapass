import React, { MouseEvent } from 'react';

type Props = {
  href?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  className?: string;
};

const MonComptePro: React.FC<Props> = ({ href, onClick }) => {
  return (
    <div className="fr-connect-group">
      <button className="fr-connect fr-connect">
        <span className="fr-connect__login">S’identifier avec</span>
        <span className="fr-connect__brand">MonComptePro</span>
      </button>
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
