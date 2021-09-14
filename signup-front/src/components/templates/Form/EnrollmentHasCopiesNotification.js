import React, { useEffect, useState } from 'react';
import { getEnrollmentCopies } from '../../../services/enrollments';
import { isEmpty } from 'lodash';

const EnrollmentHasCopiesNotification = ({ enrollmentId }) => {
  const [enrollmentCopies, setEnrollmentCopies] = useState(false);

  useEffect(() => {
    async function fetchEnrollmentCopies() {
      if (!enrollmentId) return setEnrollmentCopies(false);

      const enrollmentsCopies = await getEnrollmentCopies(enrollmentId);

      setEnrollmentCopies(enrollmentsCopies);
    }

    fetchEnrollmentCopies();
  }, [enrollmentId]);

  if (isEmpty(enrollmentCopies)) return null;

  const enrollmentCopyId = enrollmentCopies[0].id;

  return (
    <div className="notification warning">
      Il existe une copie plus récente de cette demande : la demande{' '}
      <a href={`/authorization-request/${enrollmentCopyId}`}>
        #{enrollmentCopyId}
      </a>
      .
    </div>
  );
};

export default EnrollmentHasCopiesNotification;
