import { isEmpty } from 'lodash';
import React from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../atoms/Loader';
import Enrollment from '../templates/Enrollment';
import { AuthRequired } from './AuthContext';
import { useFullDataProvider } from '../templates/hooks/use-full-data-provider';
import NotFound from './NotFound';

const FormRouter = () => {
  const { targetApi } = useParams();

  const { Component, configuration, notFound } = useFullDataProvider({
    targetApi: targetApi.replace(/-/g, '_'),
  });

  if (notFound) {
    return <NotFound />;
  }

  if (Component) {
    return (
      <AuthRequired>
        <Component />
      </AuthRequired>
    );
  }

  if (!isEmpty(configuration)) {
    return (
      <AuthRequired>
        <Enrollment
          target_api={targetApi.replace(/-/g, '_')}
          configuration={configuration}
        />
      </AuthRequired>
    );
  }

  return <Loader />;
};

export default FormRouter;
