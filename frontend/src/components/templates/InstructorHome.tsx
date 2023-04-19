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

import './InstructorHome.css';
import MultiSelect from '../molecules/MultiSelect';
import NewHomeDesignModal from '../molecules/NewHomeDesignModal';

const InstructorHome: React.FC = () => {
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
      max_per_page: 4,
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
      max_per_page: 5,
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
    <>
      <NewHomeDesignModal />
      <main className="dark-background fr-pb-5w instructor-home">
        <div className="page-container">
          <h1 className="fr-mt-5w">Accueil</h1>
          {instructorTargetApis?.length > 3 ? (
            <div className="target-apis-selector-container">
              <MultiSelect
                alignOptionsLeft
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
            <Card className="enrollments-card">
              <IconTitle title="Habilitations à instruire" icon="target" />
              <QuickViewList list={enrollments} type="enrollments" />
              <div className="action-footer">
                <Button
                  href={`/habilitations${`?${qs.stringify({
                    filtered: JSON.stringify([
                      {
                        id: 'target_api',
                        value: targetApis,
                      },
                      {
                        id: 'status',
                        value: ['submitted'],
                      },
                    ]),
                  })}`}`}
                  secondary
                >
                  Toutes les habilitations à instruire
                </Button>
              </div>
            </Card>
            <Card>
              <IconTitle title="Messages non lus" icon="mail" />
              <QuickViewList list={unprocessedMessages} type="messages" />
              <div className="action-footer">
                <Button
                  href={`/habilitations${`?${qs.stringify({
                    filtered: JSON.stringify([
                      {
                        id: 'target_api',
                        value: targetApis,
                      },
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
        </div>
      </main>
    </>
  );
};

export default InstructorHome;
