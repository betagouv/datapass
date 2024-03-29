import React, { FunctionComponent } from 'react';
import Form from '../../components/templates/Form';
import OrganisationSection from '../../components/organisms/form-sections/OrganisationSection';
import DemarcheSection from '../../components/organisms/form-sections/DemarcheSection';
import DescriptionSection from '../../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../organisms/form-sections/DonneesSection';
import CadreJuridiqueSection from '../../components/organisms/form-sections/CadreJuridiqueSection';
import CguSection from '../../components/organisms/form-sections/CguSection';
import ÉquipeSection from '../../components/organisms/form-sections/ÉquipeSection';
import { getDefaultDocumentationUrl } from '../organisms/Nav';
import { FullDataProviderConfiguration } from '../../config/data-provider-configurations';
import { Remark } from 'react-remark';
import Link from '../atoms/hyperTexts/Link';

type Props = {
  target_api: string;
  configuration: FullDataProviderConfiguration;
};

const Enrollment: FunctionComponent<Props> = ({
  target_api,
  configuration: {
    email,
    scopesConfiguration,
    defaultFondementJuridiqueTitle,
    defaultFondementJuridiqueUrl,
    groups,
    editeurs,
    demarches,
    cguLink,
    donneesDescription,
    cadreJuridiqueDescription,
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
      demarches={demarches}
      contactEmail={email as string}
      documentationUrl={getDefaultDocumentationUrl(target_api)}
    >
      <OrganisationSection editorList={editeurs} />
      <DemarcheSection scopesConfiguration={scopesConfiguration} />
      <DescriptionSection />
      <DonneesSection
        scopesConfiguration={scopesConfiguration}
        groups={groups}
        DonneesDescription={DonneesDescription}
      />
      <CadreJuridiqueSection
        defaultFondementJuridiqueTitle={defaultFondementJuridiqueTitle}
        defaultFondementJuridiqueUrl={defaultFondementJuridiqueUrl}
        CadreJuridiqueDescription={CadreJuridiqueDescription}
      />
      <ÉquipeSection />
      <CguSection cguLink={cguLink} />
    </Form>
  );
};

export default Enrollment;
