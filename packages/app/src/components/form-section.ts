import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("form-section")
export class FormSection extends LitElement {
  @property({ type: String }) maxWidth: string = "450px";
  @property({ type: String }) gap: string = "var(--spacing-lg)";
  @property({ type: String }) minColumnWidth: string = "320px";

  static styles = [
    css`
      :host {
        display: block;
        width: 100%;
        box-sizing: border-box;
        /* space between stacked sections */
        margin: var(--spacing-lg);
      }
      .wrap {
        width: 100%;
        max-width: var(--form-section-max-width, 1040px);
        margin: 0 auto;
        padding: var(--spacing-lg);
        border: 2px solid var(--color-border);
        border-radius: var(--radius-lg);
        background: var(--color-elevated);
        box-shadow: var(--shadow-md);
        display: grid;
        gap: var(--form-section-gap, var(--spacing-md));
        box-sizing: border-box;
        /* allow the section to grow as large as needed */
        overflow: visible;
      }
      .title {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-bold);
      }
      .content {
        display: grid;
        /* horizontal spacing via column gap and responsive columns */
        gap: var(--spacing-xl);
        grid-template-columns: repeat(
          auto-fit,
          minmax(var(--form-section-min-col, 320px), 1fr)
        );
        /* let content grow naturally without clipping */
        min-width: auto;
      }
      ::slotted(*) {
        max-width: 100%;
        box-sizing: border-box;
      }
    `,
  ];

  render() {
    // apply props to CSS variables; if maxWidth is 'none', remove the cap
    const mw = (this.maxWidth || "1040px").trim();
    if (mw.toLowerCase() === "none") {
      this.style.setProperty("--form-section-max-width", "none");
    } else {
      this.style.setProperty("--form-section-max-width", mw);
    }
    this.style.setProperty("--form-section-gap", this.gap);
    this.style.setProperty("--form-section-min-col", this.minColumnWidth);
    return html`
      <div class="wrap">
        <div class="title"><slot name="title"></slot></div>
        <div class="content"><slot name="content"></slot></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "form-section": FormSection;
  }
}
