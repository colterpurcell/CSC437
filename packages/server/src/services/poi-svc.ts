import { POIModel, IPOI } from "../models/poi-model";

function index(filter?: { park?: string }): Promise<IPOI[]> {
  const query: any = {};
  if (filter?.park) query.park = filter.park;
  return POIModel.find(query).exec();
}

function get(poiid: string): Promise<IPOI | null> {
  return POIModel.findOne({ poiid }).exec();
}

function create(poi: IPOI): Promise<IPOI> {
  const p = new POIModel(poi);
  return p.save();
}

function update(poiid: string, poi: IPOI): Promise<IPOI> {
  return POIModel.findOneAndUpdate({ poiid }, poi, { new: true }).then(
    (updated) => {
      if (!updated) throw `${poiid} not updated`;
      else return updated as IPOI;
    }
  );
}

function remove(poiid: string): Promise<void> {
  return POIModel.findOneAndDelete({ poiid }).then((deleted) => {
    if (!deleted) throw `${poiid} not deleted`;
  });
}

export default { index, get, create, update, remove };
