import React, { useEffect, useState } from 'react';
import useMostUsedComments from './hooks/use-most-used-comments';
import useEmailTemplate from './hooks/use-email-template';
import TextAreaInput from '../../../atoms/inputs/TextAreaInput';
import ExpandableQuote from '../../../atoms/inputs/ExpandableQuote';
import Button from '../../../atoms/Button';
import ButtonGroup from '../../../molecules/ButtonGroup';

const Prompt = ({
  onAccept,
  onCancel,
  displayProps,
  selectedAction,
  enrollment,
}) => {
  const { target_api: targetApi, id } = enrollment;

  const [input, setInput] = useState('');
  const templates = useMostUsedComments(selectedAction, targetApi);
  const { plain_text_content } = useEmailTemplate(id, selectedAction);

  useEffect(() => {
    if (!input) {
      setInput(plain_text_content);
    }
  }, [input, plain_text_content]);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleAccept = () => {
    onAccept(input.trim());
  };

  const promptLabel = {
    notify: 'Votre message :',
    review_application:
      'Précisez au demandeur les modifications à apporter à sa demande :',
    refuse_application: 'Précisez au demandeur le motif de votre refus :',
    validate_application: 'Votre message :',
  }[selectedAction];

  return (
    <div className="panel">
      {typeof input !== 'undefined' && (
        <TextAreaInput
          label={promptLabel}
          onChange={handleInputChange}
          name="comment"
          rows="15"
          value={input}
        />
      )}
      {templates.length > 0 && (
        <ExpandableQuote
          title="Voir les réponses que vous avez apportés précédemment pour des demandes similaires"
          large
        >
          {templates.map((template) => (
            <div key={template}>
              <p>-----------</p>
              <p style={{ whiteSpace: 'pre-line' }}>{template}</p>
            </div>
          ))}
        </ExpandableQuote>
      )}
      <ButtonGroup alignRight>
        <Button outline onClick={onCancel}>
          Annuler
        </Button>
        <Button
          type={displayProps.type}
          icon={displayProps.icon}
          onClick={handleAccept}
        >
          {displayProps.label}
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default Prompt;
