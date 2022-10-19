import { useMatomo } from '@datapunt/matomo-tracker-react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../components/organisms/AuthContext';
import useFileDownloader from '../components/templates/hooks/use-file-downloader';
import useListItemNavigation from '../components/templates/hooks/use-list-item-navigation';

export const withMatomoTrackEvent = (Component) => {
  return (props) => {
    const { trackEvent } = useMatomo();
    return <Component {...props} matomoTrackEvent={trackEvent} />;
  };
};

export const withFileDownloader = (Component) => {
  return (props) => {
    const { isDownloading, download } = useFileDownloader();
    const downloadExport = () =>
      download('/api/enrollments/export', 'text/csv');
    return (
      <Component
        {...props}
        isExportDownloading={isDownloading}
        downloadExport={downloadExport}
      />
    );
  };
};

export const withListItemNavigation = (Component) => {
  return (props) => {
    const { goToItem } = useListItemNavigation();
    return <Component {...props} goToItem={goToItem} />;
  };
};

export const withAuth = (Component) => {
  return (props) => (
    <AuthContext.Consumer>
      {(userProps) => <Component {...props} {...userProps} />}
    </AuthContext.Consumer>
  );
};

export const withParams = (Component) => {
  return (props) => {
    const params = useParams();
    return <Component {...props} params={params} />;
  };
};
