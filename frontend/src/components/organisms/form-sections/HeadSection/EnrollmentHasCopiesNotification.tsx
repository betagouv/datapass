import React, { useEffect, useState } from 'react';
import { getEnrollmentCopies } from '../../../../services/enrollments';
import { isEmpty } from 'lodash';
import { Linkify } from '../../../molecules/Linkify';
import Alert, { AlertType } from '../../../atoms/Alert';
import { Enrollment } from '../../../templates/InstructorEnrollmentList';

const EnrollmentHasCopiesNotification = ({
  enrollmentId,
}: {
  enrollmentId: number;
}) => {
  const [enrollmentCopies, setEnrollmentCopies] = useState<Enrollment[]>([]);

  useEffect(() => {
    async function fetchEnrollmentCopies() {
      if (!enrollmentId) return setEnrollmentCopies([]);

      const enrollmentsCopies = await getEnrollmentCopies(enrollmentId);

      setEnrollmentCopies(enrollmentsCopies);
    }

    fetchEnrollmentCopies();
  }, [enrollmentId]);

  if (isEmpty(enrollmentCopies)) return null;

  const enrollmentCopyId = enrollmentCopies[0].id;

  return (
    <Alert
      type={AlertType.warning}
      title={'Il existe une copie plus récente de cette habilitation'}
    >
      <Linkify message={`L’habilitation #${enrollmentCopyId}.`} />
    </Alert>
  );
};

export default EnrollmentHasCopiesNotification;
