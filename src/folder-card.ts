import { handleClick, HomeAssistant } from 'custom-card-helpers';
import {
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
} from 'lit-element';
import { CARD_VERSION } from './const';
import { FolderCardConfig } from './types';

console.info(
  `%c  FOLDER-CARD \n%c  Version ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray'
);

@customElement('folder-card')
export class FolderCard extends LitElement {
  @property() hass?: HomeAssistant;
  @property() private config?: FolderCardConfig;

  render(): TemplateResult | null {
    if (!this.config || !this.hass) {
      return null;
    }

    if (!this.folderEntity) {
      return this.renderWarning('The entity could not be found!');
    }

    if (!this.folderEntity.attributes.file_list) {
      return this.renderWarning("The entity you passed doesn't appear to be a folder sensor!");
    }

    if (this.folderEntity.attributes.file_list.length === 0) {
      return this.renderEmpty();
    }

    return html`
      <ha-card>
        ${this.renderHeader()}
        ${this.files.map((file) => this.renderFile(file))}
      </ha-card>
    `;
  }

  setConfig(config) {
    if (!config) {
      throw new Error('Invalid configuration');
    }

    if (!config.entity) {
      throw new Error('You need to set an entity');
    }

    this.config = config;
  }

  getCardSize(): number {
    return 6;
  }

  get files(): string[] {
    let files: string[] = this.folderEntity?.attributes.file_list;

    if (this.config?.sort !== undefined) {
      files = files.sort((f1, f2) => {
        if (this.config?.sort === 'ascending') {
          return f1 > f2 ? 1 : -1;
        } else {
          return f1 > f2 ? -1 : 1;
        }
      });
    }

    if (this.config?.max_count) {
      files = files.slice(0, this.config.max_count);
    }

    return files;
  }

  private renderFile(file): TemplateResult {
    return html`
      <paper-item class="folder-item">
        <paper-item-body>
          <ha-icon class="icon" icon="mdi:file"></ha-icon>
        </paper-item-body>
        <paper-item-body @click=${() => this.selectFile(file)}>
          ${this.getFileName(file)}
        </paper-item-body>
      </paper-item>
    `;
  }

  private renderHeader(): TemplateResult | null {
    if (!this.config) {
      return null;
    }

    if (!this.config.title && !this.folderEntity?.attributes.friendly_name) {
      return null;
    }

    return html`
      <div class="card-header">
        <div class="name">
          ${this.config.icon && html` <ha-icon class="icon" icon=${this.config.icon}></ha-icon> `}
          ${this.config.title ?? this.folderEntity!.attributes.friendly_name}
        </div>
      </div>
    `;
  }

  private renderWarning(warning: string): TemplateResult {
    return html`
      <ha-card>
        <paper-item class="warning">${warning}</paper-item>
      </ha-card>
    `;
  }

  private renderEmpty(): TemplateResult {
    return html`
      <ha-card>
        ${this.renderHeader()}
        <paper-item>The folder is empty.</paper-item>
      </ha-card>
    `;
  }

  private get folderEntity() {
    if (!this.config) {
      return;
    }

    return this.hass?.states[this.config!.entity];
  }

  private getFileName(file: string): string {
    return file.split('/').slice(-1)[0];
  }

  private selectFile(file): void {
    if (!this.hass) {
      return;
    }

    const actionConfig = this.buildActionConfig(file);
    handleClick(this, this.hass, actionConfig, false, false);
  }

  /**
   * Inserts a "file" parameter in service_data for a "call-service" action.
   */
  private buildActionConfig(file): object {
    let config = {
      entity: this.config?.entity,
      tap_action: Object.assign({}, this.config?.tap_action),
    };

    const fileObj = { file };

    if (config.tap_action?.action === 'call-service') {
      config.tap_action.service_data = Object.assign({}, config.tap_action.service_data, fileObj);
    }

    return config;
  }

  static get styles(): CSSResult {
    return css`
      .folder-item {
        cursor: pointer;
      }

      .icon {
        padding: 0px 18px 0px 8px;
      }

      .warning {
        background-color: var(--google-red-500);
        color: #fff;
      }
    `;
  }
}
