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

export const enrollmentListStyle = {
  table: {
    border: 'none',
  },
  thead: {
    boxShadow: 'none',
  },
  filterThead: {
    padding: '0',
  },
  header: {
    padding: '1em',
    backgroundColor: '#ebeff3',
    fontWeight: 'bold',
    borderRight: 'none',
    outline: '0',
  },
  updateAtHeader: {
    padding: '0.7em 0',
  },
  footer: {},
  cell: {
    cursor: 'pointer',
    padding: '1em 0.5em',
    borderRight: 'none',
    overflow: 'hidden',
  },
  centeredCell: {
    textAlign: 'center',
  },
  pagination: {
    boxShadow: 'none',
    borderTop: '1px solid rgba(0,0,0,0.1)',
  },
};
