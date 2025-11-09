import express, { Request, Response } from "express";
import Parks from "../services/park-svc";

const router = express.Router();

// GET /api/parks?park=parkid
router.get("/", (req: Request, res: Response) => {
  const { park } = req.query as { park?: string };
  const listPromise = park
    ? Parks.index().then((list) => list.filter((p) => p.parkid === park))
    : Parks.index();

  listPromise
    .then((list) => res.json(list))
    .catch((err) => res.status(500).json({ error: String(err) }));
});

// GET /api/parks/:parkid
router.get("/:parkid", (req: Request, res: Response) => {
  const { parkid } = req.params;

  Parks.get(parkid)
    .then((park) => {
      if (park) res.json(park);
      else res.status(404).json({ error: "Park not found", parkid });
    })
    .catch((err) => res.status(500).json({ error: String(err) }));
});

// POST /api/parks
router.post("/", (req: Request, res: Response) => {
  const newPark = req.body;

  Parks.create(newPark)
    .then((park) => res.status(201).json(park))
    .catch((err) => res.status(500).json({ error: String(err) }));
});

// PUT /api/parks/:parkid
router.put("/:parkid", (req: Request, res: Response) => {
  const { parkid } = req.params;
  const updated = req.body;

  Parks.update(parkid, updated)
    .then((park) => res.json(park))
    .catch((err) => res.status(404).json({ error: String(err), parkid }));
});

// DELETE /api/parks/:parkid
router.delete("/:parkid", (req: Request, res: Response) => {
  const { parkid } = req.params;

  Parks.remove(parkid)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).json({ error: String(err), parkid }));
});

export default router;
