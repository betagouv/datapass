import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import moment from 'moment';
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

import './Stats.css';

import { getAPIStats } from '../../services/stats';
import { USER_STATUS_LABELS } from '../../config/status-parameters';
import {
  DATA_PROVIDER_PARAMETERS,
  DATA_PROVIDER_WITH_ENROLLMENTS_IN_PRODUCTION_ENV,
} from '../../config/data-provider-parameters';

import Helper from '../atoms/Helper';
import Loader from '../atoms/Loader';
import ListHeader from '../molecules/ListHeader';
import { stackLowUseAndUnpublishedApi } from '../../lib';
import { Card, CardContainer } from '../molecules/Card';
import { Tag, TagContainer } from '../atoms/Tag';
import Link from '../atoms/Link';

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
};

export const Stats = () => {
  const [stats, setStats] = useState(null);
  const { targetApi } = useParams();

  useEffect(() => {
    async function fetchStats() {
      const result = await getAPIStats(targetApi);

      setStats({
        ...result.data,
        enrollment_by_target_api: stackLowUseAndUnpublishedApi(
          DATA_PROVIDER_WITH_ENROLLMENTS_IN_PRODUCTION_ENV,
          result.data.enrollment_by_target_api,
          10
        ),
      });
    }

    fetchStats();
  }, [targetApi]);

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
              <Tag type={isActive ? 'info' : ''}>Toutes les APIs</Tag>
            )}
          </NavLink>
          {DATA_PROVIDER_WITH_ENROLLMENTS_IN_PRODUCTION_ENV.map((targetApi) => (
            <NavLink key={targetApi} end to={`/stats/${targetApi}`}>
              {({ isActive }) => (
                <Tag type={isActive ? 'info' : ''}>
                  {DATA_PROVIDER_PARAMETERS[targetApi]?.label}
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
              <h3>Demandes d’habilitation déposées</h3>
            </div>
            <div className="stat_card_number">{stats.enrollment_count}</div>
          </Card>
          <Card className="stat_card">
            <div className="stat_card_head">
              <h3>Demandes d’habilitation validées</h3>
              <div className="card__meta">
                <Link
                  inline
                  href={`/public${targetApi ? `/${targetApi}` : ''}`}
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
                Temps moyen de traitement des demandes
                <Helper title="temps moyen entre la première soumission d’une demande jusqu’à la première réponse d'un instructeur sur les 6 derniers mois" />
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
                Pourcentage de demandes nécessitant un aller retour
                <Helper title="sur les 6 derniers mois" />
              </h3>
              <div className="card__meta">(en % des demandes totales)</div>
            </div>
            <div className="stat_card_number">{stats.go_back_ratio}</div>
          </Card>
        </CardContainer>
        <CardContainer>
          <Card className="stat_card">
            <div className="stat_card_head">
              <h3>Demandes d’habilitation déposées</h3>
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
                      USER_STATUS_LABELS[name],
                      props,
                    ]}
                    labelFormatter={(value) =>
                      moment(value).format('MMMM YYYY')
                    }
                  />
                  <Legend formatter={(value) => USER_STATUS_LABELS[value]} />
                  <CartesianGrid vertical={false} />
                  <Bar
                    stackId="count"
                    dataKey="draft"
                    fill={USER_STATUS_COLORS['draft']}
                  />
                  <Bar
                    stackId="count"
                    dataKey="changes_requested"
                    fill={USER_STATUS_COLORS['changes_requested']}
                  />
                  <Bar
                    stackId="count"
                    dataKey="submitted"
                    fill={USER_STATUS_COLORS['submitted']}
                  />
                  <Bar
                    stackId="count"
                    dataKey="validated"
                    fill={USER_STATUS_COLORS['validated']}
                  />
                  <Bar
                    stackId="count"
                    dataKey="refused"
                    fill={USER_STATUS_COLORS['refused']}
                  >
                    <LabelList dataKey="total" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </CardContainer>
        <CardContainer>
          <Card className="stat_card">
            <div className="stat_card_head">
              <h3>Répartition des demandes par statut</h3>
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
                    formatter={(value) => USER_STATUS_LABELS[value]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </CardContainer>
        <CardContainer>
          <Card className="stat_card">
            <div className="stat_card_head">
              <h3>Répartition des demandes par API</h3>
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
                      value === 'others'
                        ? 'Autres'
                        : DATA_PROVIDER_PARAMETERS[value]?.label,
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
                        : DATA_PROVIDER_PARAMETERS[value]?.label
                      ).substring(0, 25)
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
