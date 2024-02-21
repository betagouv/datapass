import { EnrollmentEvent } from './event-configuration';
import { EnrollmentStatus } from './status-parameters';

export type Document = {
  id: number;
  created_at: string;
  updated_at: string;
  attachment: {
    url: string;
  };
  type: string;
  filename: string;
};

export type Demandeur = {
  created_at: string;
  email: string;
  enrollment_id: number;
  family_name: string;
  given_name: string;
  id: number;
  job: string;
  phone_number: string;
  updated_at: string;
  user_id: 227792459;
};

export type User = {
  family_name?: string;
  given_name?: string;
  id: number;
  email?: string;
  created_at?: string;
  updated_at?: string;
  roles?: string[];
  uid?: string;
  job?: string;
  phone_number?: string;
  email_verified?: boolean;
  organizations?: [
    {
      id: number;
      siret: string;
      is_external: boolean;
      label?: string;
    }
  ];
};

export type Demarche = {
  label: string;
  about?: string;
  state: {
    intitule?: string;
    description?: string;
    fondement_juridique_title?: string;
    fondement_juridique_url?: string;
    data_retention_period?: string;
    data_recipients?: string;
    scopes: { [key: string]: boolean };
    [key: string]: any;
  };
  team_members?: {
    [key in TeamMemberType]: TeamMember;
  };
};

export type Demarches = Record<string, Demarche>;

export type Event = {
  comment: string;
  created_at: string;
  diff?: any;
  id: number;
  name: EnrollmentEvent;
  processed_at?: string;
  updated_at: string;
  user: User;
  entity_id: number;
  entity_type: string;
};

export enum TeamMemberType {
  contact_metier = 'contact_metier',
  delegue_protection_donnees = 'delegue_protection_donnees',
  demandeur = 'demandeur',
  responsable_metier = 'responsable_metier',
  responsable_technique = 'responsable_technique',
  responsable_traitement = 'responsable_traitement',
}

export type TeamMember = {
  email?: string | null;
  family_name?: string;
  given_name?: string;
  id: number;
  job?: string;
  phone_number?: string;
  type?: TeamMemberType;
  uid?: string;
  tmp_id?: string;
};

export type Contact = {
  email?: string;
  heading?: string;
  id: string;
  nom?: string;
  phone_number?: string;
};

export type Enrollment = {
  updated_at: string;
  created_at: string;
  notify_events_from_demandeurs_count?: number;
  unprocessed_notify_events_from_demandeurs_count?: number;
  id: number;
  intitule?: string;
  siret?: string;
  consulted_by_instructor?: boolean;
  requested_changes_have_been_done?: boolean;
  nom_raison_sociale?: string | null;
  demandeurs?: Demandeur[];
  target_api: string;
  status: EnrollmentStatus;
  linked_franceconnect_enrollment_id?: number | null;
  events?: Event[];
  responsable_traitement_given_name?: string;
  responsable_traitement_family_name?: string;
  acl?: Partial<Record<EnrollmentEvent, boolean>>;
  additional_content?: any;
  cgu_approved?: boolean;
  copied_from_enrollment_id?: number;
  data_recipients?: any;
  data_retention_comment?: any;
  data_retention_period?: number;
  date_mise_en_production?: string;
  demarche?: any;
  description?: string;
  documents?: Document[];
  documents_attributes?: any[];
  dpo_is_informed?: boolean;
  fondement_juridique_title?: string;
  fondement_juridique_url?: string;
  linked_token_manager_id?: number | null;
  organization_id?: number;
  previous_enrollment_id?: number;
  scopes?: Record<string, boolean>;
  team_members?: TeamMember[];
  technical_team_type?: any;
  technical_team_value?: any;
  type_projet?: any;
  volumetrie_approximative?: any;
  zip_code?: string;
  contacts?: Contact[];
  user?: User;
  reopening?: boolean;
};
