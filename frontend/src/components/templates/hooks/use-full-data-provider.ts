import {
  DATA_PROVIDER_CONFIGURATIONS,
  FullDataProviderConfiguration,
} from '../../../config/data-provider-configurations';
import { useEffect, useState } from 'react';
import { getCachedDataProviderConfiguration } from '../../../services/data-provider-configurations';

function getLocalConfiguration(targetApi: string) {
  return DATA_PROVIDER_CONFIGURATIONS[targetApi];
}

export const useFullDataProvider = ({ targetApi }: { targetApi: string }) => {
  const [notFound, setNotFound] = useState<boolean>(false);
  const [configuration, setConfiguration] =
    useState<FullDataProviderConfiguration | null>(null);

  useEffect(() => {
    async function fetchDataProviderConfiguration() {
      try {
        const config = await getCachedDataProviderConfiguration(targetApi);
        setConfiguration(config);
      } catch (e) {
        setNotFound(true);
      }
    }
    if (targetApi && !getLocalConfiguration(targetApi) && !configuration) {
      fetchDataProviderConfiguration();
    }
  }, [targetApi, configuration]);

  return {
    Component: getLocalConfiguration(targetApi)?.component,
    configuration,
    notFound,
  };
};
