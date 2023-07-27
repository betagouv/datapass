import {
  Enrollment,
  TeamMember,
} from '../components/templates/InstructorEnrollmentList';
import { EnrollmentEvent } from '../config/event-configuration';
import { hashToQueryParams } from '../lib';
import httpClient from '../lib/http-client';
import jsonToFormData from '../lib/json-form-data';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

export function serializeEnrollment(enrollment: Enrollment) {
  return jsonToFormData({ enrollment });
}

export function createOrUpdateEnrollment({
  enrollment,
}: {
  enrollment: Enrollment;
}) {
  const serializedEnrollment = serializeEnrollment(enrollment);
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  if (enrollment.id) {
    return httpClient
      .patch(
        `${BACK_HOST}/api/enrollments/${enrollment.id}`,
        serializedEnrollment,
        config
      )
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

export function getUserEnrollment(id: number) {
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

export function hasAccessToEnrollment(id: number) {
  return getUserEnrollment(id)
    .then(() => true)
    .catch(() => false);
}

export function getEnrollmentCopies(id: number) {
  return httpClient
    .get(`${BACK_HOST}/api/enrollments/${id}/copies`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(({ data: { enrollments: data } }) => data);
}

export function getNextEnrollments(id: number) {
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
}: {
  page?: number | null;
  sortBy?: { id: string; desc: boolean }[];
  filter?: { id: string; value: any }[];
  detailed?: boolean;
  max_per_page?: number | null;
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

export function getUserValidatedEnrollments(targetApi: string) {
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

export function changeEnrollmentState({
  event,
  id,
  comment,
}: {
  event: EnrollmentEvent;
  id: number;
  comment: string | null | undefined;
}) {
  let options = {
    event,
    ...(comment ? { comment } : {}),
  };

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

export function updateTeamMember(teamMember: TeamMember) {
  const serializedTeamMember = jsonToFormData({ team_member: teamMember });
  return httpClient
    .patch(
      `${BACK_HOST}/api/team_members/${teamMember.id}`,
      serializedTeamMember,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    .then(({ data }) => data);
}

export function deleteEnrollment({ id }: { id: number }) {
  return httpClient.delete(`${BACK_HOST}/api/enrollments/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function getMostUsedComments({
  event,
  targetApi,
}: {
  event: string;
  targetApi: string;
}) {
  const queryParam = hashToQueryParams({
    event,
    target_api: targetApi,
  });

  return httpClient
    .get(`${BACK_HOST}/api/events/most-used-comments${queryParam}`, {
      headers: { 'Content-type': 'application/json' },
    })
    .then(({ data }) =>
      data.map(({ comment }: { comment: string }) => comment)
    );
}

export function getEmailTemplates({ id }: { id: number }) {
  return httpClient
    .get(`${BACK_HOST}/api/enrollments/${id}/email_templates`, {
      headers: { 'Content-type': 'application/json' },
    })
    .then(({ data: { email_templates } }) => email_templates);
}

export function copyEnrollment({ id }: { id: number }) {
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

export function markEventAsRead({
  id,
  event_name,
}: {
  id: number;
  event_name: EnrollmentEvent;
}) {
  const queryParam = hashToQueryParams({
    event_name,
  });
  return httpClient
    .patch(
      `${BACK_HOST}/api/enrollments/${id}/mark_event_as_processed/${queryParam}`,
      {
        headers: { 'Content-type': 'application/json' },
      }
    )
    .then(({ data }) => data);
}
