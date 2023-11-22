import { FunctionComponent, useState } from 'react';
import Button from '../../atoms/hyperTexts/Button';
import Dropdown from '../Dropdown';
import Link from '../../atoms/hyperTexts/Link';
import './style.css';

export const NewEnrollmentButton: FunctionComponent = () => {
  const [showDataProviderList, setShowDataProviderList] = useState(false);

  return (
    <div>
      <Button
        secondary
        large
        icon="add"
        onClick={() => setShowDataProviderList(true)}
      >
        Demander une habilitation
      </Button>
      {showDataProviderList && (
        <Dropdown onOutsideClick={() => setShowDataProviderList(false)}>
          <div className="new-enrollment-button-container">
            <div className="new-enrollment-button-item">
              <Link inline href="/data-providers/hubee">
                <img src="/images/logo-hubee-small.png" alt="Logo HubEE" />
              </Link>
            </div>
            <div className="new-enrollment-button-item">
              <Link inline href="/data-providers/api">
                <img src="/images/new-api-pass.png" alt="Logo AidantsConnect" />
              </Link>
            </div>
          </div>
        </Dropdown>
      )}
    </div>
  );
};
