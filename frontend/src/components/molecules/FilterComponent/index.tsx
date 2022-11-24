import MultiSelect from '../../molecules/MultiSelect';
import Input from '../../atoms/inputs/Input';
import { FilterMeta } from '../../organisms/Table';

const FilterComponent = ({
  value,
  onChange,
  filter = 'text',
  options = [],
  placeholder = '',
}: {
  value: any;
  onChange: (any: any) => void;
  filter: FilterMeta;
  options?: any[];
  placeholder: string | undefined;
}) => {
  if (filter === 'select') {
    return (
      <MultiSelect
        options={options}
        values={(value ?? []) as Array<any>}
        onChange={onChange}
      />
    );
  } else if (filter === 'text') {
    const inputOnChange: React.ChangeEventHandler<HTMLInputElement> = (
      event
    ) => {
      onChange(event.target.value);
    };

    return (
      <Input
        type="text"
        value={(value ?? '') as string}
        onChange={inputOnChange}
        icon="filter"
        placeholder={placeholder}
      />
    );
  } else {
    return filter({ value, onChange });
  }
};

export default FilterComponent;
