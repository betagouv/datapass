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
    secondary?: boolean;
  };
  changeEnrollmentState?: boolean;
  promptForComment?: boolean;
  promptForConfirmation?: boolean;
  promptForSubmission?: boolean;
  createOrUpdate?: boolean;
  delete?: boolean;
  redirectToHome?: boolean;
  successMessage?: string;
};

export const eventConfigurations: {
  [key in EnrollmentEvent]: EventConfiguration;
} = {
  notify: {
    displayProps: {
      label: 'Envoyer un message',
      icon: 'mail',
      secondary: true,
    },
    changeEnrollmentState: true,
    promptForComment: true,
    redirectToHome: true,
    successMessage:
      'Vous allez recevoir une notification dans votre boite mail au moment ou il sera traité.',
  },
  destroy: {
    displayProps: {
      label: 'Supprimer l’habilitation',
      icon: 'delete',
      secondary: true,
    },
    delete: true,
    redirectToHome: true,
    promptForConfirmation: true,
  },
  update: {
    displayProps: {
      label: 'Enregistrer les modifications',
      icon: 'save',
      secondary: true,
    },
    promptForSubmission: true,
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
      secondary: true,
    },
    changeEnrollmentState: true,
    promptForComment: true,
    redirectToHome: true,
  },
  revoke: {
    displayProps: {
      label: 'Révoquer',
      icon: 'alert',
      secondary: true,
    },
    changeEnrollmentState: true,
    promptForComment: true,
    redirectToHome: true,
  },
  request_changes: {
    displayProps: {
      label: 'Demander une modification',
      icon: 'edit',
      secondary: true,
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
