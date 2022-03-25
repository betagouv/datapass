import { DATA_PROVIDER_PARAMETERS } from '../../../config/data-provider-parameters';
import { useEffect, useState } from 'react';
import { getCachedEnrollmentConfiguration } from '../../../services/enrollment-configurations';

function getLocalConfiguration(targetApi: string) {
  return DATA_PROVIDER_PARAMETERS[targetApi];
}

export const useFormConfiguration = ({ targetApi }: { targetApi: string }) => {
  const [notFound, setNotFound] = useState(false);
  const [componentTargetApi, setComponentTargetApi] = useState<string>();
  const [configuration, setConfiguration] = useState(null);

  useEffect(() => {
    if (targetApi && getLocalConfiguration(targetApi) && !componentTargetApi) {
      setComponentTargetApi(targetApi);
    }
  }, [targetApi, componentTargetApi]);

  useEffect(() => {
    async function fetchEnrollmentConfiguration() {
      try {
        const config = await getCachedEnrollmentConfiguration(targetApi);
        setConfiguration(config);
      } catch (e) {
        setNotFound(true);
      }
    }
    if (targetApi && !getLocalConfiguration(targetApi) && !configuration) {
      fetchEnrollmentConfiguration();
    }
  }, [targetApi, configuration]);

  return {
    Component:
      componentTargetApi && getLocalConfiguration(componentTargetApi).component,
    configuration,
    notFound,
  };
};
