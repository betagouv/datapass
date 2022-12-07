import { EnrollmentStatus } from '../../../config/status-parameters';
import Button from '../../atoms/hyperTexts/Button';
import { useDataProviderConfigurations } from '../../templates/hooks/use-data-provider-configurations';

const NextStepButton = ({
  target_api,
  status,
}: {
  target_api: string;
  status: EnrollmentStatus;
}) => {
  const { dataProviderConfigurations } = useDataProviderConfigurations();

  const configuration = dataProviderConfigurations?.[target_api];
  if (status === 'validated' && configuration?.url) {
    if (configuration.type === 'api') {
      return (
        <Button secondary large href={configuration.url}>
          Récupérer mon jeton
        </Button>
      );
    } else if (configuration.type === 'service') {
      return (
        <Button secondary large href={configuration.url}>
          Accéder au service
        </Button>
      );
    }
  }

  return null;
};

export default NextStepButton;
