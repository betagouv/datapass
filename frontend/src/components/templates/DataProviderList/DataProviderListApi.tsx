import React from 'react';
import ListHeader from '../../molecules/ListHeader';
import { DataProviderCard } from './DataProviderCard';
import Button from '../../atoms/hyperTexts/Button';
import useListItemNavigation from '../hooks/use-list-item-navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';

const { REACT_APP_API_GOUV_HOST: API_GOUV_HOST } = process.env;
const { REACT_APP_FRONT_HOST: FRONT_HOST } = process.env;

type ListApi = {
  title: string;
  slug: string;
  tagline: string;
  path: string;
  logo: string;
  pass_path: string;
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
        `${FRONT_HOST}/api/api_gouv/apis`
      );
      setResult(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return error.message;
      } else {
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
        {result.map(({ title, slug, tagline, path, logo, pass_path }) => (
          <DataProviderCard
            key={slug}
            label={title ?? ''}
            iconPath={`${API_GOUV_HOST}${logo}`}
            passPath={`${FRONT_HOST}${pass_path}`}
            description={tagline}
            aboutLink={`${API_GOUV_HOST}${path}`}
          />
        ))}
      </div>
    </main>
  );
};

export default DataProviderListApi;
