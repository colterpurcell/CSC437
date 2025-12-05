import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Observer, Auth } from "@calpoly/mustang";
import { iconStyles } from "../styles/icon-styles.css.ts";
import { themeTokens } from "../styles/theme-tokens.css.ts";
import { pageStyles } from "../styles/page-styles.css.ts";

interface Itinerary {
  itineraryid: string;
  tripid: string;
  tripName: string;
  owner?: string;
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

@customElement("trips-view")
class TripsViewElement extends LitElement {
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

  async deleteTrip(tripid: string) {
    if (!this.user) return;
    const confirmDelete = window.confirm(
      `Delete trip ${tripid} and all its itineraries? This cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      const headers = Auth.headers(this.user);
      // 1) Load all itineraries for this trip
      const listRes = await fetch(
        `/api/itineraries?trip=${encodeURIComponent(tripid)}`,
        { headers }
      );
      if (!listRes.ok) throw new Error(`List failed: HTTP ${listRes.status}`);
      const list: Itinerary[] = await listRes.json();

      // 2) Ownership check: ensure all belong to current user
      const username = (this.user as any)?.username as string | undefined;
      if (!username || !list.every((i) => i.owner === username)) {
        this.error = "You can only delete your own trips.";
        return;
      }

      // 3) Delete each itinerary by id using existing endpoint
      await Promise.all(
        list.map((i) =>
          fetch(`/api/itineraries/${encodeURIComponent(i.itineraryid)}`, {
            method: "DELETE",
            headers,
          })
        )
      );

      // 4) Update local state
      this.itineraries = this.itineraries.filter((i) => i.tripid !== tripid);
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
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
        <a href="/app">Adventure Guide</a> → <span>Trips</span>
      </nav-element>

      <section-header title="Trip Itineraries" icon="route"></section-header>
      <p>
        Browse available trips to national parks. Click on a trip to see the
        detailed day-by-day itinerary.
      </p>

      ${this.user
        ? html`<p><a href="/app/trips/new">Create a new itinerary</a></p>`
        : ""}
      ${this.renderContent()}
    `;
  }

  renderContent() {
    if (this.loading) {
      return html`
        <div class="loading-message">
          <p>Loading trips...</p>
        </div>
      `;
    }

    if (this.error) {
      if (this.error.includes("401")) {
        return html`
          <div class="auth-message">
            <p>
              Please <a href="/app/login" class="login-link">log in</a> to view
              trips.
            </p>
          </div>
        `;
      } else {
        return html`
          <div class="error-message">
            <p>Error loading trips: ${this.error}</p>
          </div>
        `;
      }
    }

    if (this.itineraries.length === 0) {
      return html`
        <div class="auth-message">
          <p>
            Please <a href="/app/login" class="login-link">log in</a> to view
            trips.
          </p>
        </div>
      `;
    }

    const tripGroups = this.groupByTrip();

    return html`
      <card-grid
        columns="repeat(auto-fit, minmax(300px, 1fr))"
        gap="var(--spacing-xl)"
      >
        ${tripGroups.map((group) => {
          const username = this.user?.username as string | undefined;
          const ownedByUser =
            !!username && group.itineraries.every((i) => i.owner === username);
          const numDays = group.itineraries.length;
          const startDate = group.itineraries[0]?.date || "";
          const endDate =
            group.itineraries[group.itineraries.length - 1]?.date || "";
          const campsite = group.itineraries[0]?.campsiteName || "";

          return html`
            <card-element
              title="${group.tripName}"
              description="${numDays} day${numDays !== 1
                ? "s"
                : ""} • ${startDate}${endDate !== startDate
                ? ` to ${endDate}`
                : ""}${campsite ? ` • ${campsite}` : ""}"
              href="/app/trips/${group.tripid}"
            >
              <div slot="footer" style="display:flex; gap: var(--spacing-sm);">
                <a class="card-link" href="/app/trips/${group.tripid}">Open</a>
                ${ownedByUser
                  ? html`<button
                      type="button"
                      @click=${() => this.deleteTrip(group.tripid)}
                      style="
                          appearance:none;
                          border:1px solid var(--color-border);
                          border-radius: var(--radius-md);
                          padding: var(--spacing-xs) var(--spacing-sm);
                          background: var(--color-danger-bg, transparent);
                          color: var(--color-danger, var(--color-text));
                          cursor: pointer;"
                    >
                      Delete Trip
                    </button>`
                  : ""}
              </div>
            </card-element>
          `;
        })}
      </card-grid>
    `;
  }
}

export default TripsViewElement;
