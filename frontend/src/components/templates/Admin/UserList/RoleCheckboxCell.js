import { updateUser } from '../../../../services/users';
import { EditIcon, EyeIcon, MailIcon } from '../../../atoms/icons/fr-fi-icons';
import './RoleCheckboxCell.css';

const RoleCheckboxCell = (props) => {
  const { row, column, updateData } = props;

  const onChange = async ({ isChecked, role }) => {
    const newRoles = isChecked
      ? [...row?.original.roles, role]
      : row?.original.roles.filter((e) => e !== role);

    try {
      await updateUser({ id: row?.original.id, roles: newRoles });
      updateData(row?.index, role, isChecked);
    } catch (e) {
      updateData(row?.index, role, !isChecked);
    }
  };

  return (
    <div className="role-checkbox-cell">
      {[
        { roleId: 'instructor', label: 'Instructeur', Icon: EditIcon },
        { roleId: 'reporter', label: 'Rapporteur', Icon: EyeIcon },
        { roleId: 'subscriber', label: 'Abonné', Icon: MailIcon },
      ].map(({ roleId, label, Icon }) => {
        const role = `${column.id}:${roleId}`;
        const isChecked = row.original.roles.includes(role);
        return (
          <button
            data-tooltip={label}
            key={roleId}
            onClick={() => onChange({ isChecked: !isChecked, role })}
          >
            <Icon
              color={
                isChecked
                  ? 'var(--text-action-high-blue-france)'
                  : 'var(--datapass-light-grey)'
              }
            />
          </button>
        );
      })}
    </div>
  );
};

export default RoleCheckboxCell;
