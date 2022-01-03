import React, { useState } from 'react';
import { updateTeamMember } from '../../../services/enrollments';
import { getErrorMessages } from '../../../lib';
import TextInput from '../../atoms/inputs/TextInput';
import Button from '../../atoms/Button';
import Alert from '../../atoms/Alert';

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
      <div className="fr-text--lead">Modification d’un membre de l’équipe</div>
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
      <form onSubmit={onSubmit}>
        <TextInput
          label="Identifiant du contact"
          onChange={({ target: { value } }) => setTeamMemberId(value)}
          value={teamMemberId}
          required
        />
        <TextInput
          label="Nouveau nom"
          helper="vide = pas de modification"
          onChange={({ target: { value } }) => setNom(value)}
          value={nom}
        />
        <TextInput
          label="Nouveau prénom"
          helper="vide = pas de modification"
          onChange={({ target: { value } }) => setPrenom(value)}
          value={prenom}
        />
        <TextInput
          label="Nouveau poste occupé"
          helper="vide = pas de modification"
          onChange={({ target: { value } }) => setJob(value)}
          value={job}
        />
        <TextInput
          label="Nouvel email"
          helper="vide = pas de modification"
          onChange={({ target: { value } }) => setEmail(value)}
          value={email}
        />
        <TextInput
          label="Nouveau numéro de téléphone"
          helper="vide = pas de modification"
          onChange={({ target: { value } }) => setPhoneNumber(value)}
          value={phoneNumber}
        />
        <Button type="submit">
          Mettre à jour le contact et lui envoyer un mail (s’il est
          correspondant RGPD)
        </Button>
      </form>
    </div>
  );
};

export default UpdateTeamMember;
