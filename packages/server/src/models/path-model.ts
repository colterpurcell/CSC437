import mongoose from "mongoose";

export interface IPath {
  pathid: string;
  park: string;
  parkName: string;
  name: string;
  type: "road" | "trail";
  description: string;
  image?: string;
  imageAlt?: string;
  card: {
    title: string;
    description: string;
    href: string;
    image?: string;
    imageAlt?: string;
  };
}

const pathSchema = new mongoose.Schema<IPath>({
  pathid: { type: String, required: true, unique: true },
  park: { type: String, required: true },
  parkName: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ["road", "trail"], required: true },
  description: { type: String, required: true },
  image: { type: String, required: false },
  imageAlt: { type: String, required: false },
  card: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    href: { type: String, required: true },
    image: { type: String, required: false },
    imageAlt: { type: String, required: false },
  },
});

export const PathModel = mongoose.model<IPath>("Path", pathSchema);
