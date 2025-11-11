import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Observer, Auth } from "@calpoly/mustang";

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

@customElement("parks-listing")
class ParksListing extends LitElement {
  @state()
  parks: Park[] = [];

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
      console.log("🔑 Parks listing auth observer fired:", auth);
      const { user } = auth;

      if (user && user.authenticated) {
        console.log("✅ User authenticated in parks listing, loading parks");
        this.user = user;
        this.loadParks();
      } else {
        console.log("❌ User not authenticated in parks listing");
        this.user = null;
        this.parks = [];
        this.loading = false;
        this.error = null;
      }
    });
  }

  async loadParks() {
    try {
      console.log("🏞️ Parks listing loadParks called");
      this.loading = true;
      this.error = null;

      const headers = Auth.headers(this.user);
      console.log("🔑 Auth headers from parks listing:", headers);

      const response = await fetch("/api/parks", { headers });
      console.log("📨 Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      this.parks = await response.json();
      console.log(
        "🎯 Parks loaded in parks listing:",
        this.parks.length,
        "parks"
      );
      this.loading = false;
    } catch (error) {
      console.log("❌ Error loading parks in parks listing:", error);
      this.error =
        error instanceof Error ? error.message : "Failed to load parks";
      this.loading = false;
    }
  }

  render() {
    return html` <div id="parks-container">${this.renderParksContent()}</div> `;
  }

  renderParksContent() {
    if (!this.user?.authenticated) {
      return html`
        <div class="auth-message">
          <p>
            Please <a href="../login.html" class="login-link">log in</a> to view
            parks.
          </p>
        </div>
      `;
    }

    if (this.loading) {
      return html`
        <div class="loading-message">
          <p>Loading parks...</p>
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="error-message">
          <p>Error loading parks: ${this.error}</p>
        </div>
      `;
    }

    if (this.parks.length === 0) {
      return html`
        <div class="auth-message">
          <p>No parks available.</p>
        </div>
      `;
    }

    return html`
      <card-grid id="parks" columns="repeat(auto-fit, minmax(350px, 1fr))">
        ${this.parks.map(
          (park) => html`
            <card-element
              title="${park.card?.title || park.name}"
              description="${park.card?.description || park.description || ""}"
              href="/parks/${park.parkid}/index.html"
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

export default ParksListing;
