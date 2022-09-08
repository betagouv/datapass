export enum EnrollmentEvent {
  notify = 'notify',
  destroy = 'destroy',
  update = 'update',
  submit = 'submit',
  refuse = 'refuse',
  revoke = 'revoke',
  request_changes = 'request_changes',
  validate = 'validate',
}

export type EventConfiguration = {
  displayProps: {
    label: string;
    icon?: string;
    outline?: boolean;
  };
  changeEnrollmentState?: boolean;
  promptForComment?: boolean;
  promptForConfirmation?: boolean;
  createOrUpdate?: boolean;
  delete?: boolean;
  redirectToHome?: boolean;
};

export const eventConfigurations: {
  [key in EnrollmentEvent]: EventConfiguration;
} = {
  notify: {
    displayProps: {
      label: 'Envoyer un message',
      icon: 'mail',
      outline: true,
    },
    changeEnrollmentState: true,
    promptForComment: true,
    redirectToHome: true,
  },
  destroy: {
    displayProps: {
      label: 'Supprimer l’habilitation',
      icon: 'delete',
      outline: true,
    },
    delete: true,
    redirectToHome: true,
    promptForConfirmation: true,
  },
  update: {
    displayProps: {
      label: 'Enregistrer les modifications',
      icon: 'save',
      outline: true,
    },
    createOrUpdate: true,
  },
  submit: {
    displayProps: {
      label: 'Soumettre la demande d’habilitation',
      icon: 'checkbox',
    },
    changeEnrollmentState: true,
    createOrUpdate: true,
    redirectToHome: true,
  },
  refuse: {
    displayProps: {
      label: 'Refuser',
      icon: 'alert',
      outline: true,
    },
    changeEnrollmentState: true,
    promptForComment: true,
    redirectToHome: true,
  },
  revoke: {
    displayProps: {
      label: 'Révoquer',
      icon: 'alert',
      outline: true,
    },
    changeEnrollmentState: true,
    promptForComment: true,
    redirectToHome: true,
  },
  request_changes: {
    displayProps: {
      label: 'Demander une modification',
      icon: 'edit',
      outline: true,
    },
    changeEnrollmentState: true,
    promptForComment: true,
    redirectToHome: true,
  },
  validate: {
    displayProps: {
      label: 'Valider',
      icon: 'checkbox',
    },
    changeEnrollmentState: true,
    promptForComment: true,
    redirectToHome: true,
  },
};
