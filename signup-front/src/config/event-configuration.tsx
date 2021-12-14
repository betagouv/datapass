export enum EnrollmentEvent {
  notify = 'notify',
  destroy = 'destroy',
  update = 'update',
  submit = 'submit',
  refuse = 'refuse',
  request_changes = 'request_changes',
  validate = 'validate',
}

export type EventConfiguration = {
  displayProps: {
    label: string;
    type?: string;
    icon?: string;
    outline?: boolean;
  };
  changeEnrollmentState?: boolean;
  promptForComment?: boolean;
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
      type: 'secondary',
    },
    changeEnrollmentState: true,
    promptForComment: true,
    redirectToHome: true,
  },
  destroy: {
    displayProps: {
      label: 'Supprimer la demande',
      icon: 'delete',
      type: 'danger',
    },
    delete: true,
    redirectToHome: true,
  },
  update: {
    displayProps: {
      label: 'Enregistrer les modifications',
      icon: 'save',
      type: 'secondary',
    },
    createOrUpdate: true,
  },
  submit: {
    displayProps: {
      label: 'Soumettre la demande',
      icon: 'checkbox',
      type: 'info',
    },
    changeEnrollmentState: true,
    createOrUpdate: true,
    redirectToHome: true,
  },
  refuse: {
    displayProps: {
      label: 'Refuser',
      icon: 'alert',
      type: 'danger',
    },
    changeEnrollmentState: true,
    promptForComment: true,
    redirectToHome: true,
  },
  request_changes: {
    displayProps: {
      label: 'Demander une modification',
      icon: 'edit',
      type: 'secondary',
    },
    changeEnrollmentState: true,
    promptForComment: true,
    redirectToHome: true,
  },
  validate: {
    displayProps: {
      label: 'Valider',
      icon: 'checkbox',
      type: 'info',
    },
    changeEnrollmentState: true,
    promptForComment: true,
    redirectToHome: true,
  },
};
