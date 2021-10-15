import React, { useEffect, useState } from 'react';
import { getEnrollmentCopies } from '../../../services/enrollments';
import { isEmpty } from 'lodash';
import { Linkify } from '../../molecules/Linkify';

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
      <Linkify
        message={`Il existe une copie plus récente de cette demande : la demande #${enrollmentCopyId}.`}
      />
    </div>
  );
};

export default EnrollmentHasCopiesNotification;
