import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Observer, Auth } from "@calpoly/mustang";

interface Park {
  parkid: string;
  name: string;
  description?: string;
  location?: string;
  established?: string;
  size?: string;
}

interface Campsite {
  siteid: string;
  name: string;
  description?: string;
  card?: {
    title?: string;
    description?: string;
    image?: string;
    imageAlt?: string;
  };
}

interface POI {
  poiid: string;
  name: string;
  description?: string;
  card?: {
    title?: string;
    description?: string;
    image?: string;
    imageAlt?: string;
  };
}

interface Path {
  pathid: string;
  name: string;
  description?: string;
  type: "road" | "trail";
  card?: {
    title?: string;
    description?: string;
    image?: string;
    imageAlt?: string;
  };
  image?: string;
  imageAlt?: string;
}

@customElement("park-page")
class ParkPage extends LitElement {
  @state()
  private _park: Park | null = null;

  @state()
  private _campsites: Campsite[] = [];

  @state()
  private _poi: POI[] = [];

  @state()
  private _paths: Path[] = [];

  @state()
  private _loading = true;

  @state()
  private _error: string | null = null;

  @state()
  private _user: any = null;

  parkid: string = "";

  _authObserver: Observer<Auth.Model> = new Observer(this, "natty:auth");

  // Getters for properties
  get park() {
    return this._park;
  }
  set park(value: Park | null) {
    this._park = value;
  }

  get campsites() {
    return this._campsites;
  }
  set campsites(value: Campsite[]) {
    this._campsites = value;
  }

  get poi() {
    return this._poi;
  }
  set poi(value: POI[]) {
    this._poi = value;
  }

  get paths() {
    return this._paths;
  }
  set paths(value: Path[]) {
    this._paths = value;
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

      .lead {
        margin-bottom: var(--spacing-xl);
        color: var(--color-text-light);
      }

      .meta-row {
        display: flex;
        gap: var(--spacing-sm);
        flex-wrap: wrap;
        margin-bottom: var(--spacing-md);
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
        background: var(--color-background-card);
      }

      .icon-sm {
        width: 16px;
        height: 16px;
        fill: currentColor;
      }

      h2 {
        margin-top: var(--spacing-xl);
      }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();

    // Extract parkid from URL path: /parks/{parkid}/
    this.parkid = location.pathname.split("/").filter(Boolean)[1] || "";

    // Set up auth observer
    this._authObserver.observe((auth) => {
      console.log("🔑 Park page auth observer fired:", auth);
      const { user } = auth;

      if (user && user.authenticated) {
        console.log("✅ User authenticated in park page, loading data");
        this.user = user;
        this.loadParkData();
      } else {
        console.log("❌ User not authenticated in park page");
        this.user = null;
        this.park = null;
        this.campsites = [];
        this.poi = [];
        this.paths = [];
        this.loading = false;
        this.error = null;
      }
    });
  }

  async loadParkData() {
    try {
      console.log("🏞️ Park page loadParkData called for:", this.parkid);
      this.loading = true;
      this.error = null;

      const headers = Auth.headers(this.user);
      console.log("🔑 Auth headers from park page:", headers);

      // Load park details
      const parkResponse = await fetch(`/api/parks/${this.parkid}`, {
        headers,
      });
      if (parkResponse.ok) {
        this.park = await parkResponse.json();
        console.log("🎯 Park loaded:", this.park?.name);
      }

      // Load campsites for this park
      const campsitesResponse = await fetch(
        `/api/campsites?park=${encodeURIComponent(this.parkid)}`,
        { headers }
      );
      if (campsitesResponse.ok) {
        this.campsites = await campsitesResponse.json();
        console.log("🏕️ Campsites loaded:", this.campsites.length);
      }

      // Load POI for this park
      const poiResponse = await fetch(
        `/api/poi?park=${encodeURIComponent(this.parkid)}`,
        { headers }
      );
      if (poiResponse.ok) {
        this.poi = await poiResponse.json();
        console.log("📍 POI loaded:", this.poi.length);
      }

      // Load paths for this park
      const pathsResponse = await fetch(
        `/api/paths?park=${encodeURIComponent(this.parkid)}`,
        { headers }
      );
      if (pathsResponse.ok) {
        this.paths = await pathsResponse.json();
        console.log("🛤️ Paths loaded:", this.paths.length);
      }

      this.loading = false;
    } catch (error) {
      console.log("❌ Error loading park data:", error);
      this.error =
        error instanceof Error ? error.message : "Failed to load park data";
      this.loading = false;
    }
  }

  get roads() {
    return this.paths.filter((p) => p.type === "road");
  }

  get trails() {
    return this.paths.filter((p) => p.type === "trail");
  }

  render() {
    return html` ${this.renderBreadcrumb()} ${this.renderContent()} `;
  }

  renderBreadcrumb() {
    const parkName = this.park?.name || "Park";
    return html`
      <nav-element>
        <span slot="breadcrumb"></span>
        <a href="/index.html">Adventure Guide</a> →
        <a href="/parks/index.html">Parks</a> →
        <span id="park-name">${parkName}</span>
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
            park details.
          </p>
        </div>
      `;
    }

    if (this.loading) {
      return html`
        <div class="loading-message">
          <p>Loading park data...</p>
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="error-message">
          <p>Error loading park data: ${this.error}</p>
        </div>
      `;
    }

    if (!this.park) {
      return html`
        <div class="error-message">
          <p>Park not found.</p>
        </div>
      `;
    }

    return html`
      <section-header
        title="${this.park.name}"
        subtitle="${this.park.location} • Est. ${this.park.established} • ${this
          .park.size}"
      ></section-header>

      <div class="meta-row">
        <span class="chip">
          <svg class="icon icon-sm">
            <use href="/assets/icons/camping.svg#icon-forest"></use>
          </svg>
          ${this.park.location}
        </span>
        <span class="chip">
          <svg class="icon icon-sm">
            <use href="/assets/icons/camping.svg#icon-calendar"></use>
          </svg>
          Est. ${this.park.established}
        </span>
        <span class="chip">
          <svg class="icon icon-sm">
            <use href="/assets/icons/camping.svg#icon-tent"></use>
          </svg>
          ${this.park.size}
        </span>
      </div>

      <p class="lead">${this.park.description || ""}</p>

      <h2>Campsites</h2>
      ${this.renderCampsites()}

      <h2>Points of Interest</h2>
      ${this.renderPOI()}

      <h2>Paths</h2>
      <section id="roads">
        <section-header
          title="Scenic Roads"
          subtitle="Drive-through vistas and major connectors"
        ></section-header>
        ${this.renderRoads()}
      </section>
      <section id="trails">
        <section-header
          title="Trails"
          subtitle="Hiking routes and backcountry access"
        ></section-header>
        ${this.renderTrails()}
      </section>
    `;
  }

  renderCampsites() {
    if (this.campsites.length === 0) {
      return html`<p>No campsites available.</p>`;
    }

    return html`
      <card-grid columns="repeat(auto-fit, minmax(350px, 1fr))" max-columns="3">
        ${this.campsites.map(
          (campsite) => html`
            <card-element
              title="${campsite.card?.title || campsite.name}"
              description="${campsite.card?.description ||
              campsite.description ||
              ""}"
              href="/campsites/${campsite.siteid}.html"
              clickable
              image="${campsite.card?.image || ""}"
              image-alt="${campsite.card?.imageAlt || campsite.name}"
            ></card-element>
          `
        )}
      </card-grid>
    `;
  }

  renderPOI() {
    if (this.poi.length === 0) {
      return html`<p>No points of interest available.</p>`;
    }

    return html`
      <card-grid columns="repeat(auto-fit, minmax(350px, 1fr))" max-columns="3">
        ${this.poi.map(
          (poi) => html`
            <card-element
              title="${poi.card?.title || poi.name}"
              description="${poi.card?.description || poi.description || ""}"
              href="/poi/${poi.poiid}.html"
              clickable
              image="${poi.card?.image || ""}"
              image-alt="${poi.card?.imageAlt || poi.name}"
            ></card-element>
          `
        )}
      </card-grid>
    `;
  }

  renderRoads() {
    if (this.roads.length === 0) {
      return html`<p>No scenic roads available.</p>`;
    }

    return html`
      <card-grid columns="repeat(auto-fit, minmax(350px, 1fr))" max-columns="3">
        ${this.roads.map((road) => this.renderPath(road))}
      </card-grid>
    `;
  }

  renderTrails() {
    if (this.trails.length === 0) {
      return html`<p>No trails available.</p>`;
    }

    return html`
      <card-grid columns="repeat(auto-fit, minmax(350px, 1fr))" max-columns="3">
        ${this.trails.map((trail) => this.renderPath(trail))}
      </card-grid>
    `;
  }

  renderPath(path: Path) {
    const hasImage = path.card?.image || path.image;

    if (hasImage) {
      return html`
        <card-element
          title="${path.card?.title || path.name}"
          description="${path.card?.description || path.description || ""}"
          href="/paths/${path.pathid}.html"
          clickable
          image="${path.card?.image || path.image}"
          image-alt="${path.card?.imageAlt || path.imageAlt || path.name}"
        ></card-element>
      `;
    } else {
      // For paths without images, we'll render with icon slot
      return html`
        <card-element
          title="${path.card?.title || path.name}"
          description="${path.card?.description || path.description || ""}"
          href="/paths/${path.pathid}.html"
          clickable
        >
          <svg slot="icon" class="icon icon-md">
            <use
              href="${path.type === "road"
                ? "/assets/icons/camping.svg#icon-road"
                : "/assets/icons/camping.svg#icon-hiking"}"
            ></use>
          </svg>
        </card-element>
      `;
    }
  }
}

export default ParkPage;
