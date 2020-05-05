import { handleClick, HomeAssistant } from 'custom-card-helpers';
import { HassEntity } from 'home-assistant-js-websocket';
import { CSSResult, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { CARD_SIZE, CARD_VERSION } from './const';
import { Partial } from './partials';
import { styles } from './styles';
import { FolderCardConfig } from './types';

console.info(
  `%c  FOLDER-CARD \n%c  Version ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray'
);

@customElement('folder-card')
export class FolderCard extends LitElement {
  @property() private hass!: HomeAssistant;
  @property() private config!: FolderCardConfig;
  @property() private isExpanded = false;

  private get entity(): HassEntity | undefined {
    return this.hass.states[this.config.entity];
  }

  private get files(): string[] {
    let files: string[] = this.entity?.attributes.file_list;

    if (Boolean(this.config.show_hidden) === false) {
      files = files.filter((filePath) => this.getFileName(filePath).indexOf('.') !== -1);
    }

    if (this.config.sort) {
      files = files.sort((f1, f2) => {
        const order = f1 > f2 ? -1 : 1;
        return this.config.sort === 'ascending' ? order * -1 : order;
      });
    }

    if (!this.isExpanded && this.config.max_count) {
      files = files.slice(0, this.config.max_count);
    }

    return files;
  }

  private get totalFileCount(): number {
    return this.entity?.attributes.file_list.length ?? 0;
  }

  private get canExpand(): boolean {
    return Boolean(this.config.max_count) && this.totalFileCount > this.config.max_count!;
  }

  render(): TemplateResult | null {
    if (!this.entity) {
      return Partial.error('The entity could not be found.', this.config);
    }

    if (!this.entity.attributes.file_list) {
      return Partial.error(
        "The entity you passed doesn't appear to be a folder sensor.",
        this.config
      );
    }

    if (this.files.length === 0) {
      return this.renderEmpty();
    }

    return html`
      <ha-card>
        ${this.renderHeader()}
        <div class="card-content">
          ${this.files.map((file) => this.renderFile(file))}
          ${this.canExpand ? this.renderCollapse() : ''}
        </div>
      </ha-card>
    `;
  }

  setConfig(config): void {
    if (!config) {
      throw new Error('Invalid configuration');
    }

    if (!config.entity) {
      throw new Error('You need to set an entity');
    }

    this.config = config;
  }

  getCardSize(): number {
    return CARD_SIZE;
  }

  private renderFile(file): TemplateResult {
    return html`
      <div class="folder-item" @click=${() => this.onSelectFile(file)}>
        <div class="icon-wrapper"><ha-icon icon="mdi:file"></ha-icon></div>
        <div class="item-name">${this.getFileName(file)}</div>
      </div>
    `;
  }

  private renderCollapse(): TemplateResult {
    const label = this.isExpanded ? 'Collapse' : 'Expand';
    const icon = this.isExpanded ? 'mdi:arrow-collapse-vertical' : 'mdi:arrow-expand-vertical';

    return html`
      <div class="folder-item" @click=${this.onToggleCollapse}>
        <div class="icon-wrapper"><ha-icon .icon="${icon}"></ha-icon></div>
        <div class="item-name">${label}</div>
      </div>
    `;
  }

  private renderHeader(): TemplateResult | null {
    if (!this.config.title && !this.entity?.attributes.friendly_name) {
      return null;
    }

    return html`
      <div class="card-header-wrapper">
        <div class="card-header">
          <div class="name">
            ${this.config.icon && html`<ha-icon class="icon" icon=${this.config.icon}></ha-icon> `}
            ${this.config.title ?? this.entity!.attributes.friendly_name}
          </div>
        </div>
        ${this.config.show_count
          ? html` <div class="count">Total: ${this.totalFileCount}</div> `
          : ''}
      </div>
    `;
  }

  private renderEmpty(): TemplateResult {
    return html`
      <ha-card>
        ${this.renderHeader()}
        <div class="card-empty">There are no files to show.</div>
      </ha-card>
    `;
  }

  private getFileName(file: string): string {
    return file.split('/').slice(-1)[0];
  }

  private onSelectFile(file): void {
    const actionConfig = this.buildActionConfig(file);
    handleClick(this, this.hass, actionConfig, false, false);
  }

  private onToggleCollapse(): void {
    this.isExpanded = !this.isExpanded;
  }

  /**
   * Inserts a "file" parameter in service_data for a "call-service" action.
   */
  private buildActionConfig(file): object {
    const config = {
      entity: this.config.entity,
      tap_action: Object.assign({}, this.config.tap_action),
    };

    const fileObj = { file };

    if (config.tap_action?.action === 'call-service') {
      config.tap_action.service_data = Object.assign({}, config.tap_action.service_data, fileObj);
    }

    return config;
  }

  static get styles(): CSSResult {
    return styles;
  }
}
