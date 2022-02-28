import { useEffect, useState } from 'react';

export const useGetSubscribedDemarcheEnLigne = ({
  isUserEnrollmentLoading,
  siret,
  target_api,
}: {
  isUserEnrollmentLoading: boolean;
  siret: string;
  target_api: string;
}) => {
  const [subscribedDemarcheEnLigne, setSubscribedDemarcheEnLigne] = useState<
    string[]
  >([]);

  useEffect(() => {
    const getSubscribedDemarcheEnLigne = async () => {
      if (!isUserEnrollmentLoading && siret && target_api) {
        await console.log('Let’s find some habs');

        setSubscribedDemarcheEnLigne(['EtatCivil', 'HebergementTourisme']);
      }
    };

    getSubscribedDemarcheEnLigne();
  }, [isUserEnrollmentLoading, siret, target_api]);

  return subscribedDemarcheEnLigne;
};

export default useGetSubscribedDemarcheEnLigne;
