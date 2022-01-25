import { isEmpty } from 'lodash';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useListItemNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const goToItem = useCallback(
    (target_api: string, id: number, clickEvent?: any) => {
      const targetUrl = `/${target_api.replace(/_/g, '-')}/${id}`;

      if (clickEvent?.ctrlKey || clickEvent?.metaKey) {
        // metaKey is cmd on Mac
        window.open(targetUrl); // open in new tab
      } else {
        const previousPath = `${location.pathname || '/'}${
          window.location.search
        }`;
        navigate(targetUrl, { state: { previousPath } });
      }
    },
    [location, navigate]
  );

  const goBackToList = useCallback(() => {
    document.title =
      'DataPass - gestion des habilitations juridiques pour les données à accès restreint';

    // @ts-ignore
    if (!isEmpty(location.state?.previousPath)) {
      // @ts-ignore
      return navigate(location.state.previousPath);
    }

    return navigate('/');
  }, [location, navigate]);

  return { goToItem, goBackToList };
};

export default useListItemNavigation;
