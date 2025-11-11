import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Observer, Auth } from "@calpoly/mustang";

interface ConnectedPath {
  pathId: string;
  pathName: string;
  pathType: "road" | "trail";
}

interface NearbyPoi {
  poiId: string;
  poiName: string;
}

interface Campsite {
  siteid: string;
  name: string;
  description?: string;
  location?: string;
  capacity?: number;
  card?: {
    image?: string;
    imageAlt?: string;
  };
  connectedPaths?: ConnectedPath[];
  nearbyPoi?: NearbyPoi[];
}

@customElement("campsite-page")
class CampsitePage extends LitElement {
  @state()
  private _campsite: Campsite | null = null;

  @state()
  private _loading = true;

  @state()
  private _error: string | null = null;

  @state()
  private _user: any = null;

  siteid: string = "";

  _authObserver: Observer<Auth.Model> = new Observer(this, "natty:auth");

  // Getters for properties
  get campsite() {
    return this._campsite;
  }
  set campsite(value: Campsite | null) {
    this._campsite = value;
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

      .meta-row,
      .chip-row {
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
        text-decoration: none;
      }

      .chip:hover {
        background: var(--color-background-hover);
      }

      .icon-sm {
        width: 16px;
        height: 16px;
        fill: currentColor;
      }

      .muted {
        color: var(--color-text-light);
      }

      .campsite-image {
        margin-bottom: var(--spacing-lg);
        border-radius: var(--radius-md);
        overflow: hidden;
      }

      .campsite-image img {
        width: 100%;
        height: auto;
        display: block;
        border-radius: var(--radius-md);
      }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();

    // Extract siteid from URL path: /campsites/{siteid}.html
    const parts = location.pathname.split("/").filter(Boolean);
    const siteidWithExt = parts[1];
    this.siteid = siteidWithExt?.replace(/\.html$/, "") || "";

    // Set up auth observer
    this._authObserver.observe((auth) => {
      console.log("🔑 Campsite page auth observer fired:", auth);
      const { user } = auth;

      if (user && user.authenticated) {
        console.log("✅ User authenticated in campsite page, loading data");
        this.user = user;
        this.loadCampsiteData();
      } else {
        console.log("❌ User not authenticated in campsite page");
        this.user = null;
        this.campsite = null;
        this.loading = false;
        this.error = null;
      }
    });
  }

  async loadCampsiteData() {
    try {
      console.log("🏕️ Campsite page loadCampsiteData called for:", this.siteid);
      this.loading = true;
      this.error = null;

      const headers = Auth.headers(this.user);
      console.log("🔑 Auth headers from campsite page:", headers);

      const response = await fetch(`/api/campsites/${this.siteid}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      this.campsite = await response.json();
      console.log("🎯 Campsite loaded:", this.campsite?.name);
      this.loading = false;
    } catch (error) {
      console.log("❌ Error loading campsite data:", error);
      this.error =
        error instanceof Error ? error.message : "Failed to load campsite data";
      this.loading = false;
    }
  }

  render() {
    return html` ${this.renderBreadcrumb()} ${this.renderContent()} `;
  }

  renderBreadcrumb() {
    const campsiteName = this.campsite?.name || "Campsite";
    return html`
      <nav-element>
        <span slot="breadcrumb"></span>
        <a href="/index.html">Adventure Guide</a> →
        <a href="/parks/index.html">Parks</a> →
        <span id="campsite-name">${campsiteName}</span>
      </nav-element>
    `;
  }

  renderContent() {
    if (!this.user?.authenticated) {
      const currentUrl = window.location.pathname + window.location.search;
      const loginUrl = `/login.html?next=${encodeURIComponent(currentUrl)}`;
      return html`
        <div class="auth-message">
          <p>
            Please <a href="${loginUrl}" class="login-link">log in</a> to view
            campsite details.
          </p>
        </div>
      `;
    }

    if (this.loading) {
      return html`
        <div class="loading-message">
          <p>Loading campsite data...</p>
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="error-message">
          <p>Error loading campsite data: ${this.error}</p>
        </div>
      `;
    }

    if (!this.campsite) {
      return html`
        <div class="error-message">
          <p>Campsite not found.</p>
        </div>
      `;
    }

    return html`
      <section-header
        title="${this.campsite.name}"
        subtitle="${this.campsite.location} • Capacity: ${this.campsite
          .capacity}"
      ></section-header>

      ${this.renderImage()}

      <div class="panel">
        ${this.renderDescription()} ${this.renderMetaInfo()}
        ${this.renderConnectedPaths()} ${this.renderNearbyPOI()}
      </div>
    `;
  }

  renderImage() {
    if (!this.campsite?.card?.image) {
      return "";
    }

    return html`
      <div class="campsite-image">
        <img
          src="${this.campsite.card.image}"
          alt="${this.campsite.card.imageAlt || this.campsite.name}"
        />
      </div>
    `;
  }

  renderDescription() {
    if (!this.campsite?.description) {
      return "";
    }

    return html`<p class="lead">${this.campsite.description}</p>`;
  }

  renderMetaInfo() {
    if (!this.campsite) return "";

    return html`
      <div class="meta-row">
        <span class="chip">
          <svg class="icon icon-sm">
            <use href="/assets/icons/camping.svg#icon-users"></use>
          </svg>
          Capacity: ${this.campsite.capacity}
        </span>
        <span class="chip">
          <svg class="icon icon-sm">
            <use href="/assets/icons/camping.svg#icon-pin"></use>
          </svg>
          ${this.campsite.location}
        </span>
      </div>
    `;
  }

  renderConnectedPaths() {
    const paths = this.campsite?.connectedPaths || [];

    return html`
      <h3>Connected Paths</h3>
      <div class="chip-row">
        ${paths.length > 0
          ? paths.map(
              (path) => html`
                <a class="chip" href="/paths/${path.pathId}.html">
                  <svg class="icon icon-sm">
                    <use
                      href="/assets/icons/camping.svg#${path.pathType === "road"
                        ? "icon-road"
                        : "icon-hiking"}"
                    ></use>
                  </svg>
                  ${path.pathName}
                </a>
              `
            )
          : html`<span class="muted">No connected paths listed</span>`}
      </div>
    `;
  }

  renderNearbyPOI() {
    const poi = this.campsite?.nearbyPoi || [];

    return html`
      <h3 style="margin-top: var(--spacing-md)">Nearby Points of Interest</h3>
      <div class="chip-row">
        ${poi.length > 0
          ? poi.map(
              (poi) => html`
                <a class="chip" href="/poi/${poi.poiId}.html">
                  <svg class="icon icon-sm">
                    <use href="/assets/icons/camping.svg#icon-pin"></use>
                  </svg>
                  ${poi.poiName}
                </a>
              `
            )
          : html`<span class="muted">No POI listed</span>`}
      </div>
    `;
  }
}

export default CampsitePage;
