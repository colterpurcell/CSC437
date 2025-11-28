import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { iconStyles } from "../styles/icon-styles.css.ts";
import { themeTokens } from "../styles/theme-tokens.css.ts";
import { pageStyles } from "../styles/page-styles.css.ts";

@customElement("parks-view")
class ParksViewElement extends LitElement {
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
        <span>Parks</span>
      </nav-element>

      <section-header title="National Parks" icon="park"></section-header>
      <parks-listing></parks-listing>
    `;
  }
}

export default ParksViewElement;
