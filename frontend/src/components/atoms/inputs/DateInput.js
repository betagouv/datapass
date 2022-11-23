import { useState } from 'react';
import Label from './Label';
import Datetime from 'react-datetime';
import moment from 'moment';

import './DateInput.css';
import 'react-datetime/css/react-datetime.css';

export const DateInput = ({
  label = '',
  helper = '',
  name = '',
  placeholder = 'Sélectionnez une date',
  value = '',
  disabled = false,
  onChange,
  required = false,
  ...rest
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fr-input-group">
      <Datetime
        open={open}
        value={value}
        timeFormat={false}
        dateFormat="DD/MM/YYYY"
        onChange={(date) => {
          const formattedDate = moment(date).format('DD/MM/YYYY');
          onChange({
            target: {
              name,
              value: formattedDate,
            },
          });
          setOpen(false);
        }}
        renderInput={() => {
          return (
            <>
              <Label label={label} required={required} helper={helper} />
              <button
                className="fr-input"
                onClick={() => setOpen((prevOpen) => !prevOpen)}
                required={required}
                disabled={disabled}
                {...rest}
              >
                {!!value ? value : placeholder}
              </button>
            </>
          );
        }}
      />
    </div>
  );
};

export default DateInput;
