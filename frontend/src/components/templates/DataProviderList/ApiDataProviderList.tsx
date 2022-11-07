import React from 'react';
import ListHeader from '../../molecules/ListHeader';
import { DataProviderCard } from './DataProviderCard';
import Button from '../../atoms/hyperTexts/Button';
import useListItemNavigation from '../hooks/use-list-item-navigation';
import { useState, useEffect } from 'react';
import { getApisLists } from '../../../services/api-gouv';

const { REACT_APP_API_GOUV_HOST: API_GOUV_HOST } = process.env;

type ListApi = {
  title: string;
  slug: string;
  tagline: string;
  path: string;
  logo: string;
  pass_path: string;
};

export const ApiDataProviderList = () => {
  const { goBackToList } = useListItemNavigation();
  const [result, setResult] = useState<ListApi[]>([]);

  useEffect(() => {
    getApisLists().then((data) => setResult(data));
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
            passPath={`${pass_path}`}
            description={tagline}
            aboutLink={`${API_GOUV_HOST}${path}`}
          />
        ))}
      </div>
    </main>
  );
};

export default ApiDataProviderList;
