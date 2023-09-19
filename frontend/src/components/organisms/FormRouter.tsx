import { isEmpty } from 'lodash';
import React from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../atoms/Loader';
import Enrollment from '../templates/Enrollment';
import { useFullDataProvider } from '../templates/hooks/use-full-data-provider';
import NotFound from './NotFound';

const FormRouter = () => {
  const { targetApi: targetApiFromUrl } = useParams();
  const targetApi = (targetApiFromUrl as string).replace(/-/g, '_');

  const { Component, configuration, notFound } = useFullDataProvider({
    targetApi: targetApi as string,
  });

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
