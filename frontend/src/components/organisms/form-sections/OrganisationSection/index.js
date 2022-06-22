import { isEmpty } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import Button from '../../../atoms/hyperTexts/Button';
import { Card, CardContainer, CardHead } from '../../../molecules/Card';
import CopyToCliboardButton from '../../../molecules/CopyToCliboardButton';
import { FormContext } from '../../../templates/Form';
import { useAuth } from '../../AuthContext';
import ConfirmationModal from '../../ConfirmationModal';
import { ScrollablePanel } from '../../Scrollable';
import OrganisationCard from './OrganisationCard';
import TechnicalTeamCard from './TechnicalTeamCard';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;
const SECTION_LABEL = 'L’organisation';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

const OrganisationSection = ({ editorList = [] }) => {
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
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>L’organisation</h2>
      <CardContainer>
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
        </Card>
        <OrganisationCard />
        {!isEmpty(editorList) && <TechnicalTeamCard editorList={editorList} />}

        {!disabled && !isLoading && urlForDisconnectionPrompt && (
          <ConfirmationModal
            title="Vous allez être déconnecté"
            handleConfirm={() => (window.location = urlForDisconnectionPrompt)}
            handleCancel={() => setUrlForDisconnectionPrompt('')}
          >
            Afin de mettre à jour vos informations personnelles, vous allez être
            déconnecté.
          </ConfirmationModal>
        )}
      </CardContainer>
    </ScrollablePanel>
  );
};

OrganisationSection.sectionLabel = SECTION_LABEL;

export default OrganisationSection;
