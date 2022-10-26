import MultiSelect from '../../molecules/MultiSelect';
import Input from '../../atoms/inputs/Input';

const FilterComponent = ({
  value,
  onChange,
  type,
  options = [],
  placeholder = '',
}: {
  value: any;
  onChange: (any: any) => void;
  type: 'text' | 'select' | undefined;
  options?: any[];
  placeholder: string | undefined;
}) => {
  if (type === 'select') {
    return (
      <MultiSelect
        options={options}
        values={(value ?? []) as Array<any>}
        onChange={onChange}
      />
    );
  } else {
    return (
      <Input
        type="text"
        value={(value ?? '') as string}
        onChange={(e: React.SyntheticEvent) => {
          const target = e.target as HTMLInputElement;
          onChange(target.value);
        }}
        icon="filter"
        placeholder={placeholder}
      />
    );
  }
};

export default FilterComponent;
