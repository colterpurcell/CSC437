import { CampsiteModel, ICampsite } from "../models/campsite-model";

function index(filter?: { park?: string }): Promise<ICampsite[]> {
  const query: any = {};
  if (filter?.park) query.park = filter.park;
  return CampsiteModel.find(query).exec();
}

function get(siteid: string): Promise<ICampsite | null> {
  return CampsiteModel.findOne({ siteid }).exec();
}

function create(campsite: ICampsite): Promise<ICampsite> {
  const c = new CampsiteModel(campsite);
  return c.save();
}

function update(siteid: string, campsite: ICampsite): Promise<ICampsite> {
  return CampsiteModel.findOneAndUpdate({ siteid }, campsite, {
    new: true,
  }).then((updated) => {
    if (!updated) throw `${siteid} not updated`;
    else return updated as ICampsite;
  });
}

function remove(siteid: string): Promise<void> {
  return CampsiteModel.findOneAndDelete({ siteid }).then((deleted) => {
    if (!deleted) throw `${siteid} not deleted`;
  });
}

export default { index, get, create, update, remove };
