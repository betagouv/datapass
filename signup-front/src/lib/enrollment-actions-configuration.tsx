export enum EnrollmentAction {
  notify = 'notify',
  destroy = 'destroy',
  update = 'update',
  send_application = 'send_application',
  refuse_application = 'refuse_application',
  review_application = 'review_application',
  validate_application = 'validate_application',
}

export type ActionConfiguration = {
  displayProps: {
    label: string;
    type?: string;
    icon?: string;
    outline?: boolean;
  };
  needsToComputeNextEnrollmentState?: boolean;
  promptForComment?: boolean;
  createOrUpdate?: boolean;
  delete?: boolean;
  redirectToHome?: boolean;
};

export const userInteractionsConfiguration: {
  [key in EnrollmentAction]: ActionConfiguration;
} = {
  notify: {
    displayProps: {
      label: 'Envoyer un message',
      icon: 'mail',
      type: 'secondary',
    },
    needsToComputeNextEnrollmentState: true,
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
  send_application: {
    displayProps: {
      label: 'Soumettre la demande',
      icon: 'checkbox',
      type: 'info',
    },
    needsToComputeNextEnrollmentState: true,
    createOrUpdate: true,
    redirectToHome: true,
  },
  refuse_application: {
    displayProps: {
      label: 'Refuser',
      icon: 'alert',
      type: 'danger',
    },
    needsToComputeNextEnrollmentState: true,
    promptForComment: true,
    redirectToHome: true,
  },
  review_application: {
    displayProps: {
      label: 'Demander une modification',
      icon: 'edit',
      type: 'secondary',
    },
    needsToComputeNextEnrollmentState: true,
    promptForComment: true,
    redirectToHome: true,
  },
  validate_application: {
    displayProps: {
      label: 'Valider',
      icon: 'checkbox',
      type: 'info',
    },
    needsToComputeNextEnrollmentState: true,
    promptForComment: true,
    redirectToHome: true,
  },
};
