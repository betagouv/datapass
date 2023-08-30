import { useEffect, useState } from 'react';
import {
  DATA_PROVIDER_CONFIGURATIONS,
  DataProviderConfiguration,
} from '../../../config/data-provider-configurations';
import { getCachedDataProviderConfigurations } from '../../../services/data-provider-configurations';

export const useDataProviderConfigurations = () => {
  const [configurations, setConfigurations] = useState<Record<
    string,
    DataProviderConfiguration
  > | null>(null);

  useEffect(() => {
    async function fetchDataProviderConfigurations() {
      try {
        const localConfig = DATA_PROVIDER_CONFIGURATIONS;
        const remoteConfig = await getCachedDataProviderConfigurations();

        const config = {
          ...localConfig,
          ...remoteConfig,
        };
        setConfigurations(config);
      } catch (e) {
        setConfigurations(null);
      }
    }
    if (!configurations) {
      fetchDataProviderConfigurations();
    }
  }, [configurations]);

  return { dataProviderConfigurations: configurations };
};
