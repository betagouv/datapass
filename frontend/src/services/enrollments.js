import { hashToQueryParams } from '../lib';
import httpClient from '../lib/http-client';
import jsonToFormData from '../lib/json-form-data';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

export function serializeEnrollment(enrollment) {
  return jsonToFormData({ enrollment });
}

export function createOrUpdateEnrollment({
  enrollment: {
    status,
    updated_at,
    created_at,
    id,
    siret,
    nom_raison_sociale,
    acl,
    events,
    team_members,
    documents,
    ...enrollment
  },
}) {
  const serializedEnrollment = serializeEnrollment(enrollment);
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  if (id) {
    return httpClient
      .patch(`${BACK_HOST}/api/enrollments/${id}`, serializedEnrollment, config)
      .then(({ data: enrollment }) => enrollment);
  }

  return (
    httpClient
      .post(`${BACK_HOST}/api/enrollments/`, serializedEnrollment, config)
      // format contact to a more usable structure
      // the backend should be able to use this structure to in the future
      .then(({ data: enrollment }) => enrollment)
  );
}

export function getUserEnrollment(id) {
  return (
    httpClient
      .get(`${BACK_HOST}/api/enrollments/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      // format contact to a more usable structure
      // the backend should be able to use this structure to in the future
      .then(({ data: enrollment }) => enrollment)
  );
}

export function hasAccessToEnrollment(id) {
  return getUserEnrollment(id)
    .then(() => true)
    .catch(() => false);
}

export function getEnrollmentCopies(id) {
  return httpClient
    .get(`${BACK_HOST}/api/enrollments/${id}/copies`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(({ data: { enrollments: data } }) => data);
}

export function getNextEnrollments(id) {
  return httpClient
    .get(`${BACK_HOST}/api/enrollments/${id}/next_enrollments`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(({ data: { enrollments: data } }) => data);
}

export function getPublicValidatedEnrollments({
  targetApi,
  page = null,
  size = null,
}) {
  const queryParam = hashToQueryParams({
    target_api: targetApi,
    page,
    size,
  });

  return httpClient
    .get(`${BACK_HOST}/api/enrollments/public${queryParam}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(({ data }) => data);
}

export const enrollmentsMock = {
  enrollments: [
    {
      id: 7,
      updated_at: '2018-07-23T13:05:38.447Z',
      nom_raison_sociale: null,
      target_api: 'api_particulier',
      status: 'submitted',
      demandeurs: [
        {
          id: 1664,
          type: 'demandeur',
          email: 'rdubigny@gmail.com',
        },
      ],
      notify_events_from_demandeurs_count: 0,
      acl: {
        show: true,
        create: false,
        update: false,
        destroy: true,
        validate: true,
        notify: true,
        copy: false,
        submit: false,
        request_changes: true,
        refuse: true,
        revoke: false,
        get_email_templates: true,
        mark_demandeur_notify_events_as_processed: true,
        index: false,
      },
      is_renewal: false,
    },
    {
      id: 10,
      updated_at: '2018-08-27T12:03:36.811Z',
      nom_raison_sociale: null,
      target_api: 'api_particulier',
      status: 'submitted',
      demandeurs: [
        {
          id: 1573,
          type: 'demandeur',
          email: 'rdubigny@gmail.com',
        },
      ],
      notify_events_from_demandeurs_count: 0,
      acl: {
        show: true,
        create: false,
        update: false,
        destroy: true,
        validate: true,
        notify: true,
        copy: false,
        submit: false,
        request_changes: true,
        refuse: true,
        revoke: false,
        get_email_templates: true,
        mark_demandeur_notify_events_as_processed: true,
        index: false,
      },
      is_renewal: false,
    },
    {
      id: 25,
      updated_at: '2018-09-28T08:07:37.947Z',
      nom_raison_sociale: null,
      target_api: 'api_particulier',
      status: 'submitted',
      demandeurs: [
        {
          id: 1447,
          type: 'demandeur',
          email: 'rdubigny@gmail.com',
        },
      ],
      notify_events_from_demandeurs_count: 0,
      acl: {
        show: true,
        create: false,
        update: false,
        destroy: true,
        validate: true,
        notify: true,
        copy: false,
        submit: false,
        request_changes: true,
        refuse: true,
        revoke: false,
        get_email_templates: true,
        mark_demandeur_notify_events_as_processed: true,
        index: false,
      },
      is_renewal: false,
    },
    {
      id: 122,
      updated_at: '2019-03-27T16:38:33.198Z',
      nom_raison_sociale: 'RED NEEDLES',
      target_api: 'api_particulier',
      status: 'changes_requested',
      demandeurs: [
        {
          id: 1453,
          type: 'demandeur',
          email: 'test10@yopmail.com',
        },
      ],
      notify_events_from_demandeurs_count: 0,
      acl: {
        show: true,
        create: false,
        update: false,
        destroy: true,
        validate: false,
        notify: true,
        copy: false,
        submit: false,
        request_changes: false,
        refuse: true,
        revoke: false,
        get_email_templates: true,
        mark_demandeur_notify_events_as_processed: true,
        index: false,
      },
      is_renewal: false,
    },
    {
      id: 135,
      updated_at: '2019-03-29T19:22:45.837Z',
      nom_raison_sociale: 'COMMUNE D HEM',
      target_api: 'api_particulier',
      status: 'submitted',
      demandeurs: [
        {
          id: 1606,
          type: 'demandeur',
          email: 'rdubigny@gmail.com',
        },
      ],
      notify_events_from_demandeurs_count: 0,
      acl: {
        show: true,
        create: false,
        update: false,
        destroy: true,
        validate: true,
        notify: true,
        copy: false,
        submit: false,
        request_changes: true,
        refuse: true,
        revoke: false,
        get_email_templates: true,
        mark_demandeur_notify_events_as_processed: true,
        index: false,
      },
      is_renewal: false,
    },
    {
      id: 126,
      updated_at: '2019-04-01T12:51:20.585Z',
      nom_raison_sociale: 'RED NEEDLES',
      target_api: 'api_particulier',
      status: 'submitted',
      demandeurs: [
        {
          id: 1558,
          type: 'demandeur',
          email: 'rdubigny@gmail.com',
        },
      ],
      notify_events_from_demandeurs_count: 0,
      acl: {
        show: true,
        create: false,
        update: false,
        destroy: true,
        validate: true,
        notify: true,
        copy: false,
        submit: false,
        request_changes: true,
        refuse: true,
        revoke: false,
        get_email_templates: true,
        mark_demandeur_notify_events_as_processed: true,
        index: false,
      },
      is_renewal: false,
    },
    {
      id: 152,
      updated_at: '2019-04-05T12:58:20.082Z',
      nom_raison_sociale: 'COMMUNE D HEM',
      target_api: 'api_particulier',
      status: 'submitted',
      demandeurs: [
        {
          id: 1539,
          type: 'demandeur',
          email: 'rdubigny@gmail.com',
        },
      ],
      notify_events_from_demandeurs_count: 0,
      acl: {
        show: true,
        create: false,
        update: false,
        destroy: true,
        validate: true,
        notify: true,
        copy: false,
        submit: false,
        request_changes: true,
        refuse: true,
        revoke: false,
        get_email_templates: true,
        mark_demandeur_notify_events_as_processed: true,
        index: false,
      },
      is_renewal: false,
    },
    {
      id: 26,
      updated_at: '2019-05-13T08:30:26.585Z',
      nom_raison_sociale: 'RED NEEDLES',
      target_api: 'api_particulier',
      status: 'submitted',
      demandeurs: [
        {
          id: 1378,
          type: 'demandeur',
          email: 'contact@azerazeR.cazeazefazefaz',
        },
      ],
      notify_events_from_demandeurs_count: 0,
      acl: {
        show: true,
        create: false,
        update: false,
        destroy: true,
        validate: true,
        notify: true,
        copy: false,
        submit: false,
        request_changes: true,
        refuse: true,
        revoke: false,
        get_email_templates: true,
        mark_demandeur_notify_events_as_processed: true,
        index: false,
      },
      is_renewal: false,
    },
    {
      id: 105,
      updated_at: '2019-05-17T12:26:19.264Z',
      nom_raison_sociale: 'RED NEEDLES',
      target_api: 'franceconnect',
      status: 'changes_requested',
      demandeurs: [
        {
          id: 1778,
          type: 'demandeur',
          email: 'rdubigny@gmail.com',
        },
      ],
      notify_events_from_demandeurs_count: 0,
      acl: {
        show: true,
        create: false,
        update: false,
        destroy: true,
        validate: false,
        notify: true,
        copy: false,
        submit: false,
        request_changes: false,
        refuse: true,
        revoke: false,
        get_email_templates: true,
        mark_demandeur_notify_events_as_processed: true,
        index: false,
      },
      is_renewal: false,
    },
    {
      id: 182,
      updated_at: '2019-07-15T10:09:11.225Z',
      nom_raison_sociale: 'CARDIN*REGINE/',
      target_api: 'franceconnect',
      status: 'submitted',
      demandeurs: [
        {
          id: 1785,
          type: 'demandeur',
          email: 'rdubigny@yopmail.com',
        },
      ],
      notify_events_from_demandeurs_count: 0,
      acl: {
        show: true,
        create: false,
        update: false,
        destroy: true,
        validate: true,
        notify: true,
        copy: false,
        submit: false,
        request_changes: true,
        refuse: true,
        revoke: false,
        get_email_templates: true,
        mark_demandeur_notify_events_as_processed: true,
        index: false,
      },
      is_renewal: false,
    },
  ],
  meta: {
    current_page: 1,
    next_page: 2,
    prev_page: null,
    total_pages: 25,
    total_count: 247,
  },
};

export function getEnrollments({
  page = null,
  sortBy = [],
  filter = [],
  detailed = null,
  size = null,
}) {
  const formatedSortBy = sortBy.map(({ id, desc }) => ({
    [id]: desc ? 'desc' : 'asc',
  }));
  const formatedFilter = filter.map(({ id, value }) => ({
    [id]: value,
  }));
  const queryParam = hashToQueryParams({
    page,
    detailed,
    size,
    sortedBy: formatedSortBy,
    filter: formatedFilter,
  });

  return httpClient
    .get(`${BACK_HOST}/api/enrollments/${queryParam}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(({ data }) => data);
}

export function getUserValidatedEnrollments(targetApi) {
  // NB. if the user has more than 100 validated franceconnect enrollments, he won’t be able to choose amongst them all
  // since we arbitrary limit the max size of the result to 100.
  return getEnrollments({
    filter: [
      { id: 'status', value: 'validated' },
      { id: 'target_api', value: targetApi },
    ],
    detailed: true,
    size: 100,
  }).then(({ enrollments }) => enrollments);
}

export function getUserEnrollments() {
  return httpClient
    .get(`${BACK_HOST}/api/enrollments/user`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(({ data }) => data);
}

export function changeEnrollmentState({ event, id, comment }) {
  const options = {
    event,
  };

  if (comment) {
    options.comment = comment;
  }

  return httpClient.patch(
    `${BACK_HOST}/api/enrollments/${id}/change_state`,
    options,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

export function updateTeamMember({
  teamMemberId,
  nom,
  prenom,
  email,
  phoneNumber,
  job,
}) {
  const team_member = {};
  if (nom) team_member[`family_name`] = nom;
  if (prenom) team_member[`given_name`] = prenom;
  if (email) team_member[`email`] = email;
  if (phoneNumber) team_member[`phone_number`] = phoneNumber;
  if (job) team_member[`job`] = job;
  const serializedTeamMember = jsonToFormData({ team_member });
  return httpClient
    .patch(
      `${BACK_HOST}/api/team_members/${teamMemberId}`,
      serializedTeamMember,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    .then(({ data }) => data);
}

export function deleteEnrollment({ id }) {
  return httpClient.delete(`${BACK_HOST}/api/enrollments/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function getMostUsedComments({ event, targetApi } = {}) {
  const queryParam = hashToQueryParams({
    event,
    target_api: targetApi,
  });

  return httpClient
    .get(`${BACK_HOST}/api/events/most-used-comments${queryParam}`, {
      headers: { 'Content-type': 'application/json' },
    })
    .then(({ data }) => data.map(({ comment }) => comment));
}

export function getEmailTemplates({ id }) {
  return httpClient
    .get(`${BACK_HOST}/api/enrollments/${id}/email_templates`, {
      headers: { 'Content-type': 'application/json' },
    })
    .then(({ data: { email_templates } }) => email_templates);
}

export function copyEnrollment({ id }) {
  return httpClient
    .post(`${BACK_HOST}/api/enrollments/${id}/copy`, {
      headers: { 'Content-type': 'application/json' },
    })
    .then(({ data }) => data);
}

export function getHubeeValidatedEnrollments() {
  return httpClient
    .get(`${BACK_HOST}/api/enrollments/hubee_validated`, {
      headers: { 'Content-type': 'application/json' },
    })
    .then(({ data: { enrollments } }) => enrollments);
}

export function markEventsAsProcessed({ id }) {
  return httpClient
    .patch(
      `${BACK_HOST}/api/enrollments/${id}/mark_demandeur_notify_events_as_processed`,
      {
        headers: { 'Content-type': 'application/json' },
      }
    )
    .then(({ data }) => data);
}
