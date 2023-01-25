import { pickBy } from 'lodash';
import moment from 'moment';
import qs from 'query-string';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { HIDDEN_DATA_PROVIDER_KEYS } from '../../config/data-provider-configurations';
import {
  EnrollmentStatus,
  STATUS_LABELS,
} from '../../config/status-parameters';
import { stackLowUseAndUnpublishedApi } from '../../lib';
import { getAPIStats } from '../../services/stats';
import Helper from '../atoms/Helper';
import Link from '../atoms/hyperTexts/Link';
import Tag from '../atoms/hyperTexts/Tag';
import Loader from '../atoms/Loader';
import TagContainer from '../atoms/TagContainer';
import { Card, CardContainer } from '../molecules/Card';
import ListHeader from '../molecules/ListHeader';
import './Stats.css';
import { useDataProviderConfigurations } from './hooks/use-data-provider-configurations';

// inspired from http://colrd.com/palette/19308/
const COLORS = [
  '#447c69',
  '#8e8c6d',
  '#e9d78e',
  '#f19670',
  '#c94a53',
  '#a34974',
  '#65387d',
  '#9163b6',
  '#e0598b',
  '#5698c4',
  '#51574a',
  '#74c493',
  '#e4bf80',
  '#e2975d',
  '#e16552',
  '#be5168',
  '#993767',
  '#4e2472',
  '#e279a3',
  '#7c9fb0',
  '#9abf88',
];

// inspired from https://coolors.co/1a535c-4ecdc4-f7fff7-ff6b6b-ffe66d
const USER_STATUS_COLORS = {
  draft: '#50514F',
  changes_requested: '#1A535C',
  submitted: '#4ECDC4',
  validated: '#FFE66D',
  refused: '#FF6B6B',
  revoked: '#FF4747',
};

export const Stats = () => {
  const [stats, setStats] = useState(null);
  const { targetApi } = useParams();
  const { dataProviderConfigurations } = useDataProviderConfigurations();

  const dataProviderKeyList = useMemo(() => {
    if (!dataProviderConfigurations) {
      return [];
    }

    return Object.keys(dataProviderConfigurations).filter(
      (dataProviderKey) => !HIDDEN_DATA_PROVIDER_KEYS.includes(dataProviderKey)
    );
  }, [dataProviderConfigurations]);

  const getApisList = (targetApi, dataProviderConfigurations) => {
    const getProvidersKeyByType = (type) =>
      Object.keys(
        pickBy(
          dataProviderConfigurations,
          (dataProviderConfig) => dataProviderConfig.type === type
        )
      ).filter((key) => !HIDDEN_DATA_PROVIDER_KEYS.includes(key));

    switch (targetApi) {
      case 'allApi':
        return getProvidersKeyByType('api');
      case 'allServices':
        return getProvidersKeyByType('service');
      case undefined:
        return [];
      default:
        return [targetApi];
    }
  };

  const getTargetAPIList = useCallback(
    async function (targetApi) {
      return getAPIStats(getApisList(targetApi, dataProviderConfigurations));
    },
    [dataProviderConfigurations]
  );

  useEffect(() => {
    async function fetchStats() {
      const result = await getTargetAPIList(targetApi);

      setStats({
        ...result.data,
        enrollment_by_target_api: stackLowUseAndUnpublishedApi(
          dataProviderKeyList,
          result.data.enrollment_by_target_api,
          10
        ),
      });
    }

    fetchStats();
  }, [targetApi, dataProviderKeyList, getTargetAPIList]);

  if (!stats) {
    return (
      <section className="full-page">
        <Loader />
      </section>
    );
  }

  return (
    <main>
      <ListHeader title="Statistiques d’utilisation">
        <TagContainer>
          <NavLink end to="/stats">
            {({ isActive }) => (
              <Tag isActive={!!isActive}>Toutes les habilitations</Tag>
            )}
          </NavLink>
          <NavLink end to={`/stats/allApi`}>
            {({ isActive }) => <Tag isActive={!!isActive}>Toutes les API</Tag>}
          </NavLink>
          <NavLink end to={`/stats/allServices`}>
            {({ isActive }) => (
              <Tag isActive={!!isActive}>Tous les services</Tag>
            )}
          </NavLink>
          {dataProviderKeyList.map((targetApi) => (
            <NavLink key={targetApi} end to={`/stats/${targetApi}`}>
              {({ isActive }) => (
                <Tag isActive={!!isActive}>
                  {dataProviderConfigurations?.[targetApi].label}
                </Tag>
              )}
            </NavLink>
          ))}
        </TagContainer>
      </ListHeader>
      <div className="table-container">
        <CardContainer>
          <Card className="stat_card">
            <div className="stat_card_head">
              <h3>Habilitations déposées</h3>
            </div>
            <div className="stat_card_number">{stats.enrollment_count}</div>
          </Card>
          <Card className="stat_card">
            <div className="stat_card_head">
              <h3>Habilitations validées</h3>
              <div className="card__meta">
                <Link
                  inline
                  href={`/public${`?${qs.stringify({
                    filtered: JSON.stringify([
                      {
                        id: 'target_api',
                        value: getApisList(
                          targetApi,
                          dataProviderConfigurations
                        ),
                      },
                    ]),
                  })}`}`}
                >
                  voir la liste détaillée
                </Link>
              </div>
            </div>
            <div className="stat_card_number">
              <div>{stats.validated_enrollment_count}</div>
            </div>
          </Card>
        </CardContainer>
        <CardContainer>
          <Card className="stat_card">
            <div className="stat_card_head">
              <h3>
                Temps moyen de traitement des demandes d’habilitation
                <Helper title="temps moyen entre la première soumission d’une demande d’habilitation jusqu’à la première réponse d'un instructeur sur les 6 derniers mois" />
              </h3>
              <div className="card__meta">(en jours)</div>
            </div>
            <div className="stat_card_number">
              {stats.average_processing_time_in_days}
            </div>
          </Card>
          <Card className="stat_card">
            <div className="stat_card_head">
              <h3>
                Pourcentage des habilitations nécessitant un aller retour
                <Helper title="sur les 6 derniers mois" />
              </h3>
              <div className="card__meta">(en % des habilitations totales)</div>
            </div>
            <div className="stat_card_number">{stats.go_back_ratio}</div>
          </Card>
        </CardContainer>
        <CardContainer>
          <Card className="stat_card">
            <div className="stat_card_head">
              <h3>Habilitations déposées</h3>
            </div>
            <div className="stat_card_graph">
              <ResponsiveContainer width={'100%'} height={250}>
                <BarChart data={stats.monthly_enrollment_count}>
                  <XAxis
                    dataKey="month"
                    tickFormatter={(value) => moment(value).format('MMM YY')}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name, props) => [
                      value,
                      STATUS_LABELS[name],
                      props,
                    ]}
                    labelFormatter={(value) => moment(value).format('MMM YYYY')}
                  />
                  <Legend formatter={(value) => STATUS_LABELS[value]} />
                  <CartesianGrid vertical={false} />
                  {Object.keys(EnrollmentStatus).map((status, index, array) => (
                    <Bar
                      key={status}
                      stackId="count"
                      dataKey={status}
                      fill={USER_STATUS_COLORS[status]}
                    >
                      {index === array.length - 1 && (
                        <LabelList dataKey="total" position="top" />
                      )}
                    </Bar>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </CardContainer>
        <CardContainer>
          <Card className="stat_card">
            <div className="stat_card_head">
              <h3>Répartition des habilitations par statut</h3>
            </div>
            <div className="stat_card_graph">
              <ResponsiveContainer width={'100%'} height={250}>
                <PieChart>
                  <Pie data={stats.enrollment_by_status} dataKey="count" label>
                    {stats.enrollment_by_status.map((entry, index) => (
                      <Cell key={index} fill={USER_STATUS_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Legend
                    layout={'vertical'}
                    align={'right'}
                    verticalAlign={'middle'}
                    formatter={(value) => STATUS_LABELS[value]}
                  />
                  <Tooltip
                    formatter={(value, name, props) => [
                      value,
                      STATUS_LABELS[name],
                      props,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </CardContainer>
        <CardContainer>
          <Card className="stat_card">
            <div className="stat_card_head">
              <h3>Répartition des habilitations par API</h3>
            </div>
            <div className="stat_card_graph">
              <ResponsiveContainer width={'100%'} height={450}>
                <PieChart>
                  <Pie
                    data={stats.enrollment_by_target_api}
                    dataKey="count"
                    label
                  >
                    {stats.enrollment_by_target_api.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      value,
                      name === 'others'
                        ? 'Autres'
                        : dataProviderConfigurations?.[name].label,
                      props,
                    ]}
                  />
                  <Legend
                    layout={'vertical'}
                    align={'right'}
                    verticalAlign={'middle'}
                    formatter={(value) =>
                      (value === 'others'
                        ? 'Autres'
                        : dataProviderConfigurations?.[value].label
                      ).substring(0, 32)
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </CardContainer>
      </div>
    </main>
  );
};

export default Stats;
