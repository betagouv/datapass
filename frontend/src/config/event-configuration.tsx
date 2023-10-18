export enum EnrollmentEvent {
  notify = 'notify',
  create = 'create',
  destroy = 'destroy',
  update = 'update',
  submit = 'submit',
  refuse = 'refuse',
  revoke = 'revoke',
  request_changes = 'request_changes',
  reminder_before_archive = 'reminder_before_archive',
  reminder = 'reminder',
  import = 'import',
  archive = 'archive',
  validate = 'validate',
  instruct = 'instruct',
  update_contacts = 'update_contacts',
  copy = 'copy',
}

export enum PromptType {
  comment = 'comment',
  notify = 'notify',
  confirm_deletion = 'confirm_deletion',
  confirm_archive = 'confirm_archive',
  submit_instead = 'submit_instead',
}

export enum RequestType {
  change_state = 'change_state',
  create_or_update = 'create_or_update',
  delete = 'delete',
  create_or_update_then_change_state = 'create_or_update_then_change_state',
}

export type EventConfiguration = {
  displayProps: {
    label: string;
    icon?: string;
    secondary?: boolean;
  };
  prompt?: PromptType;
  request: RequestType;
  redirectToHome?: boolean;
  successMessage?: string;
};

export const eventConfigurations: {
  [key in EnrollmentEvent]?: EventConfiguration;
} = {
  [EnrollmentEvent.notify]: {
    displayProps: {
      label: 'Envoyer',
      icon: 'mail',
      secondary: true,
    },
    prompt: PromptType.notify,
    request: RequestType.change_state,
    successMessage: 'Votre message a été envoyé.',
  },
  [EnrollmentEvent.destroy]: {
    displayProps: {
      label: 'Supprimer l’habilitation',
      icon: 'delete',
      secondary: true,
    },
    prompt: PromptType.confirm_deletion,
    request: RequestType.delete,
    redirectToHome: true,
    successMessage: 'Votre demande d’habilitation a été supprimée.',
  },
  [EnrollmentEvent.update]: {
    displayProps: {
      label: 'Enregistrer les modifications',
      icon: 'save',
      secondary: true,
    },
    prompt: PromptType.submit_instead,
    request: RequestType.create_or_update,
    successMessage: 'Votre demande d’habilitation a été sauvegardée.',
  },
  [EnrollmentEvent.submit]: {
    displayProps: {
      label: 'Soumettre la demande d’habilitation',
      icon: 'checkbox',
    },
    request: RequestType.create_or_update_then_change_state,
    redirectToHome: true,
    successMessage: 'Votre demande d’habilitation a été soumise.',
  },
  [EnrollmentEvent.refuse]: {
    displayProps: {
      label: 'Refuser',
      icon: 'alert',
      secondary: true,
    },
    prompt: PromptType.comment,
    request: RequestType.change_state,
    redirectToHome: true,
  },
  [EnrollmentEvent.revoke]: {
    displayProps: {
      label: 'Révoquer',
      icon: 'alert',
      secondary: true,
    },
    prompt: PromptType.comment,
    request: RequestType.change_state,
    redirectToHome: true,
  },
  [EnrollmentEvent.archive]: {
    displayProps: {
      label: 'Archiver',
      icon: 'archive',
      secondary: true,
    },
    prompt: PromptType.confirm_archive,
    request: RequestType.change_state,
    redirectToHome: true,
    successMessage: 'Cette demande d’habilitation a été archivée.',
  },
  [EnrollmentEvent.request_changes]: {
    displayProps: {
      label: 'Demander une modification',
      icon: 'edit',
      secondary: true,
    },
    prompt: PromptType.comment,
    request: RequestType.change_state,
    redirectToHome: true,
  },
  [EnrollmentEvent.validate]: {
    displayProps: {
      label: 'Valider',
      icon: 'checkbox',
    },
    prompt: PromptType.comment,
    request: RequestType.change_state,
    redirectToHome: true,
  },
};
