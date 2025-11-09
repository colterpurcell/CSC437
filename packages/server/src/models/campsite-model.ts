import mongoose from "mongoose";

export interface ICampsite {
  siteid: string;
  park: string;
  parkName: string;
  name: string;
  capacity: string;
  location: string;
  description: string;
  connectedPaths: Array<{
    pathId: string;
    pathName: string;
    pathType: "road" | "trail";
  }>;
  nearbyPoi: Array<{
    poiId: string;
    poiName: string;
    poiType: string;
  }>;
  card: {
    title: string;
    description: string;
    href: string;
  };
}

const campsiteSchema = new mongoose.Schema<ICampsite>({
  siteid: { type: String, required: true, unique: true },
  park: { type: String, required: true },
  parkName: { type: String, required: true },
  name: { type: String, required: true },
  capacity: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  connectedPaths: [
    {
      pathId: { type: String, required: true },
      pathName: { type: String, required: true },
      pathType: { type: String, enum: ["road", "trail"], required: true },
    },
  ],
  nearbyPoi: [
    {
      poiId: { type: String, required: true },
      poiName: { type: String, required: true },
      poiType: { type: String, required: true },
    },
  ],
  card: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    href: { type: String, required: true },
    image: { type: String, required: false },
    imageAlt: { type: String, required: false },
  },
});

export const CampsiteModel = mongoose.model<ICampsite>(
  "Campsite",
  campsiteSchema
);
