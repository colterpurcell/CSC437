import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

interface SectionHeaderData {
  title: string;
  icon?: string;
  iconSize?: string;
}

interface SectionHeadersCollection {
  headers: { [key: string]: SectionHeaderData };
}

@customElement("section-header")
class SectionHeader extends LitElement {
  @property({ type: String })
  src?: string;

  @property({ type: String })
  title = "";

  @property({ type: String })
  icon = "";

  @property({ type: String })
  iconSize = "lg";

  @state()
  data: SectionHeaderData | null = null;

  connectedCallback() {
    super.connectedCallback();
    if (this.src) this.hydrate(this.src);
  }

  hydrate(src: string) {
    // Handle JSON fragment references like /data/section-headers.json#yosemite-poi
    const [url, fragment] = src.split("#");
    fetch(url)
      .then((res) => res.json())
      .then((json: SectionHeaderData | SectionHeadersCollection) => {
        if (fragment && "headers" in json) {
          // It's a collection, get the specific header
          this.data = json.headers[fragment];
        } else {
          // It's a direct header object
          this.data = json as SectionHeaderData;
        }
      });
  }

  static styles = [
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
    const currentData = this.data || {
      title: this.title,
      icon: this.icon,
      iconSize: this.iconSize,
    };
    const { title, icon, iconSize } = currentData;

    return html`
      <h2>
        <slot name="icon">
          ${icon
            ? html`
                <svg
                  class="icon icon-${iconSize || "lg"}"
                  viewBox="0 0 100 100"
                >
                  <use href="/assets/icons/camping.svg#icon-${icon}"></use>
                </svg>
              `
            : ""}
        </slot>

        <div class="title-content">
          <slot name="title">${title}</slot>
          <slot></slot>
        </div>

        <slot name="actions"></slot>
      </h2>
    `;
  }
}

export { SectionHeader };
