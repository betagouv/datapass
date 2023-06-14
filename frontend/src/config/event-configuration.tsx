export enum EnrollmentEvent {
  notify = 'notify',
  destroy = 'destroy',
  update = 'update',
  submit = 'submit',
  refuse = 'refuse',
  revoke = 'revoke',
  request_changes = 'request_changes',
  archive = 'archive',
  validate = 'validate',
  instruct = 'instruct',
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
  [key in EnrollmentEvent]: EventConfiguration;
} = {
  notify: {
    displayProps: {
      label: 'Envoyer',
      icon: 'mail',
      secondary: true,
    },
    prompt: PromptType.notify,
    request: RequestType.change_state,
    redirectToHome: true,
    successMessage:
      'Votre message a été envoyé. Vous recevrez une notification dans votre boite mail lorsqu’il sera traité.',
  },
  destroy: {
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
  update: {
    displayProps: {
      label: 'Enregistrer les modifications',
      icon: 'save',
      secondary: true,
    },
    prompt: PromptType.submit_instead,
    request: RequestType.create_or_update,
    successMessage: 'Votre demande d’habilitation a été sauvegardée.',
  },
  submit: {
    displayProps: {
      label: 'Soumettre la demande d’habilitation',
      icon: 'checkbox',
    },
    request: RequestType.create_or_update_then_change_state,
    redirectToHome: true,
    successMessage: 'Votre demande d’habilitation a été soumise.',
  },
  refuse: {
    displayProps: {
      label: 'Refuser',
      icon: 'alert',
      secondary: true,
    },
    prompt: PromptType.comment,
    request: RequestType.change_state,
    redirectToHome: true,
  },
  revoke: {
    displayProps: {
      label: 'Révoquer',
      icon: 'alert',
      secondary: true,
    },
    prompt: PromptType.comment,
    request: RequestType.change_state,
    redirectToHome: true,
  },
  archive: {
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
  request_changes: {
    displayProps: {
      label: 'Demander une modification',
      icon: 'edit',
      secondary: true,
    },
    prompt: PromptType.comment,
    request: RequestType.change_state,
    redirectToHome: true,
  },
  validate: {
    displayProps: {
      label: 'Valider',
      icon: 'checkbox',
    },
    prompt: PromptType.comment,
    request: RequestType.change_state,
    redirectToHome: true,
  },
};
