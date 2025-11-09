import express, { Request, Response } from "express";
import Paths from "../services/path-svc";

const router = express.Router();

// GET /api/paths?park=parkid
router.get("/", (req: Request, res: Response) => {
  const { park } = req.query as { park?: string };
  Paths.index(park ? { park } : undefined)
    .then((list) => res.json(list))
    .catch((err) => res.status(500).json({ error: String(err) }));
});

// GET /api/paths/:pathid
router.get("/:pathid", (req: Request, res: Response) => {
  const { pathid } = req.params;

  Paths.get(pathid)
    .then((path) => {
      if (path) res.json(path);
      else res.status(404).json({ error: "Path not found", pathid });
    })
    .catch((err) => res.status(500).json({ error: String(err) }));
});

// POST /api/paths
router.post("/", (req: Request, res: Response) => {
  const newPath = req.body;

  Paths.create(newPath)
    .then((path) => res.status(201).json(path))
    .catch((err) => res.status(500).json({ error: String(err) }));
});

// PUT /api/paths/:pathid
router.put("/:pathid", (req: Request, res: Response) => {
  const { pathid } = req.params;
  const updated = req.body;

  Paths.update(pathid, updated)
    .then((path) => res.json(path))
    .catch((err) => res.status(404).json({ error: String(err), pathid }));
});

// DELETE /api/paths/:pathid
router.delete("/:pathid", (req: Request, res: Response) => {
  const { pathid } = req.params;

  Paths.remove(pathid)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).json({ error: String(err), pathid }));
});

export default router;
