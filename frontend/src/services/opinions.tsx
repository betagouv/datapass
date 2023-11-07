import { Opinion } from '../config';
import httpClient from '../lib/http-client';
import jsonToFormData from '../lib/json-form-data';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

export function serializeOpinion(opinion: Opinion) {
  return jsonToFormData({ opinion });
}

export function getAvailableReporters(targetApi: string) {
  return httpClient
    .get(`${BACK_HOST}/api/enrollments/${targetApi}/available_reporters`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(({ data: reporters }) => reporters);
}

export function getEnrollmentOpinions(enrollmentId: number) {
  return httpClient
    .get(`${BACK_HOST}/api/enrollments/${enrollmentId}/opinions`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(({ data: opinions }) => opinions);
}
export function deleteOpinion({
  opinionId,
  enrollmentId,
}: {
  opinionId: number;
  enrollmentId: number;
}) {
  return httpClient
    .delete(
      `${BACK_HOST}/api/enrollments/${enrollmentId}/opinions/${opinionId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    .then(({ data }) => data);
}

export function createOpinion({
  content,
  reporterId = 991330301,
  enrollmentId,
}: {
  content: string;
  reporterId?: number;
  enrollmentId: number;
}) {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  return httpClient
    .post(
      `${BACK_HOST}/api/enrollments/${enrollmentId}/opinions`,
      {
        opinion: {
          content,
          reporter_id: reporterId,
        },
      },
      config
    )
    .then(({ data: opinion }) => opinion);
}

export function getOpinion(id: number) {
  return httpClient
    .get(`${BACK_HOST}/api/opinions/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(({ data: opinion }) => opinion);
}

export function createOpinionComment({
  opinionId,
  content,
  enrollmentId,
}: {
  opinionId: number;
  content: string;
  enrollmentId: number;
}) {
  const formData = jsonToFormData({
    opinion_comment: {
      content,
    },
  });

  return httpClient
    .post(
      `${BACK_HOST}/api/enrollments/${enrollmentId}/opinions/${opinionId}/comments`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    .then(({ data }) => data);
}

export function deleteOpinionComment({
  opinionId,
  commentId,
  enrollmentId,
}: {
  opinionId: number;
  commentId: number;
  enrollmentId: number;
}) {
  return httpClient
    .delete(
      `${BACK_HOST}/api/enrollments/${enrollmentId}/opinions/${opinionId}/comments/${commentId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    .then(({ data }) => data);
}
