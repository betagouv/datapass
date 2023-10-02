import { useEffect } from 'react';

function ExternalRedirect({ url }: { url: string }) {
  useEffect(() => {
    window.location.href = url;
  }, [url]);

  return null;
}

export default ExternalRedirect;
