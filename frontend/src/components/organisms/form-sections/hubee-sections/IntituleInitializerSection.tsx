import { useContext, useEffect } from 'react';
import { FormContext } from '../../../templates/Form';
import { isEmpty } from 'lodash';

const IntituleInitializerSection = ({ value }: { value: string }) => {
  const {
    isUserEnrollmentLoading,
    disabled,
    onChange,
    enrollment: { intitule },
  } = useContext(FormContext)!;
  useEffect(() => {
    if (!isUserEnrollmentLoading && !disabled && isEmpty(intitule)) {
      onChange({
        target: {
          name: 'intitule',
          value: value,
        },
      });
    }
  }, [isUserEnrollmentLoading, disabled, intitule, onChange, value]);

  return null;
};

export default IntituleInitializerSection;
