import { isEmpty } from 'lodash';
import { useCallback, useContext, useEffect, useState } from 'react';
import { isValidNAFCode } from '../../../../lib';
import { getCachedOrganizationInformation } from '../../../../services/external';
import Alert from '../../../atoms/Alert';
import Button from '../../../atoms/hyperTexts/Button';
import Loader from '../../../atoms/Loader';
import { Card, CardHead } from '../../../molecules/Card';
import { FormContext } from '../../../templates/Form';
import { useAuth } from '../../AuthContext';
import DisconnectionModalCard from './DisconnectionModalCard';
import OrganizationPrompt from './OrganizationPrompt';

const { REACT_APP_BACK_HOST: BACK_HOST } = process.env;

export const OrganisationCard = () => {
  const {
    disabled,
    isUserEnrollmentLoading,
    onChange,
    enrollment: {
      organization_id = null,
      nom_raison_sociale,
      siret = '',
      target_api,
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
          activite_label,
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
          setActiviteLabel(activite_label);
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

  const onJoinOrganization = () => {
    setShowOrganizationPrompt(false);
    setUrlForDisconnectionPrompt(`${BACK_HOST}/api/users/join_organization`);
  };

  return (
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
              Erreur inconnue lors de la récupération des informations de cet
              établissement.
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
            Code NAF : {activite} {activiteLabel ? '- ' + activiteLabel : null}
          </div>
        </>
      )}

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
        <DisconnectionModalCard
          urlForDisconnectionPrompt={urlForDisconnectionPrompt}
          setUrlForDisconnectionPrompt={setUrlForDisconnectionPrompt}
        />
      )}
    </Card>
  );
};

export default OrganisationCard;
