import { useState } from 'react';
import { useOpinions } from '.';
import Button from '../../atoms/hyperTexts/Button';
import TextAreaInput from '../../atoms/inputs/TextAreaInput';
import AnswerButton from '../../molecules/AnswerButton';

const ReporterOpinionForm: React.FC<{
  setIsAskingOpinion: Function;
  isAskingOpinion: boolean;
}> = ({ setIsAskingOpinion, isAskingOpinion }) => {
  const { handleCreateOpinionComment } = useOpinions();
  const [content, setContent] = useState('');

  const disabledSubmit = content.length === 0;

  const getBody = () => {
    if (isAskingOpinion) {
      return (
        <>
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
                handleCreateOpinionComment({ content });
              }}
              icon="send-plane"
              iconFill
              disabled={disabledSubmit}
            >
              Envoyer
            </Button>
          </div>
        </>
      );
    } else {
      return (
        <AnswerButton onClick={() => setIsAskingOpinion(true)}>
          Répondre
        </AnswerButton>
      );
    }
  };

  return <div className="reporter-opinion-form">{getBody()}</div>;
};

export default ReporterOpinionForm;
