import React, { FunctionComponent, useState } from 'react';
import Button from '../../atoms/hyperTexts/Button';
import Dropdown from '../Dropdown';
import Link from '../../atoms/hyperTexts/Link';
import './style.css';

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
          <div className="new-enrollment-button-container">
            <div className="new-enrollment-button-item">
              <Link inline href="/data-providers">
                <img src="/images/logo-hubee-small.png" alt="Logo HubEE" />
              </Link>
            </div>
            <div className="new-enrollment-button-item">
              <Link inline href="/aidants-connect">
                <img
                  src="/images/aidants-connect_logo.png"
                  alt="Logo AidantsConnect"
                />
              </Link>
            </div>
            <div className="new-enrollment-button-item">
              <Link inline href={`${API_GOUV_HOST}/datapass/api`}>
                <img src="/images/new-api-pass.png" alt="Logo AidantsConnect" />
              </Link>
            </div>
          </div>
        </Dropdown>
      )}
    </div>
  );
};
