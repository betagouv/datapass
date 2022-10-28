import React from 'react';
import ListHeader from '../../molecules/ListHeader';
import { DataProviderCard } from './DataProviderCard';
import Button from '../../atoms/hyperTexts/Button';
import useListItemNavigation from '../hooks/use-list-item-navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';

const { REACT_APP_API_GOUV_HOST: API_GOUV_HOST } = process.env;
const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

type ListApi = {
  title: string;
  tagline: string;
  path: string;
  logo: string;
  datapass_link: string;
};

type GetListsResponse = {
  data: ListApi[];
};

export const DataProviderListApi = () => {
  const { goBackToList } = useListItemNavigation();
  const [result, setResult] = useState<ListApi[]>([]);

  async function getApisList() {
    try {
      const response: GetListsResponse = await axios.get(
        `${BACK_HOST}/api/api_gouv/apis_list`
      );
      setResult(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('error message: ', error.message);
        return error.message;
      } else {
        console.log('unexpected error: ', error);
        return 'An unexpected error occurred';
      }
    }
  }

  useEffect(() => {
    getApisList();
  }, []);

  return (
    <main className="list-page">
      <ListHeader title="Demander une nouvelle habilitation" />

      <div className="page-container list-container">
        <div className="list-title">
          <Button onClick={() => goBackToList()} secondary icon="arrow-left">
            retour
          </Button>
        </div>
        {result.map(({ title, tagline, path, logo, datapass_link }) => (
          <DataProviderCard
            key={datapass_link}
            label={title ?? ''}
            iconPath={`${API_GOUV_HOST}/${logo}`}
            passPath={`${BACK_HOST}/${datapass_link}`}
            description={tagline}
            aboutLink={`${API_GOUV_HOST}/${path}`}
          />
        ))}
      </div>
    </main>
  );
};

export default DataProviderListApi;
