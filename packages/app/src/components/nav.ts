import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Observer, Auth } from "@calpoly/mustang";

@customElement("breadcrumb-link")
class BreadcrumbLink extends LitElement {
  @property({ type: String })
  href = "";

  @property({ type: String })
  text = "";

  @property({ attribute: "separator-text" })
  separatorText = "→";

  @property({ type: Boolean, attribute: "hide-separator" })
  hideSeparator = false;

  static styles = [
    css`
      :host {
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-sm, 0.5rem);
      }

      a {
        color: var(--color-text-inverted, #ffffff);
        text-decoration: none;
        font-weight: var(--font-weight-bold, 700);
      }

      a:hover {
        text-decoration: underline;
      }

      a:focus {
        outline: 2px solid var(--color-accent, #ff6b35);
        outline-offset: 2px;
      }

      .separator {
        color: var(--color-text-inverted, #ffffff);
        opacity: 0.7;
      }
    `,
  ];

  render() {
    return html`
      <a href="${this.href}">
        <slot name="text">${this.text}</slot>
      </a>
      ${!this.hideSeparator
        ? html`
            <span class="separator">
              <slot name="separator"> ${this.separatorText} </slot>
            </span>
          `
        : ""}
    `;
  }
}

@customElement("nav-element")
class NavElement extends LitElement {
  @property({ type: Boolean })
  darkMode = false;

  @property({ attribute: "background-color" })
  backgroundColor = "";

  @property({ type: Boolean, attribute: "hide-theme-toggle" })
  hideThemeToggle = false;

  @property({ attribute: "theme-label" })
  themeLabel = "Dark mode";

  @state()
  loggedIn = false;

  @state()
  userid?: string;

  _authObserver: Observer<Auth.Model> = new Observer(this, "natty:auth");

  static styles = [
    css`
      :host {
        display: block;
        margin: 0 0 var(--spacing-xl, 1.5rem) 0;
      }

      nav {
        background-color: var(--color-primary, #0d4f3c);
        color: var(--color-text-inverted, #ffffff);
        padding: var(--spacing-lg, 1rem) var(--spacing-xl, 1.5rem);
        margin: 0;
        border-radius: 0 0 var(--radius-lg, 8px) var(--radius-lg, 8px);
        font-family: var(--font-family-primary, system-ui, sans-serif);
        font-weight: var(--font-weight-semibold, 600);
        font-size: var(--font-size-lg, 1.125rem);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--spacing-md, 0.75rem);
      }

      label {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm, 0.5rem);
        cursor: pointer;
        font-weight: var(--font-weight-semibold, 600);
        color: var(--color-text-inverted, #ffffff);
        white-space: nowrap;
      }

      input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: var(--color-accent, #ff6b35);
        cursor: pointer;
      }

      ::slotted(a) {
        color: var(--color-text-inverted, #ffffff) !important;
        text-decoration: none;
        font-weight: var(--font-weight-bold, 700);
      }

      ::slotted(a:hover) {
        text-decoration: underline !important;
      }

      ::slotted(a:focus) {
        outline: 2px solid var(--color-accent, #ff6b35);
        outline-offset: 2px;
      }

      .breadcrumbs {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm, 0.5rem);
        flex-wrap: wrap;
      }

      .nav-actions {
        display: flex;
        align-items: center;
        gap: var(--spacing-md, 0.75rem);
      }

      .nav-actions span {
        color: var(--color-text-inverted, #ffffff);
        font-weight: var(--font-weight-semibold, 600);
        white-space: nowrap;
      }

      .nav-actions button {
        background-color: var(--color-accent, #ff6b35);
        color: var(--color-text-inverted, #ffffff);
        border: 2px solid var(--color-accent, #ff6b35);
        padding: var(--spacing-xs, 0.25rem) var(--spacing-sm, 0.5rem);
        border-radius: var(--radius-sm, 4px);
        font-family: inherit;
        font-size: var(--font-size-sm, 0.875rem);
        font-weight: var(--font-weight-semibold, 600);
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
      }

      .nav-actions button:hover {
        background-color: transparent;
        color: var(--color-accent, #ff6b35);
        transform: translateY(-1px);
      }

      .nav-actions button:focus {
        outline: 2px solid var(--color-accent, #ff6b35);
        outline-offset: 2px;
      }

      .nav-actions a {
        color: var(--color-text-inverted, #ffffff);
        text-decoration: none;
        font-weight: var(--font-weight-semibold, 600);
        padding: var(--spacing-xs, 0.25rem) var(--spacing-sm, 0.5rem);
        border: 2px solid var(--color-accent, #ff6b35);
        border-radius: var(--radius-sm, 4px);
        background-color: transparent;
        transition: all 0.2s ease;
        white-space: nowrap;
      }

      .nav-actions a:hover {
        background-color: var(--color-accent, #ff6b35);
        transform: translateY(-1px);
      }

      .nav-actions a:focus {
        outline: 2px solid var(--color-accent, #ff6b35);
        outline-offset: 2px;
      }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    // Apply saved theme from localStorage
    const savedTheme = localStorage.getItem("theme");
    this.darkMode = savedTheme === "dark";
    document.body.classList.toggle("dark-mode", this.darkMode);

    // Set up auth observer
    this._authObserver.observe((auth) => {
      const { user } = auth;
      if (user && user.authenticated) {
        this.loggedIn = true;
        this.userid = user.username;
      } else {
        this.loggedIn = false;
        this.userid = undefined;
      }
    });
  }

  updated() {
    if (this.backgroundColor) {
      this.style.setProperty("--nav-bg-color", this.backgroundColor);
    }
  }

  render() {
    return html`
      <nav
        style="background-color: var(--nav-bg-color, var(--color-primary, #0d4f3c));"
      >
        <div class="breadcrumbs">
          <slot name="breadcrumbs"></slot>
          <slot></slot>
        </div>

        <div class="nav-actions">
          <slot name="actions"></slot>

          ${this.loggedIn
            ? html` <button @click=${this._handleSignOut}>Sign Out</button> `
            : html` <a href="/app/login">Sign In</a> `}
          ${!this.hideThemeToggle
            ? html`
                <label for="dark-mode-toggle">
                  <input
                    type="checkbox"
                    id="dark-mode-toggle"
                    autocomplete="off"
                    .checked=${this.darkMode}
                    @change=${this._handleThemeToggle}
                  />
                  <slot name="theme-label">${this.themeLabel}</slot>
                </label>
              `
            : ""}
        </div>
      </nav>
    `;
  }

  private _handleThemeToggle(event: Event) {
    const target = event.target as HTMLInputElement;
    this.darkMode = target.checked;

    // Update body class and localStorage
    document.body.classList.toggle("dark-mode", this.darkMode);
    localStorage.setItem("theme", this.darkMode ? "dark" : "light");

    const customEvent = new CustomEvent("themeToggle", {
      detail: { checked: this.darkMode },
      bubbles: true,
    });
    this.dispatchEvent(customEvent);
  }

  private _handleSignOut(event: Event) {
    event.preventDefault();
    const customEvent = new CustomEvent("auth:message", {
      bubbles: true,
      composed: true,
      detail: ["auth/signout"],
    });
    this.dispatchEvent(customEvent);
  }
}

export { BreadcrumbLink, NavElement };
export default NavElement;
