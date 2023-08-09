import {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import Button from '../../../atoms/hyperTexts/Button';
import TextAreaInput from '../../../atoms/inputs/TextAreaInput';
import ButtonGroup from '../../../molecules/ButtonGroup';
import ExpandableQuote from '../../../molecules/ExpandableQuote';
import useEmailTemplate from './hooks/use-email-template';
import useMostUsedComments from './hooks/use-most-used-comments';
import { Enrollment } from '../../InstructorEnrollmentList';
import {
  EnrollmentEvent,
  EventConfiguration,
} from '../../../../config/event-configuration';

type PromptProps = {
  inputValue: string;
  setInputValue: Function;
  onAccept: Function;
  onCancel?: MouseEventHandler<HTMLButtonElement>;
  displayProps: EventConfiguration['displayProps'];
  selectedEvent: EnrollmentEvent;
  enrollment: Enrollment;
  hideMostUsedComments?: boolean;
  alignButtons?: string;
};

const Prompt: React.FC<PromptProps> = ({
  inputValue,
  setInputValue,
  onAccept,
  onCancel,
  displayProps,
  selectedEvent,
  enrollment,
  hideMostUsedComments = false,
  alignButtons = 'center',
}) => {
  const { target_api: targetApi, id } = enrollment;

  const [disabled, setDisabled] = useState(false);
  const mostUsedComments = useMostUsedComments(selectedEvent, targetApi);
  const emailTemplate = useEmailTemplate(id, selectedEvent, targetApi);
  const refPanel = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (refPanel.current) {
      refPanel.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (!inputValue && emailTemplate) {
      setInputValue(emailTemplate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailTemplate]);

  const handleInputChange: ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    setInputValue(event.target.value);
  };

  const handleAccept = () => {
    setDisabled(true);
    onAccept(inputValue.trim());
  };

  type PromptLabels = {
    [key in EnrollmentEvent]?: string;
  };

  const promptLabel: PromptLabels = {
    [EnrollmentEvent.notify]: 'Votre message :',
    [EnrollmentEvent.request_changes]:
      'Précisez au demandeur les modifications à apporter à sa demande d’habilitation :',
    [EnrollmentEvent.refuse]: 'Précisez au demandeur le motif de votre refus :',
    [EnrollmentEvent.validate]: 'Votre message :',
  };

  const label = promptLabel[selectedEvent] as string;

  return (
    <div ref={refPanel} className="panel">
      {typeof inputValue !== 'undefined' && (
        <TextAreaInput
          label={label}
          onChange={handleInputChange}
          name="comment"
          rows={15}
          value={inputValue}
        />
      )}
      {!hideMostUsedComments && mostUsedComments.length > 0 && (
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
        <Button
          icon={displayProps.icon}
          onClick={handleAccept}
          disabled={disabled}
        >
          {displayProps.label}
        </Button>
        {onCancel && (
          <Button tertiaryNoOutline onClick={onCancel} disabled={disabled}>
            Annuler
          </Button>
        )}
      </ButtonGroup>
    </div>
  );
};

export default Prompt;
