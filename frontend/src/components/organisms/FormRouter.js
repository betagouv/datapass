import React from 'react';
import { useParams } from 'react-router-dom';
import { DATA_PROVIDER_PARAMETERS } from '../../config/data-provider-parameters';
import useListItemNavigation from '../templates/hooks/use-list-item-navigation';
import { AuthRequired } from './AuthContext';
import NotFound from './NotFound';
import { isEmpty } from 'lodash';
import Enrollment from '../templates/Enrollment';

const FormRouter = () => {
  const { targetApi } = useParams();
  const { goBackToList } = useListItemNavigation();

  const DataProviderParameter =
    DATA_PROVIDER_PARAMETERS[targetApi.replace(/-/g, '_')];

  if (isEmpty(DataProviderParameter)) {
    setTimeout(() => goBackToList(), 3000);

    return <NotFound />;
  }

  if (!isEmpty(DataProviderParameter?.component)) {
    return (
      <AuthRequired>
        <DataProviderParameter.component />
      </AuthRequired>
    );
  }

  if (!isEmpty(DataProviderParameter?.enrollmentConfiguration)) {
    return (
      <AuthRequired>
        <Enrollment
          target_api={targetApi.replace(/-/g, '_')}
          email={DataProviderParameter.email}
          configuration={DataProviderParameter.enrollmentConfiguration}
        />
      </AuthRequired>
    );
  }

  return <NotFound />;
};

export default FormRouter;
