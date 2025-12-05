import { html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Observer, Auth, Form, define, View, History } from "@calpoly/mustang";
import { iconStyles } from "../styles/icon-styles.css.ts";
import "../components/form-section";
import { themeTokens } from "../styles/theme-tokens.css.ts";
import { pageStyles } from "../styles/page-styles.css.ts";
import { Msg } from "../messages.ts";

interface OptionItem {
  id: string;
  name: string;
}

interface ActivityDraft {
  time: string;
  activity: string;
  location: string;
  description?: string;
  pathId?: string;
  poiId?: string;
  campsiteId?: string;
}

@customElement("itinerary-create-view")
export class ItineraryCreateView extends View<any, Msg> {
  static uses = define({ "mu-form": Form.Element });
  constructor() {
    super("natty:model");
  }

  // Auth state
  user: any = null;
  _authObserver: Observer<Auth.Model> = new Observer(this, "natty:auth");

  // Form state
  @property() submitting = false;
  @property() error: string | null = null;
  @property() success: string | null = null;

  // Options
  @property() parks: OptionItem[] = [];
  @property() paths: OptionItem[] = [];
  @property() pois: OptionItem[] = [];
  @property() campsites: OptionItem[] = [];

  // Trip details
  @property() tripid = "";
  @property() tripName = "";
  @property() day = 1;
  @property() date = "";
  @property() notes = "";
  @property() parkId = "";
  @property() campsiteId = "";
  // Multi-day planning
  @property() tripLength = 1;
  @property() daysDraft: Array<{
    day: number;
    date: string;
    notes: string;
    activities: ActivityDraft[];
    draft: {
      time: string;
      activity: string;
      location: string;
      locationValue: string;
      description: string;
      selectedReferenceType: string;
      selectedReferenceId: string;
    };
  }> = [
    {
      day: 1,
      date: "",
      notes: "",
      activities: [],
      draft: {
        time: "",
        activity: "",
        location: "",
        locationValue: "",
        description: "",
        selectedReferenceType: "",
        selectedReferenceId: "",
      },
    },
  ];

  private defaultDay(dayNum: number) {
    return {
      day: dayNum,
      date: "",
      notes: "",
      activities: [],
      draft: {
        time: "",
        activity: "",
        location: "",
        locationValue: "",
        description: "",
        selectedReferenceType: "",
        selectedReferenceId: "",
      },
    };
  }

  private addDays(base: string, days: number): string {
    // base is YYYY-MM-DD
    if (!base) return "";
    const d = new Date(base + "T00:00:00");
    if (isNaN(d.getTime())) return "";
    d.setDate(d.getDate() + days);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  private updateAutoDates() {
    if (!this.date || this.tripLength < 1) return;
    this.daysDraft = this.daysDraft.map((d, i) => ({
      ...d,
      date: this.addDays(this.date, i) || d.date,
    }));
  }

  // Activities (legacy field kept for compatibility if needed)
  @property() activitiesDraft: ActivityDraft[] = [];

  connectedCallback(): void {
    super.connectedCallback();
    this._authObserver.observe(({ user }) => {
      this.user = user;
      if (user) this.loadOptions();
    });
  }

  updated(): void {
    // forcibly hide mu-form's built-in submit area because i want my own button
    const mf = this.renderRoot?.querySelector("mu-form") as
      | (HTMLElement & { shadowRoot?: ShadowRoot })
      | null;
    const sr = mf?.shadowRoot;
    if (sr) {
      const submitPart = sr.querySelector(
        '[part="submit"]'
      ) as HTMLElement | null;
      const submitBtn = sr.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement | null;
      if (submitPart) submitPart.style.display = "none";
      if (submitBtn) submitBtn.style.display = "none";
    }
  }

  async loadOptions() {
    try {
      const headers = Auth.headers(this.user);
      const [parksRes, pathsRes, poisRes, campsRes] = await Promise.all([
        fetch("/api/parks", { headers }),
        fetch("/api/paths", { headers }),
        fetch("/api/poi", { headers }),
        fetch("/api/campsites", { headers }),
      ]);
      const parksJson = await parksRes.json();
      const pathsJson = await pathsRes.json();
      const poisJson = await poisRes.json();
      const campsJson = await campsRes.json();
      this.parks = parksJson.map((p: any) => ({
        id: p.parkid || p.id,
        name: p.name,
      }));
      this.paths = pathsJson.map((p: any) => ({ id: p.pathid, name: p.name }));
      this.pois = poisJson.map((p: any) => ({ id: p.poiid, name: p.name }));
      this.campsites = campsJson.map((c: any) => ({
        id: c.siteid,
        name: c.name,
      }));
    } catch (e) {
      this.error = "Failed to load options";
    }
  }

  private async loadParkScopedOptions(parkId: string) {
    if (!parkId) return;
    try {
      const headers = Auth.headers(this.user);
      // Use query-based endpoints provided by server: /api/paths?park=ID, etc.
      const [pathsRes, poisRes, campsRes] = await Promise.all([
        fetch(`/api/paths?park=${encodeURIComponent(parkId)}`, { headers }),
        fetch(`/api/poi?park=${encodeURIComponent(parkId)}`, { headers }),
        fetch(`/api/campsites?park=${encodeURIComponent(parkId)}`, { headers }),
      ]);
      if (pathsRes.ok) {
        const pathsJson = await pathsRes.json();
        this.paths = pathsJson.map((p: any) => ({
          id: p.pathid,
          name: p.name,
        }));
      }
      if (poisRes.ok) {
        const poisJson = await poisRes.json();
        this.pois = poisJson.map((p: any) => ({ id: p.poiid, name: p.name }));
      }
      if (campsRes.ok) {
        const campsJson = await campsRes.json();
        this.campsites = campsJson.map((c: any) => ({
          id: c.siteid,
          name: c.name,
        }));
      }
    } catch (_e) {
      // Keep global lists if scoped fetch fails
    }
  }

  static styles = [
    themeTokens,
    ...pageStyles,
    iconStyles,
    css`
      /* Shell container centers content; host element of mu-form should not affect layout */
      .form-shell {
        max-width: 1040px;
        margin: 0 auto;
      }
      /* Keep mu-form as a block to avoid submit area stretching in grids */
      mu-form {
        display: block;
        margin-top: var(--spacing-lg);
      }
      /* Built-in mu-form submit UI suppressed via slot/runtime; no extra styles needed here */
      label {
        display: block;
        width: 100%;
        margin-bottom: var(--spacing-md);
        line-height: 1.25;
        white-space: normal;
      }
      select,
      input,
      textarea {
        display: block;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        padding: var(--spacing-md);
        border: 2px solid var(--color-border);
        border-radius: var(--radius-md);
      }
      fieldset {
        border: 2px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
      }
      .activity-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 2fr;
        gap: var(--spacing-md);
        align-items: end;
      }
      .sections-grid {
        display: grid;
        grid-template-columns: repeat(
          auto-fit,
          minmax(var(--section-min-col, 480px), 1fr)
        );
        gap: var(--spacing-2xl);
        align-items: start;
        margin-bottom: var(--spacing-xl);
      }
      .submit-actions {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--spacing-md);
        margin-top: var(--spacing-2xl);
        text-align: center;
      }
      .submit-actions button[type="button"],
      .submit-actions button[type="submit"],
      .submit-actions .primary-btn {
        appearance: none;
        border: none;
        border-radius: var(--radius-md);
        padding: var(--spacing-sm) var(--spacing-lg);
        background: var(--color-accent);
        color: var(--color-elevated-text);
        font-weight: 600;
        cursor: pointer;
        transition: transform 120ms ease, filter 120ms ease, opacity 120ms ease;
      }
      .submit-actions .primary-btn:hover {
        filter: brightness(1.05);
      }
      @media (max-width: 800px) {
        .activity-grid {
          grid-template-columns: 1fr 1fr;
        }
      }
      @media (max-width: 520px) {
        .activity-grid {
          grid-template-columns: 1fr;
        }
      }
      .actions {
        display: flex;
        gap: var(--spacing-md);
        align-items: center;
        flex-wrap: wrap;
      }
      .muted {
        color: var(--color-text-muted);
      }
      .activity-list {
        margin-top: var(--spacing-md);
        display: grid;
        gap: var(--spacing-sm);
      }
      .activity-list li {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
      }
      .reference-select {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: var(--spacing-sm);
        align-items: end;
      }
    `,
  ];

  render() {
    if (!this.user) {
      return html`
        <nav-element>
          <a href="/app">Adventure Guide</a> → <span>Create Trip</span>
        </nav-element>
        <section-header title="Create Trip" icon="route"></section-header>
        <p>Please <a href="/app/login">log in</a> to create an itinerary.</p>
      `;
    }

    return html`
      <nav-element>
        <a href="/app">Adventure Guide</a> → <a href="/app/trips">Trips</a> →
        <span>New</span>
      </nav-element>
      <section-header
        title="Create a Trip Itinerary"
        icon="route"
      ></section-header>
      <div class="form-shell">
        <mu-form>
          <div class="sections-grid">
            <form-section maxWidth="1040px">
              <span slot="title">Trip Details</span>
              <div slot="content">
              <label>
                <span>Trip ID</span>
                <input
                  name="tripid"
                  required
                  placeholder="e.g. yose-fall"
                  .value=${this.tripid}
                  @input=${(e: Event) =>
                    (this.tripid = (e.target as HTMLInputElement).value)}
                />
              </label>
              <label>
                <span>Park</span>
                <select
                  name="parkId"
                  .value=${this.parkId}
                  @change=${(e: Event) => {
                    this.parkId = (e.target as HTMLSelectElement).value;
                    this.loadParkScopedOptions(this.parkId);
                    // Clear location selections for all day drafts when park changes
                    this.daysDraft = this.daysDraft.map((d) => ({
                      ...d,
                      draft: {
                        ...d.draft,
                        location: "",
                        locationValue: "",
                        selectedReferenceType: "",
                        selectedReferenceId: "",
                      },
                    }));
                  }}
                >
                  <option value="">Select a park</option>
                  ${this.parks.map(
                    (p) => html`<option value=${p.id}>${p.name}</option>`
                  )}
                </select>
              </label>
              <label>
                  <span>Trip Length (days)</span>
                  <input
                    name="tripLength"
                    type="number"
                    min="1"
                    required
                    .value=${this.tripLength.toString()}
                    @input=${(e: Event) => {
                      const len =
                        parseInt((e.target as HTMLInputElement).value) || 1;
                      this.tripLength = len;
                      // Resize daysDraft to match length
                      const existing = this.daysDraft;
                      const next: typeof existing = [];
                      for (let i = 0; i < len; i++) {
                        const found = existing[i];
                        next[i] = found
                          ? { ...found, day: i + 1 }
                          : this.defaultDay(i + 1);
                      }
                      this.daysDraft = next;
                      this.updateAutoDates();
                    }}
                  />
              </label>
              <label>
                <span>Trip Name</span>
                <input
                  name="tripName"
                  required
                  placeholder="e.g. Yosemite Fall Adventure"
                  .value=${this.tripName}
                  @input=${(e: Event) =>
                    (this.tripName = (e.target as HTMLInputElement).value)}
                />
              </label>
              <label>
                <span>Start Date</span>
                <input
                  name="date"
                  type="date"
                  required
                  .value=${this.date}
                  @input=${(e: Event) => {
                    this.date = (e.target as HTMLInputElement).value;
                    this.updateAutoDates();
                  }}
                />
              </label>
              </div>
            </form-section>

            ${this.daysDraft.map(
              (d, di) => html`
                <form-section>
                  <span slot="title">Day ${d.day}</span>
                  <div slot="content">
                    <label>
                      <span>Date</span>
                      <input
                        name="date-${di}"
                        type="date"
                        .value=${d.date}
                        disabled
                      />
                    </label>
                    <label>
                      <span>Notes</span>
                      <textarea
                        name="notes-${di}"
                        rows="3"
                        placeholder="Optional notes for day ${d.day}"
                        .value=${d.notes}
                        @input=${(e: Event) => {
                          const v = (e.target as HTMLTextAreaElement).value;
                          this.daysDraft = this.daysDraft.map((dd, idx) =>
                            idx === di ? { ...dd, notes: v } : dd
                          );
                        }}
                      ></textarea>
                    </label>

                    <div class="activity-grid">
                      <label>
                        <span>Time</span>
                        <input
                          name="activityTime-${di}"
                          type="time"
                          .value=${d.draft.time}
                          @input=${(e: Event) => {
                            const v = (e.target as HTMLInputElement).value;
                            this.daysDraft = this.daysDraft.map((dd, idx) =>
                              idx === di
                                ? { ...dd, draft: { ...dd.draft, time: v } }
                                : dd
                            );
                          }}
                        />
                      </label>
                      <label>
                        <span>Activity Name</span>
                        <input
                          name="activityName-${di}"
                          placeholder="e.g. Valley Loop Drive"
                          .value=${d.draft.activity}
                          @input=${(e: Event) => {
                            const v = (e.target as HTMLInputElement).value;
                            this.daysDraft = this.daysDraft.map((dd, idx) =>
                              idx === di
                                ? { ...dd, draft: { ...dd.draft, activity: v } }
                                : dd
                            );
                          }}
                        />
                      </label>
                      <label>
                        <span>Location</span>
                        <select
                          name="activityLocation-${di}"
                          .value=${d.draft.locationValue}
                          @change=${(e: Event) => {
                            const val = (e.target as HTMLSelectElement).value;
                            const [typeAndId, name] = val.split("|");
                            const [type, id] = (typeAndId || ":").split(":");
                            this.daysDraft = this.daysDraft.map((dd, idx) =>
                              idx === di
                                ? {
                                    ...dd,
                                    draft: {
                                      ...dd.draft,
                                      selectedReferenceType:
                                        type && id && name ? type : "",
                                      selectedReferenceId:
                                        type && id && name ? id : "",
                                      location: name || val,
                                      locationValue: val,
                                    },
                                  }
                                : dd
                            );
                          }}
                        >
                          <option value="">
                            ${this.parkId
                              ? "Select a location"
                              : "Select a park first"}
                          </option>
                          ${this.parkId
                            ? [
                                ...this.paths.map(
                                  (p) =>
                                    html`<option
                                      value=${`path:${p.id}|${p.name}`}
                                    >
                                      ${p.name} (Path)
                                    </option>`
                                ),
                                ...this.pois.map(
                                  (p) =>
                                    html`<option
                                      value=${`poi:${p.id}|${p.name}`}
                                    >
                                      ${p.name} (POI)
                                    </option>`
                                ),
                                ...this.campsites.map(
                                  (c) =>
                                    html`<option
                                      value=${`campsite:${c.id}|${c.name}`}
                                    >
                                      ${c.name} (Campsite)
                                    </option>`
                                ),
                              ]
                            : []}
                        </select>
                      </label>
                    </div>
                    <label>
                      <span>Description</span>
                      <textarea
                        name="activityDescription-${di}"
                        rows="2"
                        placeholder="Optional description"
                        .value=${d.draft.description}
                        @input=${(e: Event) => {
                          const v = (e.target as HTMLTextAreaElement).value;
                          this.daysDraft = this.daysDraft.map((dd, idx) =>
                            idx === di
                              ? {
                                  ...dd,
                                  draft: { ...dd.draft, description: v },
                                }
                              : dd
                          );
                        }}
                      ></textarea>
                    </label>

                    <div class="actions">
                      <button
                        type="button"
                        @click=${() => this.addActivityToDay(di)}
                      >
                        Add Activity
                      </button>
                      <span class="muted"
                        >Plan multiple activities for this day.</span
                      >
                    </div>

                    ${d.activities.length
                      ? html`<ul class="activity-list">
                          ${d.activities.map(
                            (a: ActivityDraft, idx: number) => {
                              const referenceInfo = this.getReferenceInfo(a);
                              return html`<li>
                                <strong>${a.activity}</strong> at ${a.location}
                                • ${a.time}
                                ${referenceInfo
                                  ? html` • ${referenceInfo}`
                                  : ""}
                                ${a.description
                                  ? html`<br /><small>${a.description}</small>`
                                  : ""}
                                <button
                                  type="button"
                                  @click=${() =>
                                    this.removeActivityFromDay(di, idx)}
                                >
                                  Remove
                                </button>
                              </li>`;
                            }
                          )}
                        </ul>`
                      : html`<p class="muted">
                          No activities added yet for Day ${d.day}.
                        </p>`}
                  </div>
                </form-section>
              `
            )}
          </div>
          <!-- Occupy the submit slot to suppress mu-form's default submit UI -->
          <span slot="submit" hidden></span>
        </mu-form>
        <div class="submit-actions">
          <button class="primary-btn" type="button" @click=${this.onSubmitMu}>
            Create Itineraries
          </button>
          ${this.error ? html`<span class="muted">${this.error}</span>` : ""}
          ${
            this.success ? html`<span class="muted">${this.success}</span>` : ""
          }
        </div>
    `;
  }

  private getReferenceInfo(activity: ActivityDraft): string | undefined {
    if (activity.pathId) {
      const path = this.paths.find((p) => p.id === activity.pathId);
      return path ? `Path: ${path.name}` : `Path ID: ${activity.pathId}`;
    }
    if (activity.poiId) {
      const poi = this.pois.find((p) => p.id === activity.poiId);
      return poi ? `POI: ${poi.name}` : `POI ID: ${activity.poiId}`;
    }
    if (activity.campsiteId) {
      const campsite = this.campsites.find((c) => c.id === activity.campsiteId);
      return campsite
        ? `Campsite: ${campsite.name}`
        : `Campsite ID: ${activity.campsiteId}`;
    }
    return undefined;
  }

  private addActivityToDay = (dayIndex: number) => {
    const day = this.daysDraft[dayIndex];
    const draft = day?.draft;
    if (!draft || !draft.time || !draft.activity || !draft.location) {
      this.error = "Time, activity name, and location are required";
      return;
    }

    const activity: ActivityDraft = {
      time: draft.time,
      activity: draft.activity,
      location: draft.location,
      description: draft.description || undefined,
    };

    if (draft.selectedReferenceType && draft.selectedReferenceId) {
      if (draft.selectedReferenceType === "path") {
        activity.pathId = draft.selectedReferenceId;
      } else if (draft.selectedReferenceType === "poi") {
        activity.poiId = draft.selectedReferenceId;
      } else if (draft.selectedReferenceType === "campsite") {
        activity.campsiteId = draft.selectedReferenceId;
      }
    }

    const nextDays = this.daysDraft.map((d, idx) =>
      idx === dayIndex
        ? {
            ...d,
            activities: [...d.activities, activity],
            draft: {
              ...d.draft,
              time: "",
              activity: "",
              location: "",
              locationValue: "",
              description: "",
              selectedReferenceType: "",
              selectedReferenceId: "",
            },
          }
        : d
    );
    this.daysDraft = nextDays;

    this.error = null;
  };

  private removeActivityFromDay = (dayIndex: number, idx: number) => {
    this.daysDraft = this.daysDraft.map((d, di) =>
      di === dayIndex
        ? { ...d, activities: d.activities.filter((_, i) => i !== idx) }
        : d
    );
  };

  // Submit is handled by mu-form's @mu-form:submit only

  private async onSubmitMu(_e: Form.SubmitEvent<any>) {
    this.error = null;
    this.success = null;
    this.submitting = true;
    const campsiteName = this.campsiteId
      ? this.campsites.find((c) => c.id === this.campsiteId)?.name
      : undefined;

    const itineraries = this.daysDraft.map((d) => {
      const itineraryid = `${this.tripid}-day${d.day}`;
      return {
        itineraryid,
        tripid: this.tripid,
        tripName: this.tripName,
        day: d.day,
        date: d.date,
        notes: d.notes || undefined,
        campsiteId: this.campsiteId || undefined,
        campsiteName,
        activities: [...d.activities],
        card: {
          title: `Day ${d.day}: ${d.activities[0]?.activity || "Itinerary"}`,
          description: d.notes || "User-created itinerary",
          href: `/app/trips/${this.tripid}/itinerary/day${d.day}`,
        },
      };
    });

    const message: [
      "itinerary/create",
      {
        itinerary: any[];
        callbacks?: {
          onSuccess?: () => void;
          onFailure?: (err: Error) => void;
        };
      }
    ] = [
      "itinerary/create",
      {
        itinerary: itineraries,
        callbacks: {
          onSuccess: () => {
            this.success = "Itineraries created!";
            this.submitting = false;
            History.dispatch(this, "history/navigate", { href: "/app/trips" });
            // Reset form fields
            this.tripid = "";
            this.tripName = "";
            this.day = 1;
            this.date = "";
            this.notes = "";
            this.campsiteId = "";
            this.tripLength = 1;
            this.daysDraft = [this.defaultDay(1)];
          },
          onFailure: (err: Error) => {
            this.error = err.message || "Failed to create itineraries";
            this.submitting = false;
          },
        },
      },
    ];
    // Debug: log before dispatching message
    console.log("[itinerary-create-view] dispatching mu:message", message);
    this.dispatchMessage(message);
  }
}

export default ItineraryCreateView;
