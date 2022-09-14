import React from 'react';
import { useParams } from 'react-router-dom';
import { DATA_PROVIDER_PARAMETERS } from '../../config/data-provider-parameters';
import { AuthRequired } from './AuthContext';
import NotFound from './NotFound';

const FormRouter = () => {
  const { targetApi } = useParams();

  const TargetApiComponent =
    DATA_PROVIDER_PARAMETERS[targetApi.replace(/-/g, '_')]?.component;

  if (!TargetApiComponent) {
    return <NotFound />;
  }

  return (
    <AuthRequired>
      <TargetApiComponent />
    </AuthRequired>
  );
};

export default FormRouter;
