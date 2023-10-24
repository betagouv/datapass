import { Opinion } from '../config';
import httpClient from '../lib/http-client';
import jsonToFormData from '../lib/json-form-data';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

export function serializeOpinion(opinion: Opinion) {
  return jsonToFormData({ opinion });
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

export function createOpinion({
  content,
  reporterId,
  enrollmentId,
}: {
  content: string;
  reporterId: number;
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
