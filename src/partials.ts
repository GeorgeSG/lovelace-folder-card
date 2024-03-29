import { html, TemplateResult } from 'lit-element';
import { FolderCardConfig } from './types';
import { LovelaceCard } from 'custom-card-helpers';

export class Partial {
  static error(error: string, origConfig: FolderCardConfig): TemplateResult {
    const errorCard = document.createElement('hui-error-card') as LovelaceCard;
    errorCard.setConfig({
      type: 'error',
      error,
      origConfig,
    });

    return html`${errorCard}`;
  }
}
