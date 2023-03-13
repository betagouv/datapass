import Tag from '../atoms/hyperTexts/Tag';
import TagContainer from '../atoms/TagContainer';
import { useAuth } from '../organisms/AuthContext';
import useQueryString from './hooks/use-query-string';
import { useDataProviderConfigurations } from './hooks/use-data-provider-configurations';
import Card, { CardContainer } from '../molecules/Card';
import IconTitle from '../molecules/IconTitle';
import { useEffect, useState } from 'react';
import { getEnrollments } from '../../services/enrollments';
import EnrollmentQuickViewList from '../molecules/EnrollmentQuickViewList';
import Button from '../atoms/hyperTexts/Button';

import './AdminHome.css';
import MultiSelect from '../molecules/MultiSelect';

const AdminHome: React.FC = () => {
  const { user } = useAuth();
  const { dataProviderConfigurations } = useDataProviderConfigurations();
  const [targetApis, setTargetApis] = useQueryString('targetApis', []);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    getEnrollments({
      size: 4,
      detailed: true,
      filter:
        targetApis.length === 0
          ? []
          : [{ id: 'target_api', value: targetApis }],
    }).then(({ enrollments }) => {
      setEnrollments(enrollments);
    });
  }, [targetApis]);

  const instructorTargetApis =
    user?.roles
      .filter((role) => role.endsWith(':reporter'))
      .map((role) => role.split(':')[0]) || [];

  return (
    <main className="dark-background fr-pb-5w">
      <div className="page-container">
        <h1 className="fr-mt-5w">Accueil</h1>
        {instructorTargetApis?.length > 3 ? (
          <div className="target-apis-selector-container">
            <MultiSelect
              defaultOverviewLabel="Toutes les habilitations"
              options={instructorTargetApis.map((targetApiKey) => ({
                key: targetApiKey,
                label: dataProviderConfigurations?.[targetApiKey].label,
              }))}
              values={targetApis.length === 0 ? [] : targetApis}
              onChange={(values = []) => setTargetApis(values)}
            />
          </div>
        ) : (
          <TagContainer className="fr-mb-3w">
            {instructorTargetApis.length > 1 && (
              <Tag
                onClick={() => setTargetApis([])}
                isActive={targetApis.length === 0}
              >
                Toutes les habilitations
              </Tag>
            )}
            {instructorTargetApis?.map((targetApiKey) => (
              <Tag
                onClick={() => setTargetApis([targetApiKey])}
                isActive={targetApis[0] === targetApiKey}
              >
                {dataProviderConfigurations?.[targetApiKey].label}
              </Tag>
            ))}
          </TagContainer>
        )}
        <CardContainer>
          <Card className="flex-two-tier">
            <IconTitle title="Habilitations à instruire" icon="scales-3-line" />
            <EnrollmentQuickViewList enrollments={enrollments} />
            <div className="action-footer">
              <Button href="/enrollments" secondary>
                Toutes les habilitations à instruire
              </Button>
            </div>
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
