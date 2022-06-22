import { isEmpty } from 'lodash';
import { useContext } from 'react';
import { CardContainer } from '../../../molecules/Card';
import { FormContext } from '../../../templates/Form';
import { ScrollablePanel } from '../../Scrollable';
import OrganisationCard from './OrganisationCard';
import PersonalInformationCard from './PersonalInformationCard';
import TechnicalTeamCard from './TechnicalTeamCard';

const SECTION_LABEL = 'L’organisation';
const SECTION_ID = encodeURIComponent(SECTION_LABEL);

const OrganisationSection = ({ editorList = [] }) => {
  useContext(FormContext);

  return (
    <ScrollablePanel scrollableId={SECTION_ID}>
      <h2>L’organisation</h2>
      <CardContainer>
        <PersonalInformationCard />
        <OrganisationCard />
        {!isEmpty(editorList) && <TechnicalTeamCard editorList={editorList} />}
      </CardContainer>
    </ScrollablePanel>
  );
};

OrganisationSection.sectionLabel = SECTION_LABEL;

export default OrganisationSection;
