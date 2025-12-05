import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Observer, Auth } from "@calpoly/mustang";

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
    title?: string;
    description?: string;
    href?: string;
    image?: string;
    imageAlt?: string;
  };
}

@customElement("paths-listing")
class PathsListing extends LitElement {
  @state()
  paths: Path[] = [];

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
        this.loadPaths();
      } else {
        this.user = null;
        this.paths = [];
        this.loading = false;
        this.error = null;
      }
    });
  }

  async loadPaths() {
    try {
      this.loading = true;
      this.error = null;

      const headers = Auth.headers(this.user);
      const response = await fetch("/api/paths", { headers });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      this.paths = await response.json();
      this.loading = false;
    } catch (error) {
      this.error =
        error instanceof Error ? error.message : "Failed to load paths";
      this.loading = false;
    }
  }

  render() {
    return html` <div id="paths-container">${this.renderContent()}</div> `;
  }

  renderContent() {
    if (!this.user?.authenticated) {
      return html`
        <div class="auth-message">
          <p>
            Please <a href="/app/login" class="login-link">log in</a> to view
            paths.
          </p>
        </div>
      `;
    }

    if (this.loading) {
      return html`
        <div class="loading-message">
          <p>Loading paths...</p>
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="error-message">
          <p>Error loading paths: ${this.error}</p>
        </div>
      `;
    }

    if (this.paths.length === 0) {
      return html`
        <div class="auth-message">
          <p>No paths available.</p>
        </div>
      `;
    }

    return html`
      <card-grid id="paths" columns="repeat(auto-fit, minmax(350px, 1fr))">
        ${this.paths.map((path) => {
          const title = path.card?.title || path.name;
          const description = path.card?.description || path.description || "";
          // Always use SPA route to avoid legacy .html links from seed data
          const href = `/app/paths/${path.pathid}`;
          const image = path.card?.image || path.image || "";
          const imageAlt = path.card?.imageAlt || path.imageAlt || path.name;

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

export default PathsListing;
