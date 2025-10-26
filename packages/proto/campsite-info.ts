import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import reset from "./styles/reset.css.ts";

@customElement("campsite-info")
class CampsiteInfo extends LitElement {
  @property({ type: String })
  name = "";

  @property({ type: String })
  capacity = "";

  @property({ type: String })
  location = "";

  @property({ type: String })
  description = "";

  // Example of attribute with different property name
  @property({ attribute: "max-occupancy" })
  maxOccupancy = "";

  // Example of attribute that sets CSS custom property
  @property({ attribute: "background-color" })
  backgroundColor = "";

  // Example of attribute that affects styling/classes
  @property({ type: String })
  variant = "default"; // could be "featured", "compact", etc.

  static styles = [
    reset.styles,
    css`
      :host {
        display: block;
        margin-bottom: var(--spacing-xl);
      }

      .campsite-header {
        background-color: var(
          --campsite-bg-color,
          var(--color-background-card)
        );
        padding: var(--spacing-lg);
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border);
      }

      .campsite-header.featured {
        border: 2px solid var(--color-accent);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .campsite-header.compact {
        padding: var(--spacing-md);
      }

      h1 {
        color: var(--color-primary);
        font-family: var(--font-family-display);
        font-size: 2rem;
        font-weight: var(--font-weight-bold);
        margin: 0 0 var(--spacing-sm) 0;
      }

      .meta {
        display: flex;
        gap: var(--spacing-md);
        flex-wrap: wrap;
        margin-bottom: var(--spacing-md);
      }

      .meta span {
        background-color: var(--color-accent);
        color: white;
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--radius-sm);
        font-size: 0.875rem;
        font-weight: var(--font-weight-medium);
      }

      p {
        color: var(--color-text-light);
        margin: 0;
        line-height: var(--line-height-relaxed);
      }
    `,
  ];

  updated() {
    if (this.backgroundColor) {
      this.style.setProperty("--campsite-bg-color", this.backgroundColor);
    }
  }

  render() {
    const headerClass = `campsite-header ${this.variant}`;

    return html`
      <div class="${headerClass}">
        <h1>
          <slot name="name">${this.name}</slot>
        </h1>

        <div class="meta">
          <slot name="capacity">
            ${this.capacity ? html`<span>${this.capacity}</span>` : ""}
          </slot>
          <slot name="location">
            ${this.location ? html`<span>${this.location}</span>` : ""}
          </slot>
          <slot name="max-occupancy">
            ${this.maxOccupancy
              ? html`<span>Max: ${this.maxOccupancy}</span>`
              : ""}
          </slot>
          <slot name="meta"></slot>
        </div>

        <slot name="description">
          ${this.description ? html`<p>${this.description}</p>` : ""}
        </slot>

        <slot name="content"></slot>
        <slot></slot>
      </div>
    `;
  }
}

export { CampsiteInfo };
