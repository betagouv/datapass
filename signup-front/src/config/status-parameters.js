export const INSTRUCTOR_STATUS_LABELS = {
  submitted: 'À valider',
  changes_requested: 'Retour',
  validated: 'Validée',
  refused: 'Refusée',
  draft: 'Brouillon',
};

export const USER_STATUS_LABELS = {
  draft: 'Brouillon',
  changes_requested: 'Modifications demandées',
  submitted: 'En cours de validation',
  validated: 'Validée',
  refused: 'Refusée',
};

export const STATUS_TO_BUTTON_TYPE = {
  draft: '',
  submitted: 'info',
  validated: 'success',
  changes_requested: 'warning',
  refused: 'error',
};
