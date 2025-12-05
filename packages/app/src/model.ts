// Keep the app model focused on itinerary flows for MVU.
// Avoid importing server types here to keep this module decoupled
// from runtime aliasing and to allow lightweight typing.

export interface ItineraryDayActivity {
  time: string;
  activity: string;
  location: string;
  description?: string;
  // Optional references to domain entities
  pathId?: string;
  poiId?: string;
  campsiteId?: string;
}

export interface ItineraryDayPlan {
  itineraryid: string; // e.g. `${tripid}-day${n}`
  tripid: string;
  tripName: string;
  day: number;
  date: string; // YYYY-MM-DD
  notes?: string;
  campsiteId?: string;
  campsiteName?: string;
  activities: ItineraryDayActivity[];
  card?: {
    title: string;
    description?: string;
    href?: string;
  };
}

export type ItineraryAction = "create" | "update" | "delete" | "load";

export interface ItineraryStatus {
  status?: "idle" | "pending" | "loaded" | "error";
  action?: ItineraryAction;
  error?: string;
}

export interface Model {
  itineraries?: ItineraryDayPlan[]; // recent or active client-side itineraries
  itineraryStatus?: ItineraryStatus;
}

export const init: Model = {
  itineraries: [],
  itineraryStatus: { status: "idle" }
};
