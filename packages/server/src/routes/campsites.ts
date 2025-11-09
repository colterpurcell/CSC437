import express, { Request, Response } from "express";
import { CampsiteModel, ICampsite } from "../models/campsite-model";
import Campsites from "../services/campsite-svc";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  const { park } = req.query as { park?: string };
  Campsites.index(park ? { park } : undefined)
    .then((list) => res.json(list))
    .catch((err) => res.status(500).json({ error: String(err) }));
});

router.get("/:siteid", (req: Request, res: Response) => {
  const { siteid } = req.params;

  Campsites.get(siteid)
    .then((campsite) => {
      if (campsite) res.json(campsite);
      else res.status(404).json({ error: "Campsite not found", siteid });
    })
    .catch((err) => res.status(500).json({ error: String(err) }));
});

router.post("/", (req: Request, res: Response) => {
  const newCampsite = req.body;

  Campsites.create(newCampsite)
    .then((campsite) => res.status(201).json(campsite))
    .catch((err) => res.status(500).json({ error: String(err) }));
});

router.put("/:siteid", (req: Request, res: Response) => {
  const { siteid } = req.params;
  const newCampsite = req.body;

  Campsites.update(siteid, newCampsite)
    .then((campsite) => res.json(campsite))
    .catch((err) => res.status(404).json({ error: String(err), siteid }));
});

router.delete("/:siteid", (req: Request, res: Response) => {
  const { siteid } = req.params;

  Campsites.remove(siteid)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).json({ error: String(err), siteid }));
});

export default router;
