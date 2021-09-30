import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { DATA_PROVIDER_LABELS } from '../../../config/data-provider-emails';
import { getNextEnrollments } from '../../../services/enrollments';

const formatNextEnrollment = (enrollment) =>
  `${DATA_PROVIDER_LABELS[enrollment.target_api] || enrollment.target_api} : #${
    enrollment.id
  }`;

const HasNextEnrollmentsNotification = ({ enrollmentId }) => {
  const [nextEnrollments, setNextEnrollments] = useState(false);

  useEffect(() => {
    async function fetchNextEnrollments() {
      if (!enrollmentId) return setNextEnrollments(false);

      const fetchedNextEnrollments = await getNextEnrollments(enrollmentId);

      setNextEnrollments(fetchedNextEnrollments);
    }

    fetchNextEnrollments();
  }, [enrollmentId]);

  if (isEmpty(nextEnrollments)) {
    return null;
  }

  const severalNexts = nextEnrollments.length > 1;

  return (
    <div className="notification info">
      Cette demande est liée{' '}
      {severalNexts ? 'aux demandes suivantes' : 'à la demande suivante'} :
      <ul>
        {nextEnrollments.map((enrollment) => (
          <li key={enrollment.id}>
            <a href={`/authorization-request/${enrollment.id}`}>
              Demande {formatNextEnrollment(enrollment)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HasNextEnrollmentsNotification;
