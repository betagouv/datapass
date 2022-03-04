import React, { useCallback, useContext, useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { useAuth } from '../../AuthContext';
import {
  getCachedOrganizationActivityDetails,
  getCachedOrganizationInformation,
} from '../../../../services/external';
import { isValidNAFCode } from '../../../../lib';
import OrganizationPrompt from './OrganizationPrompt';
import { ScrollablePanel } from '../../Scrollable';
import { FormContext } from '../../../templates/Form';
import Loader from '../../../atoms/Loader';
import CopyToCliboardButton from '../../../molecules/CopyToCliboardButton';
import Button from '../../../atoms/hyperTexts/Button';
import { Card, CardContainer, CardHead } from '../../../molecules/Card';
import TechnicalTeamCard from './TechnicalTeamCard';
import Alert from '../../../atoms/Alert';
import ConfirmationModal from '../../ConfirmationModal';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;
const SECTION_LABEL = 'L’organisation';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

const OrganisationSection = ({ editorList = [] }) => {
  const {
    disabled,
    isUserEnrollmentLoading,
    onChange,
    enrollment: {
      organization_id = null,
      nom_raison_sociale,
      siret = '',
      target_api,
      team_members,
    },
  } = useContext(FormContext);

  const [title, setTitle] = useState('');
  const [adresse, setAdresse] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [ville, setVille] = useState('');
  const [activite, setActivite] = useState('');
  const [activiteLabel, setActiviteLabel] = useState('');
  const [isOrganizationInfoLoading, setIsOrganizationInfoLoading] =
    useState(false);
  const [showOrganizationInfoNotFound, setShowOrganizationInfoNotFound] =
    useState(false);
  const [showOrganizationInfoError, setShowOrganizationInfoError] =
    useState(false);
  const [showOrganizationPrompt, setShowOrganizationPrompt] = useState(false);
  const [urlForDisconnectionPrompt, setUrlForDisconnectionPrompt] =
    useState('');

  const { user, isLoading } = useAuth();
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

  const updateOrganizationInfo = useCallback(
    ({ organization_id, siret }) => {
      onChange({
        target: {
          name: 'organization_id',
          value: organization_id,
        },
      });
      onChange({
        target: { name: 'siret', value: siret },
      });
    },
    [onChange]
  );

  useEffect(() => {
    // initialize organization_id & siret if needed
    if (
      !isUserEnrollmentLoading &&
      !disabled &&
      !organization_id &&
      !isEmpty(user.organizations)
    ) {
      updateOrganizationInfo({
        organization_id: user.organizations[0].id,
        siret: user.organizations[0].siret,
      });
    }
  }, [
    isUserEnrollmentLoading,
    organization_id,
    disabled,
    updateOrganizationInfo,
    user,
  ]);

  useEffect(() => {
    const fetchOrganizationInfo = async (siret) => {
      try {
        setIsOrganizationInfoLoading(true);
        const {
          title,
          activite,
          adresse,
          code_postal,
          ville,
          etat_administratif,
        } = await getCachedOrganizationInformation(siret);

        if (etat_administratif !== 'A') {
          setTitle('');
          setAdresse('');
          setCodePostal('');
          setVille('');
          setActivite('');
          setActiviteLabel('');
          setIsOrganizationInfoLoading(false);
          setShowOrganizationInfoNotFound(true);
          setShowOrganizationInfoError(false);
        } else {
          setTitle(title);
          setAdresse(adresse);
          setCodePostal(code_postal);
          setVille(ville);
          setActivite(activite);
          setIsOrganizationInfoLoading(false);
          setShowOrganizationInfoNotFound(false);
          setShowOrganizationInfoError(false);
        }
      } catch (e) {
        setTitle('');
        setAdresse('');
        setCodePostal('');
        setVille('');
        setActivite('');
        setActiviteLabel('');
        setIsOrganizationInfoLoading(false);
        setShowOrganizationInfoNotFound(false);
        setShowOrganizationInfoError(true);
      }
    };

    if (siret) {
      fetchOrganizationInfo(siret);
    }
  }, [siret]);

  useEffect(() => {
    const fetchOrganizationActivityLabel = async (activite) => {
      try {
        const { message } = await getCachedOrganizationActivityDetails(
          activite
        );
        setActiviteLabel(message);
      } catch (e) {
        setActiviteLabel('Code inconnu');
      }
    };
    if (activite) {
      fetchOrganizationActivityLabel(activite);
    }
  }, [activite]);

  const onOrganizationChange = (new_organization_id) => {
    setShowOrganizationPrompt(false);

    if (!isEmpty(user.organizations)) {
      updateOrganizationInfo({
        organization_id: new_organization_id,
        siret: user.organizations.find((o) => o.id === new_organization_id)
          .siret,
      });
    }
  };

  const onUpdatePersonalInformation = () =>
    setUrlForDisconnectionPrompt(`${BACK_HOST}/api/users/personal_information`);

  const onJoinOrganization = () => {
    setShowOrganizationPrompt(false);
    setUrlForDisconnectionPrompt(`${BACK_HOST}/api/users/join_organization`);
  };

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
        <Card>
          {isUserEnrollmentLoading || isOrganizationInfoLoading ? (
            <Loader />
          ) : (
            <>
              <h3>Vous faites cette demande pour</h3>
              {activite && !isValidNAFCode(target_api, activite) && (
                <Alert type="warning">
                  Votre organisme ne semble pas être éligible
                </Alert>
              )}
              {showOrganizationInfoNotFound && (
                <Alert type="warning">
                  Cet établissement est fermé ou le SIRET est invalide.
                </Alert>
              )}
              {showOrganizationInfoError && (
                <Alert type="error">
                  Erreur inconnue lors de la récupération des informations de
                  cet établissement.
                </Alert>
              )}
              <CardHead>
                <b>
                  {title || (disabled && nom_raison_sociale)}{' '}
                  <Button
                    title="Plus d’information sur la donnée"
                    outline
                    icon="eye"
                    href={`https://annuaire-entreprises.data.gouv.fr/entreprise/${siret}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                </b>
                {!disabled && (
                  <Button
                    title="demander une habilitation pour une autre organisation"
                    outline
                    icon="edit"
                    onClick={() => setShowOrganizationPrompt(true)}
                  />
                )}
              </CardHead>
              <div>{adresse}</div>
              <div>
                {codePostal} {ville}
              </div>
              <div>SIRET : {siret}</div>
              <div>
                Code NAF : {activite}{' '}
                {activiteLabel ? '- ' + activiteLabel : null}
              </div>
            </>
          )}
        </Card>
        {!isEmpty(editorList) && <TechnicalTeamCard editorList={editorList} />}

        {!disabled && !isLoading && showOrganizationPrompt && (
          <OrganizationPrompt
            selectedOrganizationId={organization_id}
            onSelect={onOrganizationChange}
            onJoinOrganization={onJoinOrganization}
            onClose={() => setShowOrganizationPrompt(false)}
            organizations={user.organizations}
          />
        )}
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
