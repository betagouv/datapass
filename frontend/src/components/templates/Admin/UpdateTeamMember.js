import React, { useState } from 'react';
import { updateTeamMember } from '../../../services/enrollments';
import { getErrorMessages } from '../../../lib';
import TextInput from '../../atoms/inputs/TextInput';
import Button from '../../atoms/hyperTexts/Button';
import Alert from '../../atoms/Alert';
import ListHeader from '../../molecules/ListHeader';

export const UpdateTeamMember = () => {
  const [teamMemberId, setTeamMemberId] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [job, setJob] = useState('');
  const [success, setSuccess] = useState();
  const [error, setError] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setSuccess(false);
      await updateTeamMember({
        teamMemberId,
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        job: job.trim(),
      });
      setTeamMemberId('');
      setNom('');
      setPrenom('');
      setEmail('');
      setPhoneNumber('');
      setJob('');
      setError(null);
      setSuccess(true);
    } catch (e) {
      setError(getErrorMessages(e));
    }
  };

  return (
    <div className="page-container">
      <ListHeader title="Modification d’un membre de l’équipe" />
      {success && (
        <Alert type="success" title="Succès">
          Contact mis à jour et mail envoyé avec succès !
        </Alert>
      )}
      {error && (
        <Alert type="error" title="Erreur">
          {error}
        </Alert>
      )}
      {!success && !error && (
        <Alert>
          Les champs prendront la valeur renseignée par l’utilisateur si
          celui-ci à déjà un compte, sinon ils resteront vides.
        </Alert>
      )}
      {!success && !error && (
        <Alert>
          Les champs non renseignés seront laissés dans leur état d’origine.
        </Alert>
      )}
      <form className="fr-mt-3w" onSubmit={onSubmit}>
        <TextInput
          label="Identifiant du contact"
          onChange={({ target: { value } }) => setTeamMemberId(value)}
          value={teamMemberId}
          required
        />
        <TextInput
          label="Nouveau nom"
          onChange={({ target: { value } }) => setNom(value)}
          value={nom}
        />
        <TextInput
          label="Nouveau prénom"
          onChange={({ target: { value } }) => setPrenom(value)}
          value={prenom}
        />
        <TextInput
          label="Nouveau poste occupé"
          onChange={({ target: { value } }) => setJob(value)}
          value={job}
        />
        <TextInput
          label="Nouvel email"
          onChange={({ target: { value } }) => setEmail(value)}
          value={email}
        />
        <TextInput
          label="Nouveau numéro de téléphone"
          onChange={({ target: { value } }) => setPhoneNumber(value)}
          value={phoneNumber}
        />
        <Button submit>
          Mettre à jour le contact et lui envoyer un mail (s’il est
          correspondant RGPD)
        </Button>
      </form>
    </div>
  );
};

export default UpdateTeamMember;
