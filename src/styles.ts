import { css } from 'lit-element';

export const styles = css`
  .card-header-wrapper {
    display: flex;
    padding: 24px 16px 16px;
  }

  .card-header-wrapper .count {
    margin-left: auto;
    align-self: center;
  }

  .card-header {
    color: var(--ha-card-header-color, --primary-text-color);
    font-family: var(--ha-card-header-font-family);
    letter-spacing: -0.012em;
    line-height: 32px;
  }

  .card-header > .name {
    font-size: var(--ha-card-header-font-size, 24px);
  }

  .card-header > .name > .icon {
    padding: 0px 18px 0px 8px;
  }

  .folder-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    height: 40px;
  }

  .folder-item .icon-wrapper {
    flex-basis: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
  }

  .folder-item .item-name {
    margin-left: 16px;
    flex: 1 0 60px;
  }

  .card-empty {
    padding: 16px;
  }
`;
