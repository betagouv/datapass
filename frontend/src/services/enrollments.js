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
  filter = [],
  page = null,
  max_per_page = null,
}) {
  const formatedFilter = filter.map(({ id, value }) => ({
    key: id,
    value,
  }));
  const queryParam = hashToQueryParams({
    filter: formatedFilter,
    page,
    max_per_page,
  });

  return httpClient
    .get(`${BACK_HOST}/api/enrollments/public${queryParam}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(({ data }) => data);
}

export function getEnrollments({
  page = null,
  sortBy = [],
  filter = [],
  detailed = false,
  max_per_page = null,
}) {
  const formatedSortBy = sortBy.map(({ id, desc }) => ({
    [id]: desc ? 'desc' : 'asc',
  }));
  const formatedFilter = filter.map(({ id, value }) => ({
    key: id,
    value,
  }));
  const queryParam = hashToQueryParams({
    page,
    detailed,
    max_per_page,
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
    max_per_page: 100,
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

export function markNewEnrollmentsAsRead({ id }) {
  return httpClient
    .patch(
      `${BACK_HOST}/api/enrollments/${id}/mark_submit_enrollment_as_read`,
      {
        headers: { 'Content-type': 'application/json' },
      }
    )
    .then(({ data }) => data);
}
