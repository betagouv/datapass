import { useEffect, useState } from 'react';
import { getHubeeValidatedEnrollments } from '../../../../services/enrollments';
import { getScopesFromEnrollments } from '../../../../lib';

export const useGetSubscribedDemarcheEnLigne = ({
  isUserEnrollmentLoading,
  siret,
}: {
  isUserEnrollmentLoading: boolean;
  siret: string;
}) => {
  const [subscribedDemarchesEnLigne, setSubscribedDemarchesEnLigne] = useState<
    string[]
  >([]);

  useEffect(() => {
    const fetchSubscribedDemarchesEnLigne = async () => {
      if (!isUserEnrollmentLoading && siret) {
        const enrollments = await getHubeeValidatedEnrollments();
        const demarchesEnLigne = getScopesFromEnrollments(
          enrollments.filter(({ siret: s }: { siret: string }) => siret === s)
        );
        setSubscribedDemarchesEnLigne(demarchesEnLigne);
      }
    };

    fetchSubscribedDemarchesEnLigne();
  }, [isUserEnrollmentLoading, siret]);

  return subscribedDemarchesEnLigne;
};

export default useGetSubscribedDemarcheEnLigne;
