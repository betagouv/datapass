import { useEffect, useRef, useState } from 'react';
import Button from '../../../atoms/hyperTexts/Button';
import TextAreaInput from '../../../atoms/inputs/TextAreaInput';
import ButtonGroup from '../../../molecules/ButtonGroup';
import ExpandableQuote from '../../../molecules/ExpandableQuote';
import useEmailTemplate from './hooks/use-email-template';
import useMostUsedComments from './hooks/use-most-used-comments';

const Prompt = ({
  onAccept,
  onCancel,
  displayProps,
  selectedEvent,
  enrollment,
  alignButtons = 'center',
}) => {
  const { target_api: targetApi, id } = enrollment;

  const [input, setInput] = useState('');
  const [disabled, setDisabled] = useState(false);
  const mostUsedComments = useMostUsedComments(selectedEvent, targetApi);
  const emailTemplate = useEmailTemplate(id, selectedEvent, targetApi);
  const refPanel = useRef(null);

  useEffect(() => {
    if (!input && emailTemplate) {
      setInput(emailTemplate);
    }
  }, [input, emailTemplate]);

  useEffect(() => {
    refPanel.current.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleAccept = () => {
    setDisabled(true);
    onAccept(input.trim());
  };

  const promptLabel = {
    notify: 'Votre message :',
    changes_requested:
      'Précisez au demandeur les modifications à apporter à sa demande d’habilitation :',
    refuse: 'Précisez au demandeur le motif de votre refus :',
    validate: 'Votre message :',
  }[selectedEvent];

  return (
    <div ref={refPanel} className="panel">
      {typeof input !== 'undefined' && (
        <TextAreaInput
          label={promptLabel}
          onChange={handleInputChange}
          name="comment"
          rows="15"
          value={input}
        />
      )}
      {mostUsedComments.length > 0 && (
        <ExpandableQuote
          title="Voir les réponses que vous avez apportées précédemment pour des demandes d’habilitation similaires"
          large
        >
          {mostUsedComments.map((comment) => (
            <div key={comment}>
              <p>-----------</p>
              <p style={{ whiteSpace: 'pre-line' }}>{comment}</p>
            </div>
          ))}
        </ExpandableQuote>
      )}
      <ButtonGroup align={alignButtons}>
        {onCancel && (
          <Button secondary onClick={onCancel} disabled={disabled}>
            Annuler
          </Button>
        )}
        <Button
          icon={displayProps.icon}
          onClick={handleAccept}
          disabled={disabled}
        >
          {displayProps.label}
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default Prompt;
