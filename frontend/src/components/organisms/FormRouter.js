import React from 'react';
import { useParams } from 'react-router-dom';
import useListItemNavigation from '../templates/hooks/use-list-item-navigation';
import { AuthRequired } from './AuthContext';
import NotFound from './NotFound';
import { isEmpty } from 'lodash';
import Loader from '../atoms/Loader';
import { useFormConfiguration } from './hooks/use-form-configuration';
import Enrollment from '../templates/Enrollment';

const FormRouter = () => {
  const { targetApi } = useParams();
  const { goBackToList } = useListItemNavigation();
  const { Component, configuration, notFound } = useFormConfiguration({
    targetApi: targetApi.replace(/-/g, '_'),
  });

  if (notFound) {
    setTimeout(() => goBackToList(), 3000 * 10000);

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
          email={configuration.email}
          configuration={configuration.enrollmentConfiguration}
        />
      </AuthRequired>
    );
  }

  return <Loader />;
};

export default FormRouter;
