import express, { Request, Response } from "express";
import POIs from "../services/poi-svc";

const router = express.Router();

// GET /api/poi?park=parkid
router.get("/", (req: Request, res: Response) => {
  const { park } = req.query as { park?: string };
  POIs.index(park ? { park } : undefined)
    .then((list) => res.json(list))
    .catch((err) => res.status(500).json({ error: String(err) }));
});

// GET /api/poi/:poiid
router.get("/:poiid", (req: Request, res: Response) => {
  const { poiid } = req.params;

  POIs.get(poiid)
    .then((poi) => {
      if (poi) res.json(poi);
      else res.status(404).json({ error: "POI not found", poiid });
    })
    .catch((err) => res.status(500).json({ error: String(err) }));
});

// POST /api/poi
router.post("/", (req: Request, res: Response) => {
  const newPoi = req.body;

  POIs.create(newPoi)
    .then((poi) => res.status(201).json(poi))
    .catch((err) => res.status(500).json({ error: String(err) }));
});

// PUT /api/poi/:poiid
router.put("/:poiid", (req: Request, res: Response) => {
  const { poiid } = req.params;
  const updated = req.body;

  POIs.update(poiid, updated)
    .then((poi) => res.json(poi))
    .catch((err) => res.status(404).json({ error: String(err), poiid }));
});

// DELETE /api/poi/:poiid
router.delete("/:poiid", (req: Request, res: Response) => {
  const { poiid } = req.params;

  POIs.remove(poiid)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).json({ error: String(err), poiid }));
});

export default router;
