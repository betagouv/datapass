import React, { useContext, useEffect } from 'react';
import { FormContext } from '../../../templates/Form';
import { ScrollablePanel } from '../../Scrollable';
import TextInput from '../../../atoms/inputs/TextInput';
import TextAreaInput from '../../../atoms/inputs/TextAreaInput';
import Quote from '../../../atoms/inputs/Quote';
import OrWrapper from '../../../atoms/inputs/OrWrapper';
import FileInput from '../../../molecules/FileInput';
import RadioInput from '../../../atoms/inputs/RadioInput';
import YesNoRadioInput from '../../../atoms/inputs/YesNoRadioInput';
import { getCachedOrganizationInformation } from '../../../../services/external';
import WarningEmoji from '../../../atoms/icons/WarningEmoji';

const SECTION_LABEL = 'Structure';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

export const StructureSection = () => {
  const {
    disabled,
    onChange,
    enrollment: {
      intitule = '',
      siret,
      description = '',
      documents = [],
      documents_attributes = [],
      additional_content: {
        organization_type = '',
        organization_address = '',
        organization_postal_code = '',
        organization_city = '',
        organization_website = '',
        associated_public_organisation = '',
        participation_reseau = null,
        nom_reseau = '',
      },
    },
  } = useContext(FormContext);

  useEffect(() => {
    const fetchOrganizationInfo = async (siret) => {
      try {
        const { adresse, code_postal, ville } =
          await getCachedOrganizationInformation(siret);
        onChange({
          target: {
            value: adresse,
            name: 'additional_content.organization_address',
          },
        });
        onChange({
          target: {
            value: code_postal,
            name: 'additional_content.organization_postal_code',
          },
        });
        onChange({
          target: {
            value: ville,
            name: 'additional_content.organization_city',
          },
        });
      } catch (e) {
        // silently fail, the fields will not be prefilled.
      }
    };

    if (
      !disabled &&
      siret &&
      !organization_address &&
      !organization_postal_code &&
      !organization_city
    ) {
      fetchOrganizationInfo(siret);
    }
  }, [
    onChange,
    disabled,
    siret,
    organization_address,
    organization_postal_code,
    organization_city,
  ]);

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>Description de votre structure</h2>
      <Quote>
        <p>
          <WarningEmoji /> Attention : 1 structure = 1 lieu d’accueil. Merci de
          remplir une demande d’habilitation par lieu d’accueil.
        </p>
      </Quote>
      <TextInput
        label="Nom de la structure"
        meta="Cette information peut être rendue publique."
        name="intitule"
        value={intitule}
        disabled={disabled}
        onChange={onChange}
      />
      <RadioInput
        label="Type de structure"
        options={[
          { id: 'ccas', label: 'CCAS' },
          { id: 'centre-social', label: 'Centre social' },
          { id: 'secretariat-mairie', label: 'Secrétariat de mairie' },
          {
            id: 'maisons-departementales-solidarites',
            label: 'Maison départementale des solidarités',
          },
          { id: 'mediatheque', label: 'Médiathèque' },
          {
            id: 'autre-guichet',
            label: 'Autre guichet d’accueil de service public de proximité',
          },
          {
            id: 'guichet-accueil-osp',
            label:
              'Guichet d’accueil d’opérateur de service public (CAF, Pôle Emploi, etc.)',
          },
          {
            id: 'association',
            label:
              'Autre association d’accompagnement des publics ou de médiation numérique',
          },
          {
            id: 'structure-medico-sociale',
            label: 'Structure médico-sociale (CSAPA, CHU, CMS)',
          },
          { id: 'independant', label: 'Indépendant' },
        ]}
        name="additional_content.organization_type"
        value={organization_type}
        disabled={disabled}
        onChange={onChange}
      />
      <TextInput
        label="Adresse de la structure"
        name="additional_content.organization_address"
        value={organization_address}
        disabled={disabled}
        onChange={onChange}
      />
      <TextInput
        label="Code postal de la structure"
        name="additional_content.organization_postal_code"
        value={organization_postal_code}
        disabled={disabled}
        onChange={onChange}
        maxLength={5}
      />
      <TextInput
        label="Ville de la structure"
        name="additional_content.organization_city"
        value={organization_city}
        disabled={disabled}
        onChange={onChange}
      />
      <YesNoRadioInput
        label={
          <>
            Participez-vous à un réseau régional ou local (ex : PIMMS, EPN,
            etc.) ?
          </>
        }
        name="additional_content.participation_reseau"
        value={participation_reseau}
        disabled={disabled}
        onChange={onChange}
      />
      <TextInput
        label="Si oui, lequel ?"
        name="additional_content.nom_reseau"
        value={nom_reseau}
        disabled={disabled}
        onChange={onChange}
      />
      <TextAreaInput
        label="Description des missions de votre structure"
        name="description"
        value={description}
        disabled={disabled}
        onChange={onChange}
      />
      <TextInput
        label="Site web de votre structure"
        name="additional_content.organization_website"
        value={organization_website}
        disabled={disabled}
        onChange={onChange}
      />
      <Quote>
        <p>
          Si vous travaillez avec une administration ou un établissement publics
          (prestation, délégation de service public, subvention publique, etc.),
          merci de renseigner l’un des champs suivants :
        </p>
      </Quote>
      <OrWrapper>
        <TextInput
          label="Renseigner l’administration avec laquelle vous travaillez"
          name="additional_content.associated_public_organisation"
          value={associated_public_organisation}
          disabled={disabled}
          onChange={onChange}
        />
        <FileInput
          label="Téléverser un document"
          documentType={'Document::DelegationServicePublic'}
          uploadedDocuments={documents}
          documentsToUpload={documents_attributes}
          disabled={disabled}
          onChange={onChange}
        />
      </OrWrapper>
    </ScrollablePanel>
  );
};

StructureSection.sectionLabel = SECTION_LABEL;

export default StructureSection;
