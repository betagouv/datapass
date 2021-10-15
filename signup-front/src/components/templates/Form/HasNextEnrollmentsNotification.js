import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { DATA_PROVIDER_LABELS } from '../../../config/data-provider-parameters';
import { getNextEnrollments } from '../../../services/enrollments';
import { Linkify } from '../../molecules/Linkify';

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
            <Linkify message={`Demande ${formatNextEnrollment(enrollment)}`} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HasNextEnrollmentsNotification;
