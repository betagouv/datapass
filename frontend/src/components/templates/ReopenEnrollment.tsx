import { useEffect } from 'react';

import { reopenEnrollment } from '../../services/enrollments';
import { useParams } from 'react-router-dom';
import RedirectToTheRightDataProviderForm from './RedirectToTheRightDataProviderForm';

const ReopenEnrollment = () => {
  const { enrollmentId }: { enrollmentId?: string } = useParams();

  const triggerReopenEnrollment = async ({
    enrollmentId,
  }: {
    enrollmentId: string;
  }) => {
    await reopenEnrollment({
      id: Number(enrollmentId),
    });
  };

  useEffect(() => {
    if (enrollmentId) {
      triggerReopenEnrollment({ enrollmentId });
    }
  }, [enrollmentId]);

  return <RedirectToTheRightDataProviderForm />;
};

export default ReopenEnrollment;
