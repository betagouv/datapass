import React from 'react';
import Alert from '../atoms/Alert';
import IndexPointingRightEmoji from '../atoms/icons/IndexPointingRightEmoji';

export const ErrorBoundaryFallback = () => (
  <div className="page">
    <main className="full-page">
      <Alert type="error" title="Erreur inconnue">
        <p>
          Une erreur est survenue. Merci de réessayer ultérieurement. Vous
          pouvez également essayer d'utiliser un autre navigateur (ex: Firefox
          ou Chrome).
        </p>
        <p>
          Si cette erreur persiste, signalez nous cette erreur à l’adresse{' '}
          <a href="mailto:datapass@api.gouv.fr?subject=Erreur%20sur%20datapass.api.gouv.fr">
            datapass@api.gouv.fr
          </a>
          .
        </p>
        <br />
        <p>
          <IndexPointingRightEmoji />
          {' '}
          <a href="/">Retour à l’accueil</a>
        </p>
      </Alert>
    </main>
  </div>
);

export default ErrorBoundaryFallback;
