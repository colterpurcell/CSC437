import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import reset from "./styles/reset.css.ts";

interface CampsiteInfoData {
  name?: string;
  capacity?: string;
  location?: string;
  description?: string;
  maxOccupancy?: string;
  backgroundColor?: string;

  card?: {
    title?: string;
    description?: string;
    href?: string;
  };
}

interface CampsiteInfoCollection {
  campsites: { [key: string]: CampsiteInfoData };
}

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

  @property({ type: String })
  src?: string;

  @state()
  data: CampsiteInfoData | null = null;

  connectedCallback() {
    super.connectedCallback();
    if (this.src) this.hydrate(this.src);
  }

  hydrate(src: string) {
    fetch(src)
      .then((res) => res.json())
      .then((json: CampsiteInfoData) => {
        this.data = json;
      });
  }

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
    const currentData = this.data || {
      name: this.name,
      capacity: this.capacity,
      location: this.location,
      description: this.description,
      maxOccupancy: this.maxOccupancy,
      backgroundColor: this.backgroundColor,
    };
    const { name, capacity, location, description, maxOccupancy } = currentData;
    const headerClass = `campsite-header`;

    return html`
      <div class="${headerClass}">
        <h1>
          <slot name="name">${name}</slot>
        </h1>

        <div class="meta">
          <slot name="capacity">
            ${capacity ? html`<span>${capacity}</span>` : ""}
          </slot>
          <slot name="location">
            ${location ? html`<span>${location}</span>` : ""}
          </slot>
          <slot name="max-occupancy">
            ${maxOccupancy ? html`<span>Max: ${maxOccupancy}</span>` : ""}
          </slot>
          <slot name="meta"></slot>
        </div>

        <slot name="description">
          ${description ? html`<p>${description}</p>` : ""}
        </slot>

        <slot name="content"></slot>
        <slot></slot>
      </div>
    `;
  }
}

export { CampsiteInfo };
