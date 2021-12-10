import React from 'react';
import PropTypes from 'prop-types';

import Form from '../../components/templates/Form';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import DescriptionSection from '../../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../../components/organisms/form-sections/DonneesSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import ÉquipeSection from '../../components/organisms/form-sections/ÉquipeSection';
import PiecesJustificativesSection from '../../components/organisms/form-sections/urssaf-sections/PiecesJustificativesSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import { CadreJuridiqueDescription } from './common';
import { DATA_PROVIDER_CONTACT_EMAILS } from '../../config/data-provider-parameters';

const target_api = 'api_declaration_cesu';

const availableScopes = [
  {
    value: 'api_cesu050',
    label: 'Télédéclaration du salaire',
    mandatory: true,
  },
  {
    value: 'api_cesu040',
    label: 'Obtention du montant estimé des cotisations sociales',
    mandatory: true,
  },
  {
    value: 'api_cesu030',
    label: 'Enregistrement de mandat',
    mandatory: true,
  },
  {
    value: 'api_cesu031',
    label: 'Annulation de mandat',
    mandatory: true,
  },
  {
    value: 'api_cesu020',
    label: 'Vérification compte CESU PE',
    mandatory: true,
  },
  {
    value: 'api_cesu021',
    label: 'Vérification compte CESU SP',
    mandatory: true,
  },
  {
    value: 'api_cesu010',
    label: 'Inscription PE au régime CESU',
    mandatory: true,
  },
];

const ApiDeclarationCesu = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <Form
    enrollmentId={enrollmentId}
    target_api={target_api}
    contactInformation={[
      {
        email: DATA_PROVIDER_CONTACT_EMAILS.urssaf,
        label: 'Nous contacter',
        subject: 'Contact%20via%20datapass.api.gouv.fr',
      },
    ]}
  >
    <OrganisationSection />
    <DescriptionSection />
    <DonneesSection availableScopes={availableScopes} />
    <CadreJuridiqueSection
      CadreJuridiqueDescription={CadreJuridiqueDescription}
      defaultFondementJuridiqueTitle="articles L.133-11, R133-43 et R133-44 du Code de Sécurité sociale"
      defaultFondementJuridiqueUrl="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033686041/"
    />
    <ÉquipeSection responsableTechniqueNeedsMobilePhone={true} />
    <PiecesJustificativesSection hideHabilitationServiceDomicile />
    <CguSection cguLink="/docs/cgu_api_declaration_cesu_v1.pdf" />
  </Form>
);

ApiDeclarationCesu.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

ApiDeclarationCesu.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default ApiDeclarationCesu;
