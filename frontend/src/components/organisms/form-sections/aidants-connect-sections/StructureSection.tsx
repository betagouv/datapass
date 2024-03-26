import React, { useContext, useEffect } from 'react';
import { FormContext } from '../../../templates/Form';
import { ScrollablePanel } from '../../Scrollable';
import TextInput from '../../../atoms/inputs/TextInput';
import TextAreaInput from '../../../atoms/inputs/TextAreaInput';
import OrWrapper from '../../../atoms/inputs/OrWrapper';
import FileInput from '../../../molecules/FileInput';
import { getCachedOrganizationInformation } from '../../../../services/external';
import WarningEmoji from '../../../atoms/icons/WarningEmoji';
import ExpandableQuote from '../../../molecules/ExpandableQuote';
import SelectInput from '../../../atoms/inputs/SelectInput';
import SideBySideWrapper from '../../../atoms/inputs/SideBySideWrapper';
import CheckboxInput from '../../../atoms/inputs/CheckboxInput';
import Input from '../../../atoms/inputs/Input';

const SECTION_LABEL = 'La structure';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

export const StructureSection = () => {
  const {
    disabled,
    onChange,
    enrollment: {
      intitule = '',
      siret,
      description = '',
      type_projet = '',
      volumetrie_approximative = '',
      documents = [],
      documents_attributes = [],
      additional_content: {
        organization_address = '',
        organization_postal_code = '',
        organization_city = '',
        organization_website = '',
        associated_public_organisation = '',
        label_france_services = false,
        label_fabrique_territoires = false,
        recrutement_conseiller_numerique = false,
        participation_reseau = false,
      },
    },
  } = useContext(FormContext)!;

  useEffect(() => {
    const fetchOrganizationInfo = async (siret: string) => {
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
      <h2>La description de la structure qui servira de lieu d’accueil</h2>
      <ExpandableQuote title="Comment remplir cette section ?">
        <p>
          <WarningEmoji /> Attention : 1 structure = 1 lieu d’accueil.
          <br />
          Merci de remplir une demande d’habilitation par lieu d’accueil.
        </p>
      </ExpandableQuote>
      <SelectInput
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
              'Guichet d’accueil d’opérateur de service public (CAF, France Travail, etc.)',
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
        name="type_projet"
        value={type_projet}
        disabled={disabled}
        onChange={onChange}
        useOtherOption={true}
        required
      />
      <TextInput
        label="Nom de la structure"
        meta="Cette information peut être rendue publique."
        name="intitule"
        value={intitule}
        disabled={disabled}
        onChange={onChange}
        required
      />
      <TextInput
        label="Adresse"
        name="additional_content.organization_address"
        value={organization_address}
        disabled={disabled}
        onChange={onChange}
        required
      />
      <SideBySideWrapper>
        <TextInput
          label="Code postal"
          name="additional_content.organization_postal_code"
          value={organization_postal_code}
          disabled={disabled}
          onChange={onChange}
          maxLength={5}
          required
        />
        <TextInput
          label="Ville"
          name="additional_content.organization_city"
          value={organization_city}
          disabled={disabled}
          onChange={onChange}
          required
        />
      </SideBySideWrapper>
      <TextInput
        label="Site internet"
        name="additional_content.organization_website"
        value={organization_website}
        disabled={disabled}
        onChange={onChange}
      />
      <TextAreaInput
        label="Quelles sont les missions de votre structure ?"
        name="description"
        value={description}
        disabled={disabled}
        onChange={onChange}
        required
      />
      <Input
        label="Nombre de démarches ou dossiers traités par semaine"
        name="volumetrie_approximative"
        value={volumetrie_approximative}
        disabled={disabled}
        onChange={onChange}
      />
      <div className="fr-mb-3w">
        Si vous travaillez avec une administration ou un établissement publics
        (prestation, délégation de service public, subvention publique, etc.),
        merci de renseigner l’un des champs suivants :
      </div>
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
      <h3>Autres caractéristiques de la structure</h3>
      <div className="fr-mb-3w">
        Quels labels ou missions sont liés à votre structure ?
      </div>
      <CheckboxInput
        label="Label France Services"
        name="additional_content.label_france_services"
        value={label_france_services}
        disabled={disabled}
        onChange={onChange}
      />
      <CheckboxInput
        label="Label Fabrique des Territoires"
        name="additional_content.label_fabrique_territoires"
        value={label_fabrique_territoires}
        disabled={disabled}
        onChange={onChange}
      />
      <CheckboxInput
        label="Recrutement des Conseillers Numériques"
        name="additional_content.recrutement_conseiller_numerique"
        value={recrutement_conseiller_numerique}
        disabled={disabled}
        onChange={onChange}
      />
      <CheckboxInput
        label="Réseau EPN (Établissements Publics Numériques)"
        name="additional_content.participation_reseau"
        value={participation_reseau}
        disabled={disabled}
        onChange={onChange}
      />
    </ScrollablePanel>
  );
};

StructureSection.sectionLabel = SECTION_LABEL;

export default StructureSection;
