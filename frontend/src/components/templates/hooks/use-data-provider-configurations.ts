import { useEffect, useState } from 'react';
import { DataProviderConfiguration } from '../../../config/data-provider-configurations';
import { getCachedDataProviderConfigurations } from '../../../services/data-provider-configurations';

export const useDataProviderConfigurations = () => {
  const [configurations, setConfigurations] = useState<{
    [k: string]: DataProviderConfiguration;
  } | null>(null);

  useEffect(() => {
    async function fetchDataProviderConfigurations() {
      try {
        const config = await getCachedDataProviderConfigurations();
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
