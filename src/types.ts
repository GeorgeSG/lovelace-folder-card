import { ActionConfig } from 'custom-card-helpers';

export interface FolderCardConfig {
  entity: string;
  title?: string;
  icon?: string;
  call_service: string;
  tap_action?: ActionConfig;
}
