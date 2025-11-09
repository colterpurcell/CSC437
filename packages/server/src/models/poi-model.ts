import mongoose from "mongoose";

export interface IPOI {
  poiid: string;
  park: string;
  parkName: string;
  name: string;
  type: string;
  description: string;
  card: {
    title: string;
    description: string;
    href: string;
  };
}

const poiSchema = new mongoose.Schema<IPOI>({
  poiid: { type: String, required: true, unique: true },
  park: { type: String, required: true },
  parkName: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  card: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    href: { type: String, required: true },
    image: { type: String, required: false },
    imageAlt: { type: String, required: false },
  },
});

export const POIModel = mongoose.model<IPOI>("POI", poiSchema);