import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Observer, Auth } from "@calpoly/mustang";
import { themeTokens } from "../styles/theme-tokens.css.ts";
import { pageStyles } from "../styles/page-styles.css.ts";

interface Park {
  parkid: string;
  name: string;
  description?: string;
  card?: {
    title?: string;
    description?: string;
    image?: string;
    imageAlt?: string;
  };
}

@customElement("main-page")
class MainPage extends LitElement {
  @state()
  parks: Park[] = [];

  @state()
  loading = true;

  @state()
  error: string | null = null;

  @state()
  authenticated = false;

  @state()
  user: any = null;

  _authObserver: Observer<Auth.Model> = new Observer(this, "natty:auth");

  static styles = [
    themeTokens,
    ...pageStyles,
    css`
      :host {
        display: block;
      }

      .parks-section {
        grid-column: 1 / -1;
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

      /* Style the browse all parks link like the other card-style links */
      .browse-link {
        display: block;
        background-color: var(--color-background-section);
        padding: var(--spacing-lg) var(--spacing-xl);
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border);
        margin: var(--spacing-lg) 0;
        transition: all 0.2s ease;
        color: var(--color-link);
        text-decoration: underline;
        text-decoration-color: var(--color-link);
        text-underline-offset: 2px;
        font-weight: var(--font-weight-semibold);
      }

      .browse-link:hover {
        border-color: var(--color-accent);
        background-color: var(--color-background-card);
        text-decoration: none;
        transform: translateY(-1px);
        box-shadow: var(--shadow-md);
        color: var(--color-link-hover);
      }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();

    // Set up auth observer
    this._authObserver.observe((auth) => {
      console.log("🔑 Main page auth observer fired:", auth);
      const { user } = auth;

      if (user && user.authenticated) {
        console.log("✅ User authenticated in main page, loading parks");
        this.authenticated = true;
        this.user = user;
        this.loadParks();
      } else {
        console.log("❌ User not authenticated in main page");
        this.authenticated = false;
        this.user = null;
        this.parks = [];
        this.loading = false;
        this.error = null;
      }
    });
  }

  async loadParks() {
    try {
      console.log("🏞️ Main page loadParks called");
      this.loading = true;
      this.error = null;

      const headers = Auth.headers(this.user);
      console.log("🔑 Auth headers from main page:", headers);

      const response = await fetch("/api/parks", { headers });
      console.log("📨 Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      this.parks = await response.json();
      console.log("🎯 Parks loaded in main page:", this.parks);
      this.loading = false;
    } catch (error) {
      console.log("❌ Error loading parks in main page:", error);
      this.error =
        error instanceof Error ? error.message : "Failed to load parks";
      this.loading = false;
    }
  }

  render() {
    return html`
      <section class="parks-section">
        <section-header title="Parks" icon="forest"></section-header>
        <p style="margin-bottom: var(--spacing-md)">
          <a href="parks/" class="browse-link">Browse all parks</a>
        </p>
        <div id="home-parks-container">${this.renderParksContent()}</div>
      </section>

      <section class="parks-section">
        <section-header
          title="Trips & Itineraries"
          icon="route"
        ></section-header>
        <p style="margin-bottom: var(--spacing-md)">
          Plan your next adventure with our curated trip itineraries or create
          your own.
        </p>
        <card-grid columns="repeat(auto-fit, minmax(300px, 1fr))">
          <card-element
            title="Browse All Trips"
            description="Explore pre-planned trips to national parks"
            href="/app/trips"
            clickable
          ></card-element>
          <card-element
            title="View Itineraries"
            description="Detailed day-by-day itineraries for popular trips"
            href="/app/trips/itinerary"
            clickable
          ></card-element>
          <card-element
            title="Yellowstone Summer"
            description="7-day summer adventure through Yellowstone"
            href="/app/trips/yell-summer"
            clickable
          ></card-element>
          <card-element
            title="Yosemite Fall Colors"
            description="4-day fall trip to experience Yosemite's autumn beauty"
            href="/app/trips/yose-fall"
            clickable
          ></card-element>
        </card-grid>
      </section>
    `;
  }

  renderParksContent() {
    if (this.loading) {
      return html`
        <div class="loading-message">
          <p>Loading parks...</p>
        </div>
      `;
    }

    if (this.error) {
      if (this.error.includes("401")) {
        return html`
          <div class="auth-message">
            <p>
              Please <a href="/app/login" class="login-link">log in</a> to view
              parks and plan your adventure.
            </p>
          </div>
        `;
      } else {
        return html`
          <div class="error-message">
            <p>Error loading parks: ${this.error}</p>
          </div>
        `;
      }
    }

    if (this.parks.length === 0) {
      return html`
        <div class="auth-message">
          <p>
            Please <a href="/app/login" class="login-link">log in</a> to view
            parks and plan your adventure.
          </p>
        </div>
      `;
    }

    return html`
      <card-grid id="home-parks" columns="repeat(auto-fit, minmax(300px, 1fr))">
        ${this.parks.map(
          (park) => html`
            <card-element
              title="${park.card?.title || park.name}"
              description="${park.card?.description || park.description || ""}"
              href="/app/parks/${park.parkid}"
              clickable
              image="${park.card?.image || ""}"
              image-alt="${park.card?.imageAlt || park.name}"
            ></card-element>
          `
        )}
      </card-grid>
    `;
  }
}

export default MainPage;
