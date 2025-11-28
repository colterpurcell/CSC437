import { LitElement, html, css } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { Observer, Auth } from "@calpoly/mustang";
import { iconStyles } from "../styles/icon-styles.css.ts";
import { themeTokens } from "../styles/theme-tokens.css.ts";
import { pageStyles } from "../styles/page-styles.css.ts";

interface POI {
  poiid: string;
  name: string;
  description?: string;
  type?: string;
  park?: string;
  parkName?: string;
  image?: string;
  imageAlt?: string;
  card?: {
    image?: string;
    imageAlt?: string;
  };
}

@customElement("poi-page")
class POIPage extends LitElement {
  @property({ attribute: "poi-id" })
  poiIdAttr?: string;
  @state()
  private _poi: POI | null = null;

  @state()
  private _loading = true;

  @state()
  private _error: string | null = null;

  @state()
  private _user: any = null;

  poiid: string = "";

  _authObserver: Observer<Auth.Model> = new Observer(this, "natty:auth");

  // Getters for properties
  get poi() {
    return this._poi;
  }
  set poi(value: POI | null) {
    this._poi = value;
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

      .poi-image {
        margin-bottom: var(--spacing-lg);
        border-radius: var(--radius-md);
        overflow: hidden;
      }

      .poi-image img {
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
    if (!this.poiIdAttr) {
      console.error("<poi-page> requires poi-id attribute");
      this.loading = false;
      this.error = "Missing poi-id";
      return;
    }
    this.poiid = this.poiIdAttr;

    // Set up auth observer
    this._authObserver.observe((auth) => {
      console.log("🔑 POI page auth observer fired:", auth);
      const { user } = auth;

      if (user && user.authenticated) {
        console.log("✅ User authenticated in POI page, loading data");
        this.user = user;
        this.loadPOIData();
      } else {
        console.log("❌ User not authenticated in POI page");
        this.user = null;
        this.poi = null;
        this.loading = false;
        this.error = null;
      }
    });
  }

  async loadPOIData() {
    try {
      console.log("📍 POI page loadPOIData called for:", this.poiid);
      this.loading = true;
      this.error = null;

      const headers = Auth.headers(this.user);
      console.log("🔑 Auth headers from POI page:", headers);

      const response = await fetch(`/api/poi/${this.poiid}`, { headers });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      this.poi = await response.json();
      console.log("🎯 POI loaded:", this.poi?.name);
      this.loading = false;
    } catch (error) {
      console.log("❌ Error loading POI data:", error);
      this.error =
        error instanceof Error ? error.message : "Failed to load POI data";
      this.loading = false;
    }
  }

  render() {
    return html` ${this.renderBreadcrumb()} ${this.renderContent()} `;
  }

  renderBreadcrumb() {
    const poiName = this.poi?.name || "Point of Interest";
    const parkName = this.poi?.parkName || this.poi?.park || "Park";
    const parkLink = this.poi?.park ? `/app/parks/${this.poi.park}` : "#";

    return html`
      <nav-element>
        <span slot="breadcrumb"></span>
        <a href="/app">Adventure Guide</a> → <a href="/app/parks">Parks</a> →
        <a href="${parkLink}">${parkName}</a> →
        <span>${poiName}</span>
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
            point of interest details.
          </p>
        </div>
      `;
    }

    if (this.loading) {
      return html`
        <div class="loading-message">
          <p>Loading POI data...</p>
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="error-message">
          <p>Error loading POI data: ${this.error}</p>
        </div>
      `;
    }

    if (!this.poi) {
      return html`
        <div class="error-message">
          <p>Point of interest not found.</p>
        </div>
      `;
    }

    const iconType = this.poi.type === "campground" ? "tent" : "pin";

    return html`
      <section-header
        title="${this.poi.name}"
        icon="${iconType}"
        icon-size="lg"
      ></section-header>

      ${this.renderImage()}

      <div class="panel">
        ${this.renderDescription()} ${this.renderMetaInfo()}
      </div>
    `;
  }

  renderDescription() {
    if (!this.poi?.description) {
      return "";
    }

    return html`<p class="lead">${this.poi.description}</p>`;
  }

  renderMetaInfo() {
    if (!this.poi) return "";

    const parkName = this.poi.parkName || this.poi.park;

    return html`
      <div class="meta-row">
        <span class="chip">
          <svg class="icon icon-sm">
            <use href="/assets/icons/camping.svg#icon-pin"></use>
          </svg>
          ${this.poi.type || "Point of Interest"}
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

  renderImage() {
    const imgSrc = this.poi?.image || this.poi?.card?.image;
    const imgAlt =
      this.poi?.imageAlt || this.poi?.card?.imageAlt || this.poi?.name;
    if (!imgSrc) return "";

    return html`
      <div class="poi-image">
        <img src="${imgSrc}" alt="${imgAlt}" />
      </div>
    `;
  }
}

export default POIPage;
