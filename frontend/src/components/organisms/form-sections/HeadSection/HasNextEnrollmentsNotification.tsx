import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { getNextEnrollments } from '../../../../services/enrollments';
import { Linkify } from '../../../molecules/Linkify';
import Alert from '../../../atoms/Alert';
import IndexPointingRightEmoji from '../../../atoms/icons/IndexPointingRightEmoji';
import { useDataProviderConfigurations } from '../../../templates/hooks/use-data-provider-configurations';
import { Enrollment } from '../../../../config';

const HasNextEnrollmentsNotification = ({
  enrollmentId,
}: {
  enrollmentId: number;
}) => {
  const [nextEnrollments, setNextEnrollments] = useState<Enrollment[]>([]);
  const { dataProviderConfigurations } = useDataProviderConfigurations();

  useEffect(() => {
    async function fetchNextEnrollments() {
      if (!enrollmentId) return setNextEnrollments([]);

      const fetchedNextEnrollments = await getNextEnrollments(enrollmentId);

      setNextEnrollments(fetchedNextEnrollments);
    }

    fetchNextEnrollments();
  }, [enrollmentId]);

  const formatNextEnrollment = (enrollment: Enrollment) =>
    `${
      dataProviderConfigurations?.[enrollment.target_api]?.label ||
      enrollment.target_api
    } : #${enrollment.id}`;

  if (isEmpty(nextEnrollments)) {
    return null;
  }

  const severalNexts = nextEnrollments.length > 1;

  return (
    <Alert
      title={
        <>
          Cette habilitation est liée{' '}
          {severalNexts
            ? 'aux habilitations suivantes'
            : 'à l’habilitation suivante'}
        </>
      }
    >
      {nextEnrollments.map((enrollment) => (
        <p key={enrollment.id}>
          <IndexPointingRightEmoji />
          {' '}
          <Linkify
            message={`Habilitation ${formatNextEnrollment(enrollment)}`}
          />
        </p>
      ))}
    </Alert>
  );
};

export default HasNextEnrollmentsNotification;
