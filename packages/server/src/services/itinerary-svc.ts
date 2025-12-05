import { ItineraryModel, IItinerary } from "../models/itinerary-model";

function index(): Promise<IItinerary[]> {
  return ItineraryModel.find().exec();
}

function get(itineraryid: string): Promise<IItinerary | null> {
  return ItineraryModel.findOne({ itineraryid }).exec();
}

function getByTrip(tripid: string): Promise<IItinerary[]> {
  return ItineraryModel.find({ tripid }).sort({ day: 1 }).exec();
}

function getByOwner(owner: string): Promise<IItinerary[]> {
  return ItineraryModel.find({ owner }).sort({ tripid: 1, day: 1 }).exec();
}

function create(itinerary: IItinerary): Promise<IItinerary> {
  const i = new ItineraryModel(itinerary);
  return i.save();
}

function update(
  itineraryid: string,
  itinerary: IItinerary
): Promise<IItinerary> {
  return ItineraryModel.findOneAndUpdate({ itineraryid }, itinerary, {
    new: true,
  }).then((updated) => {
    if (!updated) throw `${itineraryid} not updated`;
    else return updated as IItinerary;
  });
}

function remove(itineraryid: string): Promise<void> {
  return ItineraryModel.findOneAndDelete({ itineraryid }).then((deleted) => {
    if (!deleted) throw `${itineraryid} not deleted`;
  });
}

export default {
  index,
  get,
  getByTrip,
  getByOwner,
  create,
  update,
  remove,
};
// Default export updated to use getByOwner (was getByUser)
export const Itineraries = {
  index,
  get,
  getByTrip,
  getByOwner,
  create,
  update,
  remove,
};
