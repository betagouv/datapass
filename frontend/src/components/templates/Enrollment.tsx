import React, { FunctionComponent } from 'react';
import Form from '../../components/templates/Form';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import DemarcheSection from '../../components/organisms/form-sections/DemarcheSection';
import DescriptionSection from '../../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../../components/organisms/form-sections/DonneesSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import ÉquipeSection from '../../components/organisms/form-sections/ÉquipeSection';
import { getDefaultDocumentationUrl } from '../organisms/Nav';
import { EnrollmentConfiguration } from '../../config/data-provider-parameters';
import { Remark } from 'react-remark';
import Link from '../atoms/hyperTexts/Link';

// TODO move these 2 type definitions to frontend/src/components/organisms/form-sections/DonneesSection/Scopes.js
export enum WarningType {
  rgpd = 'rgpd',
  fc_incomplete = 'fc_incomplete',
  apientreprise_sensitive = 'apientreprise_sensitive',
}

export type Scopes = {
  value: string;
  label: string;
  groupTitle?: string;
  helper?: string;
  required?: boolean;
  triggerWarning?: boolean;
  warningType?: WarningType;
  link?: string;
};

type Props = {
  target_api: string;
  email: string;
  configuration: EnrollmentConfiguration;
};

const Enrollment: FunctionComponent<Props> = ({
  target_api,
  email,
  configuration: {
    scopes,
    editorList,
    demarches,
    cguLink,
    cadreJuridiqueDescription,
    donneesDescription,
  },
}) => {
  const rehypeReactOptions = {
    components: {
      a: (props: any) => <Link inline {...props} />,
    },
  };
  const DonneesDescription = () => (
    <Remark rehypeReactOptions={rehypeReactOptions}>
      {donneesDescription}
    </Remark>
  );
  const CadreJuridiqueDescription = () => (
    <Remark rehypeReactOptions={rehypeReactOptions}>
      {cadreJuridiqueDescription}
    </Remark>
  );

  return (
    <Form
      target_api={target_api}
      /* @ts-ignore */
      demarches={demarches}
      contactEmail={email}
      documentationUrl={getDefaultDocumentationUrl(target_api)}
    >
      <OrganisationSection editorList={editorList} />
      {/* @ts-ignore */}
      <DemarcheSection availableScopes={scopes} />
      <DescriptionSection />
      {/* @ts-ignore */}
      <DonneesSection
        availableScopes={scopes}
        DonneesDescription={DonneesDescription}
      />
      {/* @ts-ignore */}
      <CadreJuridiqueSection
        CadreJuridiqueDescription={CadreJuridiqueDescription}
      />
      <ÉquipeSection />
      <CguSection cguLink={cguLink} />
    </Form>
  );
};

export default Enrollment;
