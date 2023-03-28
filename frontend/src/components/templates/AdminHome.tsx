import Tag from '../atoms/hyperTexts/Tag';
import TagContainer from '../atoms/TagContainer';
import { useAuth } from '../organisms/AuthContext';
import useQueryString from './hooks/use-query-string';
import { useDataProviderConfigurations } from './hooks/use-data-provider-configurations';
import Card, { CardContainer } from '../molecules/Card';
import IconTitle from '../molecules/IconTitle';
import { useEffect, useState } from 'react';
import { getEnrollments } from '../../services/enrollments';
import QuickViewList from '../molecules/QuickViewList';
import Button from '../atoms/hyperTexts/Button';
import qs from 'query-string';

import './AdminHome.css';
import MultiSelect from '../molecules/MultiSelect';
import StatCard from '../molecules/StatCard';

const AdminHome: React.FC = () => {
  const { user } = useAuth();
  const { dataProviderConfigurations } = useDataProviderConfigurations();
  const [targetApis, setTargetApis] = useQueryString('targetApis', []);
  const [enrollments, setEnrollments] = useState([]);
  const [unprocessedMessages, setUnprocessedMessages] = useState([]);

  useEffect(() => {
    const defaultFilter = [
      { id: 'status', value: ['submitted', 'changes_requested'] },
    ];
    const formattedApiFilter = [{ id: 'target_api', value: targetApis }];
    const formattedMessagesFilter = [
      { id: 'only_with_unprocessed_messages', value: true },
    ];
    getEnrollments({
      // @ts-ignore
      size: 4,
      detailed: true,
      filter:
        targetApis.length === 0
          ? defaultFilter
          : [...defaultFilter, ...formattedApiFilter],
    }).then(({ enrollments }) => {
      setEnrollments(enrollments);
    });
    getEnrollments({
      // @ts-ignore
      size: 5,
      detailed: true,
      filter:
        targetApis.length === 0
          ? formattedMessagesFilter
          : [...formattedMessagesFilter, ...formattedApiFilter],
    }).then(({ enrollments }) => {
      setUnprocessedMessages(enrollments);
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
                key={targetApiKey}
                onClick={() => setTargetApis([targetApiKey])}
                isActive={targetApis[0] === targetApiKey}
              >
                {dataProviderConfigurations?.[targetApiKey].label}
              </Tag>
            ))}
          </TagContainer>
        )}
        <CardContainer>
          <Card>
            <IconTitle title="Habilitations à instruire" icon="target" />
            <QuickViewList list={enrollments} type="enrollments" />
            <div className="action-footer">
              <Button href="/habilitations" secondary>
                Toutes les habilitations à instruire
              </Button>
            </div>
          </Card>
          <Card className="message-card">
            <IconTitle title="Messages non lus" icon="mail" />
            <QuickViewList list={unprocessedMessages} type="messages" />
            <div className="action-footer">
              <Button
                href={`/habilitations${`?${qs.stringify({
                  filtered: JSON.stringify([
                    {
                      id: 'only_with_unprocessed_messages',
                      value: true,
                    },
                  ]),
                })}`}`}
                secondary
              >
                Tous les messages non lus
              </Button>
            </div>
          </Card>
        </CardContainer>
        <CardContainer>
          <StatCard
            title="Activité"
            icon="activity"
            stats={{
              main: {
                value: 65,
                label: 'nouvelles demandes',
              },
              second: {
                value: -2,
                label: 'par rapport au mois précédent',
              },
            }}
          />
          <StatCard
            title="Validation"
            icon="validation"
            stats={{
              main: {
                value: '67%',
                label: 'taux de demandes validées',
              },
              second: {
                value: -2,
                label: 'par rapport au mois précédent',
              },
            }}
          />
          <StatCard
            title="Modifications"
            icon="change"
            stats={{
              main: {
                value: '12%',
                label: 'demandes modifiées',
              },
              second: {
                value: -2,
                label: 'par rapport au mois précédent',
              },
            }}
          />
          <StatCard
            title="Délai"
            icon="calendar"
            negative
            stats={{
              main: {
                value: 5,
                label: 'jours en moyenne',
              },
              second: {
                value: 2,
                label: 'par rapport au mois précédent',
              },
            }}
          />
        </CardContainer>
      </div>
    </main>
  );
};

export default AdminHome;
