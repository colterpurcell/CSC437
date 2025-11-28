import { css } from "lit";

const styles = css`
  * {
    margin: 0;
    padding: 0;
  }

  ul,
  ol {
    list-style-type: none;
  }

  html:focus-within {
    scroll-behavior: smooth;
  }

  html {
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
  }

  body {
    min-height: 100vh;
    text-rendering: optimizeSpeed;
    line-height: 1.5;
  }

  img,
  picture,
  svg {
    max-width: 100%;
    height: auto;
    display: block;
  }

  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
    font-size: 100%;
    line-height: 1.15;
    margin: 0;
  }

  button,
  input {
    overflow: visible;
  }

  button,
  select {
    text-transform: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  [hidden] {
    display: none !important;
  }
`;

export default { styles };
