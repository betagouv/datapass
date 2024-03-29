import { useEffect, useState } from 'react';
import { useDataProviderConfigurations } from './use-data-provider-configurations';
import {
  DataProviderConfiguration,
  DataProviderType,
} from '../../../config/data-provider-configurations';

export const useDataProvider = (targetApi?: string | null) => {
  const [dataProviderConfiguration, setDataProviderConfiguration] =
    useState<DataProviderConfiguration>({
      label: '',
      icon: null,
      email: null,
      type: DataProviderType.api,
    });

  const { dataProviderConfigurations } = useDataProviderConfigurations();

  useEffect(() => {
    if (targetApi && dataProviderConfigurations?.[targetApi]) {
      setDataProviderConfiguration(dataProviderConfigurations[targetApi]);
    }
  }, [dataProviderConfigurations, targetApi]);

  return dataProviderConfiguration;
};
