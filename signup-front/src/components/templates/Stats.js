import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
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

import { USER_STATUS_LABELS } from '../../lib/enrollment';
import { getAPIStats } from '../../services/stats';
import {
  TARGET_API_LABELS,
  TARGET_API_WITH_ENROLLMENTS_IN_PRODUCTION_ENV,
} from '../../lib/api';

import Helper from '../atoms/Helper';
import Loader from '../atoms/Loader';
import ListHeader from '../molecules/ListHeader';
import { stackLowUseAndUnpublishedApi } from '../../lib';

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
  pending: '#50514F',
  modification_pending: '#1A535C',
  sent: '#4ECDC4',
  validated: '#FFE66D',
  refused: '#FF6B6B',
};

export const Stats = ({
  match: {
    params: { targetApi },
  },
}) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      const result = await getAPIStats(targetApi);

      setStats({
        ...result.data,
        enrollment_by_target_api: stackLowUseAndUnpublishedApi(
          TARGET_API_WITH_ENROLLMENTS_IN_PRODUCTION_ENV,
          result.data.enrollment_by_target_api,
          10
        ),
      });
    }

    fetchStats();
  }, [targetApi]);

  if (!stats) {
    return (
      <section className="section-grey layout-full-page">
        <Loader />
      </section>
    );
  }

  return (
    <section className="section-grey stats-page">
      <div className="container">
        <ListHeader>
          <NavLink
            className="fr-tag secondary"
            activeClassName={'info'}
            exact
            to="/stats"
          >
            Toutes les APIs
          </NavLink>
          {TARGET_API_WITH_ENROLLMENTS_IN_PRODUCTION_ENV.map((targetApi) => (
            <NavLink
              key={targetApi}
              className="fr-tag secondary"
              activeClassName={'info'}
              exact
              to={`/stats/${targetApi}`}
            >
              {TARGET_API_LABELS[targetApi]}
            </NavLink>
          ))}
        </ListHeader>
        <div className="column-grid">
          <div className="row-grid">
            <div className="card">
              <div className="card__content">
                <h3>Demandes d’habilitation déposées</h3>
              </div>
              <div className="card__content card_number">
                {stats.enrollment_count}
              </div>
            </div>
            <div className="card">
              <div className="card__content">
                <h3>Demandes d’habilitation validées</h3>
                <div className="card__meta">
                  <a href="/public">voir la liste détaillée</a>
                </div>
              </div>
              <div className="card__content card_number">
                <div>{stats.validated_enrollment_count}</div>
              </div>
            </div>
          </div>
          <div className="row-grid">
            <div className="card">
              <div className="card__content">
                <h3>
                  Temps moyen de traitement des demandes
                  <Helper title="temps moyen entre la dernière soumission d’une demande jusqu’à sa validation ou son refus sur les 6 derniers mois" />
                </h3>
                <div className="card__meta">(en jours)</div>
              </div>
              <div className="card__content card_number">
                {stats.average_processing_time_in_days}
              </div>
            </div>
            <div className="card">
              <div className="card__content">
                <h3>
                  Pourcentage de demandes nécessitant un aller retour
                  <Helper title="sur les 6 derniers mois" />
                </h3>
                <div className="card__meta">(en % des demandes totales)</div>
              </div>
              <div className="card__content card_number">
                {stats.go_back_ratio}
              </div>
            </div>
          </div>
          <div className="row-grid">
            <div className="card">
              <div className="card__content">
                <h3>Demandes d’habilitation déposées</h3>
              </div>
              <div className="card__content card_graph">
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
                      dataKey="pending"
                      fill={USER_STATUS_COLORS['pending']}
                    />
                    <Bar
                      stackId="count"
                      dataKey="modification_pending"
                      fill={USER_STATUS_COLORS['modification_pending']}
                    />
                    <Bar
                      stackId="count"
                      dataKey="sent"
                      fill={USER_STATUS_COLORS['sent']}
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
            </div>
          </div>
          <div className="row-grid">
            <div className="card">
              <div className="card__content">
                <h3>Répartition des demandes par statut</h3>
              </div>
              <div className="card__content card_graph">
                <ResponsiveContainer width={'100%'} height={250}>
                  <PieChart>
                    <Pie
                      data={stats.enrollment_by_status}
                      dataKey="count"
                      label
                    >
                      {stats.enrollment_by_status.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={USER_STATUS_COLORS[entry.name]}
                        />
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
            </div>
          </div>
          <div className="row-grid">
            <div className="card">
              <div className="card__content">
                <h3>Répartition des demandes par API</h3>
              </div>
              <div className="card__content card_graph">
                <ResponsiveContainer width={'100%'} height={450}>
                  <PieChart>
                    <Pie
                      data={stats.enrollment_by_target_api}
                      dataKey="count"
                      label
                    >
                      {stats.enrollment_by_target_api.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [
                        value,
                        value === 'others'
                          ? 'Autres'
                          : TARGET_API_LABELS[value],
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
                          : TARGET_API_LABELS[value]
                        ).substring(0, 25)
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
