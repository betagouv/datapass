export enum EnrollmentStatus {
  draft = 'draft',
  submitted = 'submitted',
  validated = 'validated',
  changes_requested = 'changes_requested',
  refused = 'refused',
}

export const INSTRUCTOR_STATUS_LABELS: {
  [key in EnrollmentStatus]: string;
} = {
  draft: 'Brouillon',
  submitted: 'À valider',
  validated: 'Validée',
  changes_requested: 'Retour',
  refused: 'Refusée',
};

export const USER_STATUS_LABELS: {
  [key in EnrollmentStatus]: string;
} = {
  draft: 'Brouillon',
  submitted: 'En cours de validation',
  validated: 'Validée',
  changes_requested: 'Modifications demandées',
  refused: 'Refusée',
};

export const STATUS_TO_BUTTON_TYPE: {
  [key in EnrollmentStatus]: string;
} = {
  draft: '',
  submitted: 'info',
  validated: 'success',
  changes_requested: 'warning',
  refused: 'error',
};
