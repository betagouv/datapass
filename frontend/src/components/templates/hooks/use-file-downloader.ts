import fileDownload from 'js-file-download';
import { useState } from 'react';
import axios from 'axios';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

export const useFileDownloader = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const download = (fileUrl: string = '', acceptHeader?: string) => {
    setIsDownloading(true);

    const headers: { Accept?: string } = {};
    if (acceptHeader) {
      headers['Accept'] = acceptHeader;
    }

    axios
      .get(`${BACK_HOST}${fileUrl}`, {
        responseType: 'blob',
        headers,
      })
      .then((response) => {
        const contentDispositionHeader =
          response.headers['content-disposition'];
        const filename =
          contentDispositionHeader?.match(/filename="(.*)"/)?.[1] ||
          'datapass_download';
        fileDownload(response.data, filename);
        setIsDownloading(false);
      });
  };

  return { isDownloading, download };
};

export default useFileDownloader;
