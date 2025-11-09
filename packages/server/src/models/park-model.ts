import mongoose from "mongoose";

export interface IPark {
  parkid: string;
  name: string;
  description: string;
  location: string;
  established: string;
  size: string;
  card: {
    title: string;
    description: string;
    href: string;
  };
}

const parkSchema = new mongoose.Schema<IPark>({
  parkid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  established: { type: String, required: true },
  size: { type: String, required: true },
  card: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    href: { type: String, required: true },
  },
});

export const ParkModel = mongoose.model<IPark>("Park", parkSchema);