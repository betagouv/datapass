import { ChangeEventHandler, useState } from 'react';
import TextInputWithSuggestions from '../../molecules/TextInputWithSuggestions';

type TeamMembersSearchProps = {
  onReporterIdChange: Function;
  reporterId: string | null;
};

export const TeamMembersSearch: React.FC<TeamMembersSearchProps> = ({
  onReporterIdChange,
  reporterId,
}) => {
  const [inputValue, setInputValue] = useState('');

  const reporters = [
    { id: '991330301', name: 'Sophie Marceau' },
    { id: '480187396', name: 'Johnny Hallyday' },
    { id: '417269330', name: 'Francis Cabrel' },
    { id: '227792459', name: 'Georges Brassens' },
  ];
  const reporterOptions = reporters.map(({ id, name }) => ({
    id: id,
    label: name,
  }));

  const onValueChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { value: valueLabel },
  }) => {
    if (valueLabel.length !== inputValue.length && reporterId) {
      setInputValue('');
      onReporterIdChange(null);
    } else {
      setInputValue(valueLabel);
    }
  };

  return (
    <TextInputWithSuggestions
      label="Vous souhaitez contacter"
      options={reporterOptions}
      placeholder="Vous pouvez saisir un nom, un poste, une organisation"
      value={inputValue}
      onChange={onValueChange}
      onOptionChange={({ id }: { id: string }) => onReporterIdChange(id)}
    />
  );
};

export default TeamMembersSearch;
