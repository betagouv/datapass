import { ChangeEventHandler, useEffect, useState } from 'react';
import TextInputWithSuggestions from '../../molecules/TextInputWithSuggestions';
import { TeamMember } from '../../../config';
import { getAvailableReporters } from '../../../services/opinions';

type ReportersSearchProps = {
  onReporterIdChange: Function;
  reporterId: string | null;
  targetApi: string;
};

export const ReportersSearch: React.FC<ReportersSearchProps> = ({
  onReporterIdChange,
  reporterId,
  targetApi,
}) => {
  const [reporters, setReporters] = useState<TeamMember[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    getAvailableReporters(targetApi).then((reporters) =>
      setReporters(reporters)
    );
  }, [targetApi]);

  const reporterOptions = reporters.map(({ id, given_name, family_name }) => ({
    id: id,
    label: given_name + ' ' + family_name,
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

export default ReportersSearch;
