import React, { useEffect, useState } from 'react';
import { updateUser } from '../../../../services/users';

const RoleCheckboxCell = (props) => {
  const { row, column, updateData } = props;
  const initialValue = row.original.roles.includes(column.id);
  const [value, setValue] = useState(initialValue);
  const onChange = async (e) => {
    const newValue = e.target.checked;
    const newRoles = newValue
      ? [...row?.original.roles, column?.id]
      : row?.original.roles.filter((e) => e !== column?.id);

    try {
      await updateUser({ id: row?.original.id, roles: newRoles });
      setValue(newValue);
      updateData(row?.index, column?.id, newValue);
    } catch (e) {
      setValue(!newValue);
      updateData(row?.index, column?.id, !newValue);
    }
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <input type="checkbox" checked={value} onChange={onChange} />;
};

export default RoleCheckboxCell;
