import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Observer, Auth } from "@calpoly/mustang";
import { iconStyles } from "../styles/icon-styles.css.ts";
import { themeTokens } from "../styles/theme-tokens.css.ts";
import { pageStyles } from "../styles/page-styles.css.ts";
import "../components/card.ts";

interface Itinerary {
  itineraryid: string;
  tripid: string;
  tripName: string;
  day: number;
  date: string;
  activities: Array<{
    time: string;
    activity: string;
    location: string;
    description?: string;
    pathId?: string;
    poiId?: string;
    campsiteId?: string;
  }>;
  campsiteId?: string;
  campsiteName?: string;
  notes?: string;
  card: {
    title: string;
    description: string;
    href: string;
  };
}

@customElement("trip-view")
class TripViewElement extends LitElement {
  slug: string = "";

  @state()
  itineraries: Itinerary[] = [];

  @state()
  loading = true;

  @state()
  error: string | null = null;

  @state()
  user: any = null;

  _authObserver: Observer<Auth.Model> = new Observer(this, "natty:auth");

  static get observedAttributes() {
    return ["slug"];
  }

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null
  ) {
    if (name === "slug" && value !== null) {
      this.slug = value;
      this.requestUpdate();
      if (this.user) {
        this.loadItineraries();
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();

    this._authObserver.observe(({ user }) => {
      if (user) {
        this.user = user;
        // Load itineraries if slug is already set
        if (this.slug) {
          this.loadItineraries();
        }
      } else {
        this.user = null;
        this.loading = false;
      }
    });
  }

  async loadItineraries() {
    if (!this.slug) {
      console.log("⚠️ No slug set, skipping itinerary load");
      return;
    }

    try {
      console.log("📅 Loading itineraries for trip:", this.slug);
      this.loading = true;
      this.error = null;

      const headers = Auth.headers(this.user);
      const response = await fetch(`/api/itineraries?trip=${this.slug}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      this.itineraries = await response.json();
      console.log("✅ Loaded", this.itineraries.length, "itineraries");
      this.loading = false;
    } catch (error) {
      console.log("❌ Error loading itineraries:", error);
      this.error =
        error instanceof Error ? error.message : "Failed to load itineraries";
      this.loading = false;
    }
  }

  static styles = [
    themeTokens,
    iconStyles,
    ...pageStyles,
    css`
      :host {
        display: block;
      }

      .activity-list {
        list-style: none;
        padding: 0;
        margin: var(--spacing-md) 0;
      }

      .activity-item {
        display: flex;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm) 0;
        border-bottom: 1px solid var(--color-border-light);
      }

      .activity-item:last-child {
        border-bottom: none;
      }

      .activity-time {
        font-weight: var(--font-weight-semibold);
        color: var(--color-primary);
        min-width: 80px;
        flex-shrink: 0;
      }

      .loading-message,
      .error-message {
        text-align: center;
        padding: var(--spacing-lg);
      }

      .quick-links {
        padding: var(--spacing-lg);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        background: var(--color-surface);
      }

      .quick-links h4 {
        margin-top: 0;
      }

      .quick-links ul {
        list-style: none;
        padding: 0;
      }

      .quick-links li {
        padding: var(--spacing-xs) 0;
      }

      /* Override pageStyles for links to ensure they're styled */
      .quick-links a {
        color: var(--color-link);
        text-decoration: underline;
        text-decoration-color: var(--color-link);
        text-underline-offset: 2px;
        font-weight: var(--font-weight-semibold);
        transition: all 0.2s ease;
      }

      .quick-links a:hover {
        color: var(--color-link-hover);
        text-decoration-color: var(--color-link-hover);
      }

      .quick-links a:visited {
        color: var(--color-link-visited);
      }
    `,
  ];

  render() {
    const title = this.prettyTitle(this.slug);
    const tripName =
      this.itineraries.length > 0 ? this.itineraries[0].tripName : title;

    return html`
      <nav-element>
        <span slot="breadcrumb"></span>
        <a href="/app">Adventure Guide</a> → <a href="/app/trips">Trips</a> →
        <span>${tripName}</span>
      </nav-element>

      <section-header title="${tripName}" icon="route"></section-header>

      ${this.renderItineraries()}

      <div class="quick-links">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="/app/trips">All Trips</a></li>
          <li><a href="/app/parks">Parks</a></li>
          <li><a href="/app/paths">Paths</a></li>
          <li><a href="/app/poi">Points of Interest</a></li>
        </ul>
      </div>
    `;
  }

  renderItineraries() {
    if (this.loading) {
      return html`<div class="loading-message">Loading itinerary...</div>`;
    }

    if (this.error) {
      return html`<div class="error-message">Error: ${this.error}</div>`;
    }

    if (this.itineraries.length === 0) {
      return html`
        <p class="muted">
          No itinerary found for this trip. Check back later for updates!
        </p>
      `;
    }

    return html`
      <card-grid gap="var(--spacing-xl)">
        ${this.itineraries.map(
          (itinerary) => html`
            <card-element
              .title="${itinerary.card.title}"
              .description="${html`
                <div>
                  <p><strong>Date:</strong> ${itinerary.date}</p>
                  ${itinerary.campsiteId && itinerary.campsiteName
                    ? html`<p>
                        <strong>Campsite:</strong>
                        <a href="/app/campsites/${itinerary.campsiteId}"
                          >${itinerary.campsiteName}</a
                        >
                      </p>`
                    : ""}

                  <h4>Activities:</h4>
                  <ul class="activity-list">
                    ${itinerary.activities.map((activity) => {
                      const locationContent = activity.pathId
                        ? html`<a href="/app/paths/${activity.pathId}"
                            >${activity.location}</a
                          >`
                        : activity.poiId
                        ? html`<a href="/app/poi/${activity.poiId}"
                            >${activity.location}</a
                          >`
                        : activity.campsiteId
                        ? html`<a href="/app/campsites/${activity.campsiteId}"
                            >${activity.location}</a
                          >`
                        : activity.location;

                      return html`
                        <li class="activity-item">
                          <span class="activity-time">${activity.time}</span>
                          <div>
                            <strong>${activity.activity}</strong> at
                            ${locationContent}
                            ${activity.description
                              ? html`<br /><em>${activity.description}</em>`
                              : ""}
                          </div>
                        </li>
                      `;
                    })}
                  </ul>

                  ${itinerary.notes
                    ? html`<p><strong>Notes:</strong> ${itinerary.notes}</p>`
                    : ""}
                </div>
              `}"
            >
            </card-element>
          `
        )}
      </card-grid>
    `;
  }

  prettyTitle(slug?: string) {
    if (!slug) return "Trip";
    return slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
}

export default TripViewElement;
