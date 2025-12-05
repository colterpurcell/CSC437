import { LitElement, html, css } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { Observer, Auth } from "@calpoly/mustang";
import { iconStyles } from "../styles/icon-styles.css.ts";
import { themeTokens } from "../styles/theme-tokens.css.ts";
import { pageStyles } from "../styles/page-styles.css.ts";

interface Path {
  pathid: string;
  name: string;
  description?: string;
  type?: "road" | "trail";
  park?: string;
  parkName?: string;
  image?: string;
  imageAlt?: string;
  card?: {
    image?: string;
    imageAlt?: string;
  };
}

@customElement("path-page")
class PathPage extends LitElement {
  @property({ attribute: "path-id" })
  pathIdAttr?: string;
  @state()
  private _path: Path | null = null;

  @state()
  private _loading = true;

  @state()
  private _error: string | null = null;

  @state()
  private _user: any = null;

  pathid: string = "";

  _authObserver: Observer<Auth.Model> = new Observer(this, "natty:auth");

  // Getters for properties
  get path() {
    return this._path;
  }
  set path(value: Path | null) {
    this._path = value;
  }

  get loading() {
    return this._loading;
  }
  set loading(value: boolean) {
    this._loading = value;
  }

  get error() {
    return this._error;
  }
  set error(value: string | null) {
    this._error = value;
  }

  get user() {
    return this._user;
  }
  set user(value: any) {
    this._user = value;
  }

  static styles = [
    themeTokens,
    ...pageStyles,
    css`
      :host {
        display: block;
      }

      .loading-message,
      .error-message,
      .auth-message {
        text-align: center;
        padding: var(--spacing-lg, 1rem);
        margin: var(--spacing-md, 0.75rem) 0;
      }

      .auth-message {
        background-color: var(--color-background-secondary, #f5f5f5);
        border-radius: var(--radius-md, 4px);
      }

      .login-link {
        color: var(--color-link, #0066cc);
        text-decoration: none;
        font-weight: var(--font-weight-semibold, 600);
      }

      .login-link:hover {
        text-decoration: underline;
      }

      .panel {
        margin-top: var(--spacing-lg);
        padding: var(--spacing-lg);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        background: var(--color-background-card);
      }

      .lead {
        color: var(--color-text-light);
        margin-bottom: var(--spacing-md);
      }

      .meta-row {
        display: flex;
        gap: var(--spacing-sm);
        flex-wrap: wrap;
      }

      .chip {
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-xs);
        padding: 4px 8px;
        border: 1px solid var(--color-border);
        border-radius: 9999px;
        font-size: 0.875rem;
        color: var(--color-text);
        background: var(--color-background);
      }

      .icon-sm {
        width: 16px;
        height: 16px;
        fill: currentColor;
      }

      .path-image {
        margin-bottom: var(--spacing-lg);
        border-radius: var(--radius-md);
        overflow: hidden;
      }

      .path-image img {
        width: 100%;
        height: auto;
        display: block;
        border-radius: var(--radius-md);
      }
    `,
    iconStyles,
  ];

  connectedCallback() {
    super.connectedCallback();

    // Require attribute passed by router (no legacy URL parsing)
    if (!this.pathIdAttr) {
      console.error("<path-page> requires path-id attribute");
      this.loading = false;
      this.error = "Missing path-id";
      return;
    }
    this.pathid = this.pathIdAttr;

    // Set up auth observer
    this._authObserver.observe((auth) => {
      console.log("🔑 Path page auth observer fired:", auth);
      const { user } = auth;

      if (user && user.authenticated) {
        console.log("✅ User authenticated in path page, loading data");
        this.user = user;
        this.loadPathData();
      } else {
        console.log("❌ User not authenticated in path page");
        this.user = null;
        this.path = null;
        this.loading = false;
        this.error = null;
      }
    });
  }

  async loadPathData() {
    try {
      console.log("🛤️ Path page loadPathData called for:", this.pathid);
      this.loading = true;
      this.error = null;

      const headers = Auth.headers(this.user);
      console.log("🔑 Auth headers from path page:", headers);

      const response = await fetch(`/api/paths/${this.pathid}`, { headers });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      this.path = await response.json();
      console.log("🎯 Path loaded:", this.path?.name);
      this.loading = false;
    } catch (error) {
      console.log("❌ Error loading path data:", error);
      this.error =
        error instanceof Error ? error.message : "Failed to load path data";
      this.loading = false;
    }
  }

  render() {
    return html` ${this.renderBreadcrumb()} ${this.renderContent()} `;
  }

  renderBreadcrumb() {
    const pathName = this.path?.name || "Path";
    const parkName = this.path?.parkName || this.path?.park || "Park";
    const parkLink = this.path?.park ? `/app/parks/${this.path.park}` : "#";

    return html`
      <nav-element>
        <span slot="breadcrumb"></span>
        <a href="/app">Adventure Guide</a> → <a href="/app/parks">Parks</a> →
        <a href="${parkLink}">${parkName}</a> →
        <span>${pathName}</span>
      </nav-element>
    `;
  }

  renderContent() {
    if (!this.user?.authenticated) {
      const currentUrl = window.location.pathname + window.location.search;
      const loginUrl = `/app/login?next=${encodeURIComponent(currentUrl)}`;
      return html`
        <div class="auth-message">
          <p>
            Please <a href="${loginUrl}" class="login-link">log in</a> to view
            path details.
          </p>
        </div>
      `;
    }

    if (this.loading) {
      return html`
        <div class="loading-message">
          <p>Loading path data...</p>
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="error-message">
          <p>Error loading path data: ${this.error}</p>
        </div>
      `;
    }

    if (!this.path) {
      return html`
        <div class="error-message">
          <p>Path not found.</p>
        </div>
      `;
    }

    const iconType = this.path.type === "road" ? "road" : "hiking";

    return html`
      <section-header
        title="${this.path.name}"
        icon="${iconType}"
        icon-size="lg"
      ></section-header>

      <div class="panel">
        ${this.renderImage()} ${this.renderDescription()}
        ${this.renderMetaInfo()}
      </div>
    `;
  }

  renderImage() {
    const imgSrc = this.path?.image || this.path?.card?.image;
    const imgAlt =
      this.path?.imageAlt || this.path?.card?.imageAlt || this.path?.name;
    if (!imgSrc) {
      return "";
    }

    return html`
      <div class="path-image">
        <img src="${imgSrc}" alt="${imgAlt}" />
      </div>
    `;
  }

  renderDescription() {
    if (!this.path?.description) {
      return "";
    }

    return html`<p class="lead">${this.path.description}</p>`;
  }

  renderMetaInfo() {
    if (!this.path) return "";

    const parkName = this.path.parkName || this.path.park;
    const iconType = this.path.type === "road" ? "icon-road" : "icon-hiking";

    return html`
      <div class="meta-row">
        <span class="chip">
          <svg class="icon icon-sm">
            <use href="/assets/icons/camping.svg#${iconType}"></use>
          </svg>
          ${this.path.type || "Path"}
        </span>
        ${parkName
          ? html`
              <span class="chip">
                <svg class="icon icon-sm">
                  <use href="/assets/icons/camping.svg#icon-forest"></use>
                </svg>
                Park: ${parkName}
              </span>
            `
          : ""}
      </div>
    `;
  }
}

export default PathPage;
