import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { iconStyles } from "../styles/icon-styles.css.ts";
import { themeTokens } from "../styles/theme-tokens.css.ts";
import { pageStyles } from "../styles/page-styles.css.ts";

@customElement("paths-view")
class PathsViewElement extends LitElement {
  static styles = [
    themeTokens,
    ...pageStyles,
    css`
      :host {
        display: block;
        grid-column: 1 / -1;
      }
      section-header {
        margin-bottom: var(--spacing-lg);
      }
    `,
    iconStyles,
  ];

  render() {
    return html`
      <nav-element>
        <a href="/app">Adventure Guide</a> →
        <span>Paths</span>
      </nav-element>

      <section-header title="Hiking Paths" icon="path"></section-header>
      <paths-listing></paths-listing>
    `;
  }
}

export default PathsViewElement;
