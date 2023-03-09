import Tag from '../atoms/hyperTexts/Tag';
import TagContainer from '../atoms/TagContainer';
import { useAuth } from '../organisms/AuthContext';
import useQueryString from './hooks/use-query-string';
import { useDataProviderConfigurations } from './hooks/use-data-provider-configurations';
import Card, { CardContainer } from '../molecules/Card';
import IconTitle from '../molecules/IconTitle';

const AdminHome: React.FC = () => {
  const { user } = useAuth();
  const { dataProviderConfigurations } = useDataProviderConfigurations();
  const [targetApi, setTargetApi] = useQueryString('targetApi', 'all');

  return (
    <main className="dark-background">
      <div className="page-container">
        <h1 className="fr-mt-5w">Accueil</h1>
        <TagContainer>
          <Tag
            onClick={() => setTargetApi('all')}
            isActive={targetApi === 'all'}
          >
            Toutes les habilitations
          </Tag>
          {user?.roles
            .filter((role) => role.endsWith(':reporter'))
            .map((role) => {
              const targetApiKey = role.split(':')[0];

              return (
                <Tag
                  onClick={() => setTargetApi(targetApiKey)}
                  isActive={targetApi === targetApiKey}
                >
                  {dataProviderConfigurations?.[targetApiKey].label}
                </Tag>
              );
            })}
        </TagContainer>
        <div className="fr-mb-3w" />
        <CardContainer>
          <Card className="flex-two-tier">
            <IconTitle title="Habilitations à instruire" icon="scales-3-line" />
          </Card>
          <Card className="flex-tier">
            <IconTitle title="Messages non lus" icon="mail-open-line" />
          </Card>
        </CardContainer>
      </div>
    </main>
  );
};

export default AdminHome;
