import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import reset from "./styles/reset.css.ts";

@customElement("card-element")
class CardElement extends LitElement {
  @property({ type: String })
  title = "";

  @property({ type: String })
  description = "";

  @property({ type: String })
  href = "";

  @property({ type: String })
  image = "";

  @property({ attribute: "image-alt" })
  imageAlt = "";

  @property({ type: Boolean })
  clickable = false;

  @property({ type: String })
  variant = "default";

  @property({ attribute: "background-color" })
  backgroundColor = "";

  @property({ attribute: "border-color" })
  borderColor = "";

  static styles = [
    reset.styles,
    css`
      :host {
        display: block;
      }

      .card {
        position: relative;
        background-color: var(--card-bg-color, var(--color-background-card));
        padding: var(--spacing-lg);
        border-radius: var(--radius-md);
        border: 1px solid var(--card-border-color, var(--color-border));
        box-shadow: var(--shadow-sm);
        transition: all 0.2s ease;
        height: auto;
        min-height: 200px;
        display: flex;
        flex-direction: column;
      }

      .card.featured {
        border: 2px solid var(--color-accent);
        box-shadow: var(--shadow-lg);
      }

      .card.compact {
        min-height: auto;
        padding: var(--spacing-md);
      }

      .card.has-image {
        padding-top: calc(200px + var(--spacing-lg));
      }

      .card.clickable {
        cursor: pointer;
      }

      .card:hover {
        border-color: var(--color-accent);
        box-shadow: var(--shadow-md);
        transform: translateY(-1px);
      }

      .card-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: var(--radius-md) var(--radius-md) 0 0;
      }

      .card-content {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .card-title {
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-semibold);
        color: var(--color-primary);
        margin: 0 0 var(--spacing-sm) 0;
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }

      .card-description {
        color: var(--color-text-light);
        margin: 0 0 var(--spacing-md) 0;
        flex: 1;
      }

      .card-link {
        color: var(--color-link);
        text-decoration: none;
        font-weight: var(--font-weight-semibold);
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-sm);
        margin-top: auto;
      }

      .card-link:hover {
        color: var(--color-link-hover);
        text-decoration: underline;
      }

      .card-link:focus {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
      }

      .card-slot {
        margin-top: var(--spacing-md);
      }

      /* When the entire card is clickable */
      .card.clickable .card-link {
        pointer-events: none;
      }

      .card.clickable::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
      }
    `,
  ];

  updated() {
    if (this.backgroundColor) {
      this.style.setProperty("--card-bg-color", this.backgroundColor);
    }
    if (this.borderColor) {
      this.style.setProperty("--card-border-color", this.borderColor);
    }
  }

  private _handleCardClick() {
    if (this.clickable && this.href) {
      window.location.href = this.href;
    }
  }

  render() {
    const cardClasses = [
      "card",
      this.image ? "has-image" : "",
      this.clickable && this.href ? "clickable" : "",
      this.variant,
    ]
      .filter(Boolean)
      .join(" ");

    return html`
      <div class="${cardClasses}" @click=${this._handleCardClick}>
        <slot name="image">
          ${this.image
            ? html`
                <img
                  class="card-image"
                  src="${this.image}"
                  alt="${this.imageAlt || this.title}"
                />
              `
            : ""}
        </slot>

        <div class="card-content">
          <slot name="header">
            ${this.title
              ? html`
                  <h3 class="card-title">
                    <slot name="icon"></slot>
                    <slot name="title">${this.title}</slot>
                  </h3>
                `
              : ""}
          </slot>

          <slot name="description">
            ${this.description
              ? html` <p class="card-description">${this.description}</p> `
              : ""}
          </slot>

          <div class="card-slot">
            <slot name="content"></slot>
            <slot></slot>
          </div>

          <slot name="footer">
            ${this.href && !this.clickable
              ? html`
                  <a class="card-link" href="${this.href}">
                    <slot name="link-text">Learn More</slot>
                    <span>→</span>
                  </a>
                `
              : ""}
          </slot>
        </div>
      </div>
    `;
  }
}

@customElement("card-grid")
class CardGrid extends LitElement {
  @property({ type: String })
  columns = "auto-fit";

  @property({ attribute: "min-width" })
  minWidth = "280px";

  @property({ type: String })
  gap = "var(--spacing-lg)";

  @property({ attribute: "max-columns" })
  maxColumns = "";

  @property({ type: String })
  alignment = "start";

  static styles = [
    reset.styles,
    css`
      :host {
        display: block;
        width: 100%;
        box-sizing: border-box;
      }

      .grid {
        display: grid;
        gap: var(--spacing-lg);
        width: 100%;
        box-sizing: border-box;
        align-items: start;
      }
    `,
  ];

  updated() {
    const grid = this.shadowRoot?.querySelector(".grid") as HTMLElement;
    if (grid) {
      let columns;
      if (this.columns === "auto-fit") {
        const maxCols = this.maxColumns ? `, ${this.maxColumns}` : "";
        columns = `repeat(auto-fit${maxCols}, minmax(${this.minWidth}, 1fr))`;
      } else {
        columns = this.columns;
      }

      grid.style.gridTemplateColumns = columns;
      grid.style.gap = this.gap;
      grid.style.alignItems = this.alignment;
    }
  }

  render() {
    return html`
      <div class="grid">
        <slot name="header"></slot>
        <slot></slot>
        <slot name="footer"></slot>
      </div>
    `;
  }
}

export { CardElement, CardGrid };
