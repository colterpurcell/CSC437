import mongoose from "mongoose";

export interface IItinerary {
  itineraryid: string;
  tripid: string;
  tripName: string;
  owner: string; // Username of creator/owner
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

const itinerarySchema = new mongoose.Schema<IItinerary>(
  {
    itineraryid: { type: String, required: true, unique: true },
    tripid: { type: String, required: true },
    tripName: { type: String, required: true },
    owner: { type: String, required: true },
    day: { type: Number, required: true },
    date: { type: String, required: true },
    activities: [
      {
        time: { type: String, required: true },
        activity: { type: String, required: true },
        location: { type: String, required: true },
        description: { type: String, required: false },
        pathId: { type: String, required: false },
        poiId: { type: String, required: false },
        campsiteId: { type: String, required: false },
      },
    ],
    campsiteId: { type: String, required: false },
    campsiteName: { type: String, required: false },
    notes: { type: String, required: false },
    card: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      href: { type: String, required: true },
    },
  },
  { timestamps: true }
);

// Index for efficient querying
itinerarySchema.index({ tripid: 1, day: 1 });
itinerarySchema.index({ owner: 1 });

export const ItineraryModel = mongoose.model<IItinerary>(
  "Itinerary",
  itinerarySchema
);
