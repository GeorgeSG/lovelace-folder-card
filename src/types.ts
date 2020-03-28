import { ActionConfig } from 'custom-card-helpers';

export interface FolderCardConfig {
  entity: string;
  title?: string;
  icon?: string;
  call_service: string;
  hold_action?: ActionConfig;
  tap_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}
