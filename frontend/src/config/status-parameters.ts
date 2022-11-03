import { BadgeType } from '../components/atoms/hyperTexts/Badge';

export enum EnrollmentStatus {
  draft = 'draft',
  submitted = 'submitted',
  validated = 'validated',
  changes_requested = 'changes_requested',
  refused = 'refused',
  revoked = 'revoked',
}

export const INSTRUCTOR_STATUS_LABELS: {
  [key in EnrollmentStatus]: string;
} = {
  draft: 'Brouillon',
  submitted: 'À valider',
  validated: 'Validée',
  changes_requested: 'Retour',
  refused: 'Refusée',
  revoked: 'Révoquée',
};

export const USER_STATUS_LABELS: {
  [key in EnrollmentStatus]: string;
} = {
  draft: 'Brouillon',
  submitted: 'En cours de validation',
  validated: 'Validée',
  changes_requested: 'Modifications demandées',
  refused: 'Refusée',
  revoked: 'Révoquée',
};

export const STATUS_TO_BADGE_TYPE: {
  [key in EnrollmentStatus]: BadgeType | null;
} = {
  draft: null,
  submitted: BadgeType.info,
  validated: BadgeType.success,
  changes_requested: BadgeType.warning,
  refused: BadgeType.error,
  revoked: BadgeType.error,
};
