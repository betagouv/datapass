import { isEmpty } from 'lodash';
import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useListItemNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const goToItem = useCallback(
    (target_api: string, id: number, clickEvent?: React.MouseEvent) => {
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

  const goBackToList = useCallback(
    (successMessage = null) => {
      document.title =
        'DataPass - gestion des habilitations juridiques pour les données à accès restreint';

      // @ts-ignore
      if (!isEmpty(location.state?.previousPath)) {
        // @ts-ignore
        return navigate(location.state.previousPath, {
          state: { message: successMessage },
        });
      }

      return navigate('/', { state: { message: successMessage } });
    },
    [location, navigate]
  );

  return { goToItem, goBackToList };
};

export default useListItemNavigation;
