import { css } from "lit";

export const iconStyles = css`
  /* Icon sizing classes for Shadow DOM */
  .icon {
    fill: var(--color-icon);
    vertical-align: middle;
    display: inline-block;
  }

  .icon-sm {
    width: 16px;
    height: 16px;
  }

  .icon-md {
    width: 24px;
    height: 24px;
  }

  .icon-lg {
    width: 32px;
    height: 32px;
  }

  .icon-xl {
    width: 64px;
    height: 64px;
  }
`;