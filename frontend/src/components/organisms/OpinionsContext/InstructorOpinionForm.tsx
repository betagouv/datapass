import { useState } from 'react';
import { useOpinions } from '.';
import ReportersSearch from '../ReportersSearch';
import TextAreaInput from '../../atoms/inputs/TextAreaInput';
import Button from '../../atoms/hyperTexts/Button';

const InstructorOpinionForm: React.FC<{
  setIsAskingOpinion: Function;
  targetApi: string;
}> = ({ setIsAskingOpinion, targetApi }) => {
  const { handleCreateOpinion } = useOpinions();
  const [content, setContent] = useState('');
  const [reporterId, setReporterId] = useState<null | string>(null);

  const disabledSubmit = content.length === 0 || !reporterId;

  return (
    <div className="instructor-opinion-form">
      <ReportersSearch
        targetApi={targetApi}
        onReporterIdChange={setReporterId}
        reporterId={reporterId}
      />
      <TextAreaInput
        onChange={(event) => setContent(event.target.value)}
        rows={5}
        value={content}
        label="Votre message"
        placeholder="Tapez ici votre message"
      />
      <div className="opinion-form-buttons">
        <Button onClick={() => setIsAskingOpinion(false)} secondary>
          Annuler
        </Button>
        <Button
          onClick={() => {
            handleCreateOpinion({ content, reporterId });
          }}
          icon="send-plane"
          iconFill
          disabled={disabledSubmit}
        >
          Envoyer
        </Button>
      </div>
    </div>
  );
};

export default InstructorOpinionForm;
