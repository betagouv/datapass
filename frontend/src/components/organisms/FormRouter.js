import React from 'react';
import { useParams } from 'react-router-dom';
import { DATA_PROVIDER_PARAMETERS } from '../../config/data-provider-parameters';
import useListItemNavigation from '../templates/hooks/use-list-item-navigation';
import { AuthRequired } from './AuthContext';
import NotFound from './NotFound';

const FormRouter = () => {
  const { targetApi } = useParams();

  const TargetApiComponent =
    DATA_PROVIDER_PARAMETERS[targetApi.replace(/-/g, '_')]?.component;
  const { goBackToList } = useListItemNavigation();

  if (!TargetApiComponent) {
    setTimeout(() => goBackToList(), 3000);

    return <NotFound />;
  }

  return (
    <AuthRequired>
      <TargetApiComponent />
    </AuthRequired>
  );
};

export default FormRouter;
