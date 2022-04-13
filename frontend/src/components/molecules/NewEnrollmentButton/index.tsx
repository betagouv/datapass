import React, { FunctionComponent, useState } from 'react';
import Button from '../../atoms/hyperTexts/Button';
import Dropdown from '../Dropdown';
import IndexPointingRightEmoji from '../../atoms/icons/IndexPointingRightEmoji';
import Link from '../../atoms/hyperTexts/Link';

const { REACT_APP_API_GOUV_HOST: API_GOUV_HOST } = process.env;

export const NewEnrollmentButton: FunctionComponent = () => {
  const [showDataProviderList, setShowDataProviderList] = useState(false);

  return (
    <div>
      <Button large icon="add" onClick={() => setShowDataProviderList(true)}>
        Demander une habilitation
      </Button>
      {showDataProviderList && (
        <Dropdown onOutsideClick={() => setShowDataProviderList(false)}>
          <p>
            <IndexPointingRightEmoji />
            {' '}
            <Link inline href="/data-providers">
              Demander une habilitation portail HubEE
            </Link>
          </p>
          <p>
            <IndexPointingRightEmoji />
            {' '}
            <Link inline href="/aidants-connect">
              Demander une habilitation AidantsConnect
            </Link>
          </p>
          <p>
            <IndexPointingRightEmoji />
            {' '}
            <Link inline href={`${API_GOUV_HOST}/datapass/api`}>
              Demander une habilitation API
            </Link>
          </p>
        </Dropdown>
      )}
    </div>
  );
};
