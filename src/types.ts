import { ActionConfig } from 'custom-card-helpers';

export interface FolderCardConfig {
  entity: string;
  title?: string;
  icon?: string;
  tap_action?: ActionConfig;
  sort?: 'ascending' | 'descending';
  max_count?: number;
  show_count?: boolean;
  show_hidden?: boolean;
}
