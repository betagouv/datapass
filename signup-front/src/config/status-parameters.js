export const ADMIN_STATUS_LABELS = {
  sent: 'À valider',
  modification_pending: 'Retour',
  validated: 'Validée',
  refused: 'Refusée',
  pending: 'Brouillon',
};

export const USER_STATUS_LABELS = {
  pending: 'Brouillon',
  modification_pending: 'Modifications demandées',
  sent: 'En cours de validation',
  validated: 'Validée',
  refused: 'Refusée',
};

export const STATUS_TO_BUTTON_TYPE = {
  pending: '',
  sent: 'info',
  validated: 'success',
  modification_pending: 'warning',
  refused: 'danger',
};
