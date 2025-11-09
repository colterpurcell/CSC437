import { PathModel, IPath } from "../models/path-model";

function index(filter?: { park?: string }): Promise<IPath[]> {
  const query: any = {};
  if (filter?.park) query.park = filter.park;
  return PathModel.find(query).exec();
}

function get(pathid: string): Promise<IPath | null> {
  return PathModel.findOne({ pathid }).exec();
}

function create(path: IPath): Promise<IPath> {
  const p = new PathModel(path);
  return p.save();
}

function update(pathid: string, path: IPath): Promise<IPath> {
  return PathModel.findOneAndUpdate({ pathid }, path, { new: true }).then(
    (updated) => {
      if (!updated) throw `${pathid} not updated`;
      else return updated as IPath;
    }
  );
}

function remove(pathid: string): Promise<void> {
  return PathModel.findOneAndDelete({ pathid }).then((deleted) => {
    if (!deleted) throw `${pathid} not deleted`;
  });
}

export default { index, get, create, update, remove };
