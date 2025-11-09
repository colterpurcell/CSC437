import { ParkModel, IPark } from "../models/park-model";

function index(): Promise<IPark[]> {
  return ParkModel.find().exec();
}

function get(parkid: string): Promise<IPark | null> {
  return ParkModel.findOne({ parkid }).exec();
}

function create(park: IPark): Promise<IPark> {
  const p = new ParkModel(park);
  return p.save();
}

function update(parkid: string, park: IPark): Promise<IPark> {
  return ParkModel.findOneAndUpdate({ parkid }, park, { new: true }).then(
    (updated) => {
      if (!updated) throw `${parkid} not updated`;
      else return updated as IPark;
    }
  );
}

function remove(parkid: string): Promise<void> {
  return ParkModel.findOneAndDelete({ parkid }).then((deleted) => {
    if (!deleted) throw `${parkid} not deleted`;
  });
}

export default { index, get, create, update, remove };
