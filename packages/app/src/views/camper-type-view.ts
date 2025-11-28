import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { iconStyles } from "../styles/icon-styles.css.ts";
import { themeTokens } from "../styles/theme-tokens.css.ts";
import { pageStyles } from "../styles/page-styles.css.ts";

@customElement("camper-type-view")
class CamperTypeViewElement extends LitElement {
  type: string = "";

  static get observedAttributes() {
    return ["type"];
  }

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null
  ) {
    if (name === "type" && value !== null) {
      this.type = value;
      this.requestUpdate();
    }
  }

  static styles = [
    themeTokens,
    ...pageStyles,
    css`
      :host {
        display: block;
      }
      .muted {
        color: var(--color-text-light);
      }
    `,
    iconStyles,
  ];

  render() {
    const title = this.prettyTitle(this.type);
    return html`
      <nav-element>
        <span slot="breadcrumb"></span>
        <a href="/app">Adventure Guide</a> →
        <a href="/app/campers">Camper Types</a> →
        <span>${title}</span>
      </nav-element>

      <section-header title="${title}" icon="campervan"></section-header>
      <p class="muted">
        Placeholder content for ${title}. Replace with rich guidance, gear
        lists, and safety tips.
      </p>
    `;
  }

  prettyTitle(slug?: string) {
    if (!slug) return "Camper";
    return slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
}

export default CamperTypeViewElement;
