import { isEmpty } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import Button from '../../../atoms/hyperTexts/Button';
import { Card, CardHead } from '../../../molecules/Card';
import CopyToCliboardButton from '../../../molecules/CopyToCliboardButton';
import { FormContext } from '../../../templates/Form';
import { useAuth } from '../../AuthContext';
import DisconnectionModalCard from './DisconnectionModalCard';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

export const PersonalInformationCard = () => {
  const {
    disabled,
    enrollment: { team_members },
  } = useContext(FormContext);

  const { user, isLoading } = useAuth();

  const [urlForDisconnectionPrompt, setUrlForDisconnectionPrompt] =
    useState('');

  const [personalInformation, setPersonalInformation] = useState({});

  useEffect(() => {
    const firstDemandeur =
      !isEmpty(team_members) &&
      team_members.find(({ type }) => type === 'demandeur');
    if (firstDemandeur) {
      // note that they might be more than one demandeur
      // for now we just display the first demandeur found
      setPersonalInformation(firstDemandeur);
    }
  }, [team_members]);

  const onUpdatePersonalInformation = () =>
    setUrlForDisconnectionPrompt(`${BACK_HOST}/api/users/personal_information`);

  return (
    <Card>
      <h3>Vous êtes</h3>
      <CardHead>
        <b>
          {personalInformation.given_name} {personalInformation.family_name}
        </b>
        {!disabled && (
          <Button
            title="Modifier mes informations"
            outline
            icon="edit"
            onClick={onUpdatePersonalInformation}
          />
        )}
      </CardHead>
      <div>
        {personalInformation.email}
        <CopyToCliboardButton textToCopy={personalInformation.email} />
      </div>
      <div>{personalInformation.phone_number}</div>
      <div>{personalInformation.job}</div>

      {!disabled && !isLoading && urlForDisconnectionPrompt && (
        <DisconnectionModalCard
          urlForDisconnectionPrompt={urlForDisconnectionPrompt}
          setUrlForDisconnectionPrompt={setUrlForDisconnectionPrompt}
        />
      )}
    </Card>
  );
};

export default PersonalInformationCard;
