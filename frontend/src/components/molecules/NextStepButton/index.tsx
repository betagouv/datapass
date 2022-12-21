import { EnrollmentStatus } from '../../../config/status-parameters';
import Button from '../../atoms/hyperTexts/Button';
import { useDataProvider } from '../../templates/hooks/use-data-provider';

const NextStepButton = ({
  target_api,
  status,
}: {
  target_api: string;
  status: EnrollmentStatus;
}) => {
  const { url, type } = useDataProvider(target_api);

  if (status === 'validated' && url) {
    if (type === 'api') {
      return (
        <Button secondary large href={url}>
          Récupérer mon jeton
        </Button>
      );
    } else if (type === 'service') {
      return (
        <Button secondary large href={url}>
          Accéder au service
        </Button>
      );
    }
  }

  return null;
};

export default NextStepButton;
