import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Observer, Auth } from "@calpoly/mustang";

interface POI {
  poiid: string;
  name: string;
  description?: string;
  park?: string;
  parkName?: string;
  type?: string;
  card?: {
    title?: string;
    description?: string;
    href?: string;
    image?: string;
    imageAlt?: string;
  };
}

@customElement("poi-listing")
class PoiListing extends LitElement {
  @state()
  pois: POI[] = [];

  @state()
  loading = true;

  @state()
  error: string | null = null;

  @state()
  user: any = null;

  _authObserver: Observer<Auth.Model> = new Observer(this, "natty:auth");

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
    `,
  ];

  connectedCallback() {
    super.connectedCallback();

    // Set up auth observer
    this._authObserver.observe((auth) => {
      const { user } = auth;

      if (user && user.authenticated) {
        this.user = user;
        this.loadPOIs();
      } else {
        this.user = null;
        this.pois = [];
        this.loading = false;
        this.error = null;
      }
    });
  }

  async loadPOIs() {
    try {
      this.loading = true;
      this.error = null;

      const headers = Auth.headers(this.user);
      const response = await fetch("/api/poi", { headers });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      this.pois = await response.json();
      this.loading = false;
    } catch (error) {
      this.error =
        error instanceof Error ? error.message : "Failed to load POIs";
      this.loading = false;
    }
  }

  render() {
    return html` <div id="poi-container">${this.renderContent()}</div> `;
  }

  renderContent() {
    if (!this.user?.authenticated) {
      return html`
        <div class="auth-message">
          <p>
            Please <a href="/app/login" class="login-link">log in</a> to view
            points of interest.
          </p>
        </div>
      `;
    }

    if (this.loading) {
      return html`
        <div class="loading-message">
          <p>Loading points of interest...</p>
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="error-message">
          <p>Error loading POIs: ${this.error}</p>
        </div>
      `;
    }

    if (this.pois.length === 0) {
      return html`
        <div class="auth-message">
          <p>No points of interest available.</p>
        </div>
      `;
    }

    return html`
      <card-grid id="poi" columns="repeat(auto-fit, minmax(350px, 1fr))">
        ${this.pois.map((poi) => {
          const title = poi.card?.title || poi.name;
          const description = poi.card?.description || poi.description || "";
          // Prefer hierarchical SPA route when park id is available
          const href = poi.park
            ? `/app/parks/${poi.park}/poi/${poi.poiid}`
            : `/app/poi/${poi.poiid}`;
          const image = poi.card?.image || "";
          const imageAlt = poi.card?.imageAlt || poi.name;

          return html`
            <card-element
              title="${title}"
              description="${description}"
              href="${href}"
              clickable
              image="${image}"
              image-alt="${imageAlt}"
            ></card-element>
          `;
        })}
      </card-grid>
    `;
  }
}

export default PoiListing;
