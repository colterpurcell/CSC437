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

interface TripGroup {
  tripid: string;
  tripName: string;
  itineraries: Itinerary[];
}

@customElement("itinerary-view")
class ItineraryViewElement extends LitElement {
  @state()
  itineraries: Itinerary[] = [];

  @state()
  loading = true;

  @state()
  error: string | null = null;

  @state()
  user: any = null;

  _authObserver: Observer<Auth.Model> = new Observer(this, "natty:auth");

  connectedCallback() {
    super.connectedCallback();

    this._authObserver.observe(({ user }) => {
      if (user) {
        this.user = user;
        this.loadItineraries();
      } else {
        this.user = null;
        this.loading = false;
      }
    });
  }

  async loadItineraries() {
    try {
      console.log("📅 Loading itineraries");
      this.loading = true;
      this.error = null;

      const headers = Auth.headers(this.user);
      const response = await fetch("/api/itineraries", { headers });

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

  groupByTrip(): TripGroup[] {
    const groups = new Map<string, TripGroup>();

    this.itineraries.forEach((itinerary) => {
      if (!groups.has(itinerary.tripid)) {
        groups.set(itinerary.tripid, {
          tripid: itinerary.tripid,
          tripName: itinerary.tripName,
          itineraries: [],
        });
      }
      groups.get(itinerary.tripid)!.itineraries.push(itinerary);
    });

    // Sort itineraries within each group by day
    groups.forEach((group) => {
      group.itineraries.sort((a, b) => a.day - b.day);
    });

    return Array.from(groups.values());
  }
  static styles = [
    themeTokens,
    ...pageStyles,
    css`
      :host {
        display: block;
        grid-column: 1 / -1;
      }

      section {
        margin-bottom: var(--spacing-xl);
      }

      .trip-group {
        margin-bottom: var(--spacing-xl);
        padding: var(--spacing-lg);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        background: var(--color-surface);
      }

      .trip-group h3 {
        margin-top: 0;
        color: var(--color-primary);
      }

      .trip-group h3 a {
        color: var(--color-link);
        text-decoration: underline;
        text-decoration-color: var(--color-link);
        text-underline-offset: 2px;
        font-weight: var(--font-weight-semibold);
        transition: all 0.2s ease;
      }

      .trip-group h3 a:hover {
        color: var(--color-link-hover);
        text-decoration-color: var(--color-link-hover);
      }

      .trip-group h3 a:visited {
        color: var(--color-link-visited);
      }

      .activity-list {
        list-style: none;
        padding: 0;
        margin: var(--spacing-sm) 0;
      }

      .activity-item {
        display: flex;
        gap: var(--spacing-sm);
        padding: var(--spacing-xs) 0;
        border-bottom: 1px solid var(--color-border-light);
      }

      .activity-item:last-child {
        border-bottom: none;
      }

      .activity-time {
        font-weight: var(--font-weight-semibold);
        color: var(--color-primary);
        min-width: 80px;
      }

      .loading-message,
      .error-message,
      .auth-message {
        text-align: center;
        padding: var(--spacing-lg);
        margin: var(--spacing-md) 0;
      }

      .auth-message {
        background-color: var(--color-background-secondary);
        border-radius: var(--radius-md);
      }

      .login-link {
        color: var(--color-link);
        text-decoration: none;
        font-weight: var(--font-weight-semibold);
      }

      .login-link:hover {
        text-decoration: underline;
      }
    `,
    iconStyles,
  ];

  render() {
    return html`
      <nav-element>
        <span slot="breadcrumb"> </span>

        <a href="/app">Adventure Guide</a> → <a href="/app/trips">Trips</a> →
        Itineraries
      </nav-element>

      <section-header
        title="Trip Itineraries"
        icon="calendar_month"
      ></section-header>
      <p>Detailed day-by-day itineraries for your adventures.</p>

      ${this.renderContent()}
    `;
  }

  renderContent() {
    if (this.loading) {
      return html`
        <div class="loading-message">
          <p>Loading itineraries...</p>
        </div>
      `;
    }

    if (this.error) {
      if (this.error.includes("401")) {
        return html`
          <div class="auth-message">
            <p>
              Please <a href="/app/login" class="login-link">log in</a> to view
              trip itineraries.
            </p>
          </div>
        `;
      } else {
        return html`
          <div class="error-message">
            <p>Error loading itineraries: ${this.error}</p>
          </div>
        `;
      }
    }

    if (this.itineraries.length === 0) {
      return html`
        <div class="auth-message">
          <p>No itineraries found. Start planning your trip!</p>
        </div>
      `;
    }

    const tripGroups = this.groupByTrip();

    return html`
      <section>
        ${tripGroups.map(
          (group) => html`
            <div class="trip-group">
              <h3>
                <a href="/app/trips/${group.tripid}">${group.tripName}</a>
              </h3>
              <p>${group.itineraries.length} days planned</p>

              <card-grid gap="var(--spacing-md)">
                ${group.itineraries.map(
                  (itinerary) => html`
                    <card-element
                      .title="${`Day ${itinerary.day}: ${itinerary.card.title}`}"
                      .description="${html`
                        <div>
                          <p><strong>Date:</strong> ${itinerary.date}</p>
                          ${itinerary.campsiteName
                            ? html`<p>
                                <strong>Campsite:</strong>
                                ${itinerary.campsiteName}
                              </p>`
                            : ""}

                          <h5>Activities:</h5>
                          <ul class="activity-list">
                            ${itinerary.activities.map(
                              (activity) => html`
                                <li class="activity-item">
                                  <span class="activity-time"
                                    >${activity.time}</span
                                  >
                                  <div>
                                    <strong>${activity.activity}</strong> at
                                    ${activity.location}
                                    ${activity.description
                                      ? html`<br /><em
                                            >${activity.description}</em
                                          >`
                                      : ""}
                                  </div>
                                </li>
                              `
                            )}
                          </ul>

                          ${itinerary.notes
                            ? html`<p>
                                <strong>Notes:</strong> ${itinerary.notes}
                              </p>`
                            : ""}
                        </div>
                      `}"
                    >
                    </card-element>
                  `
                )}
              </card-grid>
            </div>
          `
        )}
      </section>
    `;
  }
}

export default ItineraryViewElement;
