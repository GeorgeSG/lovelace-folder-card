import { computeDomain, HomeAssistant, LovelaceCardEditor } from 'custom-card-helpers';
import { HassEntity } from 'home-assistant-js-websocket';
import {
  css,
  CSSResult,
  customElement,
  html,
  LitElement,
  property,
  TemplateResult,
} from 'lit-element';
import { FolderCardConfig, FolderSort } from './types';

@customElement('folder-card-editor')
export class FolderCardEditor extends LitElement implements LovelaceCardEditor {
  private static readonly CONFIG_CHANGED_EVENT = 'config-changed';

  @property({ type: Object }) hass!: HomeAssistant;
  @property() private config!: FolderCardConfig;

  private _folderEntities: Array<string> | null = null;

  private get entity(): HassEntity | undefined {
    return this.hass.states[this.config.entity];
  }

  private get selectedEntityIndex(): number {
    const index = this.folderEntities.indexOf(this.config.entity);
    return index > -1 ? index : 0;
  }

  private get sortOrder(): FolderSort {
    return this.config.sort ?? FolderSort.DEFAULT;
  }

  get folderEntities(): Array<string> {
    if (this._folderEntities === null) {
      this._folderEntities = Object.keys(this.hass.states).filter(
        (entityId) =>
          computeDomain(entityId) === 'sensor' &&
          Boolean(this.hass.states[entityId].attributes.file_list)
      );
    }

    return this._folderEntities;
  }

  render(): TemplateResult {
    if (this.folderEntities.length === 0) {
      return html`<div>
        It looks like you don't have any
        <a href="https://www.home-assistant.io/integrations/folder/" target="_blank"
          >Folder sensors</a
        >
        yet. Please add one and come back!
      </div>`;
    }

    return html`<div class="card-config">
      <paper-dropdown-menu
        style="width: 100%"
        label="Entity (Required)"
        .configValue=${'entity'}
        @value-changed=${this.onValueChange}
      >
        <paper-listbox slot="dropdown-content" .selected=${this.selectedEntityIndex}>
          ${this.folderEntities.map((entity) => html`<paper-item>${entity}</paper-item>`)}
        </paper-listbox>
      </paper-dropdown-menu>
      <div class="side-by-side">
        <paper-input
          label="Title (Optional)"
          .configValue=${'title'}
          .value=${this.config.title}
          .placeholder=${this.entity?.attributes.friendly_name}
          @value-changed=${this.onValueChange}
        ></paper-input>
        <paper-input
          label="Header Icon (Optional)"
          .configValue=${'icon'}
          .value=${this.config.icon}
          @value-changed=${this.onValueChange}
        ></paper-input>
      </div>
      <div class="side-by-side">
        <paper-input
          type="number"
          label="Max Count (Optional)"
          .configValue=${'max_count'}
          .value=${this.config.max_count}
          @value-changed=${this.onValueChange}
        ></paper-input>
        <paper-dropdown-menu
          style="width: 100%"
          label="Sort Order (Optional)"
          .configValue=${'sort'}
          @value-changed=${this.onValueChange}
        >
          <paper-listbox
            slot="dropdown-content"
            .selected=${Object.values(FolderSort).indexOf(this.sortOrder)}
          >
            ${Object.values(FolderSort).map((entity) => html`<paper-item>${entity}</paper-item>`)}
          </paper-listbox>
        </paper-dropdown-menu>
      </div>
      <div class="side-by-side">
        <ha-switch
          .checked="${this.config.show_count}"
          .configValue="${'show_count'}"
          @change="${this.onSwitchChange}"
        >
          Show Count?
        </ha-switch>
        <ha-switch
          .checked="${this.config.show_hidden}"
          .configValue="${'show_hidden'}"
          @change="${this.onSwitchChange}"
        >
          Show Hidden?
        </ha-switch>
      </div>
      <p>
        Note: tap_action is not supported in Visual Editor yet.
      </p>
    </div> `;
  }

  setConfig(config): void {
    this.config = config;
  }

  private onSwitchChange({ target: { checked, configValue } }): void {
    const newConfig = { ...this.config, [configValue]: checked };
    this.dispatch(newConfig);
  }

  private onValueChange(e: CustomEvent): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const property = (e.target as any).configValue;
    let value = e.detail.value;

    if (property === 'sort') {
      value = value === 'default' ? undefined : value;
    }

    if (property === 'max_count') {
      value = parseInt(value);

      if (isNaN(value)) {
        return;
      }
    }

    if (this.config[property] === value) {
      return;
    }

    const newConfig = { ...this.config, [property]: value };
    this.dispatch(newConfig);
  }

  private dispatch(config: FolderCardConfig): void {
    const event = new CustomEvent(FolderCardEditor.CONFIG_CHANGED_EVENT, {
      bubbles: true,
      composed: true,
      detail: { config },
    });

    this.dispatchEvent(event);
  }

  static get styles(): CSSResult {
    return css`
      ha-switch {
        padding: 16px 0;
      }
      .side-by-side {
        display: flex;
      }
      .side-by-side > * {
        flex: 1;
        padding-right: 4px;
      }
    `;
  }
}
