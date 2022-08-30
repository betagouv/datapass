import React, { useState } from 'react';
import { createUser } from '../../../services/users';
import TextInput from '../../atoms/inputs/TextInput';
import { RefreshIcon } from '../../atoms/icons/fr-fi-icons';
import { getErrorMessages } from '../../../lib';
import Button from '../../atoms/hyperTexts/Button';
import Alert from '../../atoms/Alert';
import ListHeader from '../../molecules/ListHeader';

export const AddUser = () => {
  const [newUserEmail, setNewUserEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setNewUserEmail(event.target.value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSuccess(false);
    setError(false);
    try {
      if (newUserEmail) {
        await createUser({ email: newUserEmail.trim() });
        setSuccess(true);
        setNewUserEmail('');
      }
    } catch (e) {
      setError(getErrorMessages(e));
    }
  };

  return (
    <div className="page-container">
      <ListHeader title="Ajouter un utilisateur" />
      {success && (
        <Alert type="success" title="Succès">
          L’utilisateur a correctement été ajouté. Vous pouvez rafraichir la
          liste des utilisateurs en cliquant sur l’icone{' '}
          <RefreshIcon size={16} />.
        </Alert>
      )}
      {error && (
        <Alert type="error" title="Erreur">
          {error}
        </Alert>
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
