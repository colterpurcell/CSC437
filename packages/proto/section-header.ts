import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import reset from "./styles/reset.css.ts";

@customElement("section-header")
class SectionHeader extends LitElement {
  @property({ type: String })
  title = "";

  @property({ type: String })
  icon = "";

  @property({ type: String })
  iconSize = "lg";

  static styles = [
    reset.styles,
    css`
      :host {
        display: block;
      }

      h2 {
        color: var(--color-primary);
        font-family: var(--font-family-display);
        font-size: 2rem;
        font-weight: var(--font-weight-bold);
        line-height: var(--line-height-tight);
        margin-top: 0;
        margin-bottom: var(--spacing-xl);
        padding-left: var(--spacing-md);
        border-left: 4px solid var(--color-accent);
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }

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

      /* Allow custom content in addition to or instead of title */
      .title-content {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        flex: 1;
      }
    `,
  ];

  render() {
    return html`
      <h2>
        <slot name="icon">
          ${this.icon
            ? html`
                <svg class="icon icon-${this.iconSize}" viewBox="0 0 100 100">
                  <use
                    href="/public/assets/icons/camping.svg#icon-${this.icon}"
                  ></use>
                </svg>
              `
            : ""}
        </slot>

        <div class="title-content">
          <slot name="title">${this.title}</slot>
          <slot></slot>
        </div>

        <slot name="actions"></slot>
      </h2>
    `;
  }
}

export { SectionHeader };
