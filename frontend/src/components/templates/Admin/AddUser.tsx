import { ChangeEvent, FormEvent, useState } from 'react';
import { createUser } from '../../../services/users';
import TextInput from '../../atoms/inputs/TextInput';
import { RefreshIcon } from '../../atoms/icons/fr-fi-icons';
import { getErrorMessages } from '../../../lib';
import Button from '../../atoms/hyperTexts/Button';
import Alert, { AlertType } from '../../atoms/Alert';
import ListHeader from '../../molecules/ListHeader';

export const AddUser = () => {
  const [newUserEmail, setNewUserEmail] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewUserEmail(event.target.value);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(false);
    setError(null);
    try {
      if (newUserEmail) {
        await createUser({ email: newUserEmail.trim() });
        setSuccess(true);
        setNewUserEmail('');
      }
    } catch (e: any) {
      setError(getErrorMessages(e));
    }
  };

  return (
    <div className="page-container">
      <ListHeader title="Ajouter un utilisateur" />
      {success && (
        <div className="fr-mb-2w">
          <Alert type={AlertType.success} title="Succès">
            L’utilisateur a correctement été ajouté. Vous pouvez rafraichir la
            liste des utilisateurs en cliquant sur l’icone <RefreshIcon />.
          </Alert>
        </div>
      )}
      {error && (
        <div className="fr-mb-2w">
          <Alert type={AlertType.error} title="Erreur">
            {error}
          </Alert>
        </div>
      )}
      <form onSubmit={onSubmit}>
        <TextInput
          label="Adresse email du nouvel utilisateur à ajouter"
          onChange={handleChange}
          value={newUserEmail}
          required
        />
        <Button submit>Ajouter l’utilisateur</Button>
      </form>
    </div>
  );
};

export default AddUser;
