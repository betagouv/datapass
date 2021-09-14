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
  },
  destroy: {
    displayProps: {
      label: 'Supprimer la demande',
      icon: 'delete',
      type: 'danger',
    },
  },
  update: {
    displayProps: {
      label: 'Sauvegarder le brouillon',
      icon: 'save',
      type: 'secondary',
    },
  },
  send_application: {
    displayProps: {
      label: 'Soumettre la demande',
      icon: 'checkbox',
      type: 'info',
    },
    needsToComputeNextEnrollmentState: true,
  },
  refuse_application: {
    displayProps: {
      label: 'Refuser',
      icon: 'alert',
      type: 'danger',
    },
    needsToComputeNextEnrollmentState: true,
    promptForComment: true,
  },
  review_application: {
    displayProps: {
      label: 'Demander une modification',
      icon: 'edit',
      type: 'secondary',
    },
    needsToComputeNextEnrollmentState: true,
    promptForComment: true,
  },
  validate_application: {
    displayProps: {
      label: 'Valider',
      icon: 'checkbox',
      type: 'info',
    },
    needsToComputeNextEnrollmentState: true,
    promptForComment: true,
  },
};
