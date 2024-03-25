import { isEmpty } from 'lodash';
import React from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../atoms/Loader';
import Enrollment from '../templates/Enrollment';
import { useFullDataProvider } from '../templates/hooks/use-full-data-provider';
import NotFound from './NotFound';
import ExternalRedirect from '../atoms/ExternalRedirect';
import { TargetAPI } from '../../config/data-provider-configurations';
const { NODE_ENV: CURRENT_ENV } = process.env;

const FormRouter = () => {
  const { targetApi: targetApiFromUrl, enrollmentId } = useParams();
  const targetApi = (targetApiFromUrl as string).replace(/-/g, '_');

  const { Component, configuration, notFound } = useFullDataProvider({
    targetApi: targetApi as string,
  });

  if (targetApi === TargetAPI.api_tiers_de_prestation && !enrollmentId) {
    return (
      <ExternalRedirect url="https://www.demarches-simplifiees.fr/commencer/api-tiers-de-prestations" />
    );
  }

  if (targetApi === TargetAPI.api_entreprise && CURRENT_ENV !== 'production') {
    let redirectUri;

    if (CURRENT_ENV === 'production') {
      redirectUri = 'https://api-entreprise.v2.datapass.gouv.fr';
    } else {
      redirectUri = 'https://staging.api-entreprise.v2.datapass.api.gouv.fr';
    }

    if (enrollmentId) {
      redirectUri += '/demandes/' + enrollmentId;
    }

    return <ExternalRedirect url={`${redirectUri}`} />;
  }

  if (notFound) {
    return <NotFound />;
  }

  if (Component) {
    return <Component />;
  }

  if (!isEmpty(configuration)) {
    return <Enrollment target_api={targetApi} configuration={configuration} />;
  }

  return <Loader />;
};

export default FormRouter;
