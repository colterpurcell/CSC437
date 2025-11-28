import express, { Request, Response } from "express";
import Itineraries from "../services/itinerary-svc";

const router = express.Router();

// GET /api/itineraries?trip=tripid&user=userid
router.get("/", (req: Request, res: Response) => {
  console.log("GET /api/itineraries called");
  const { trip, user } = req.query as { trip?: string; user?: string };

  let listPromise: Promise<any[]>;

  if (trip) {
    listPromise = Itineraries.getByTrip(trip);
  } else if (user) {
    listPromise = Itineraries.getByUser(user);
  } else {
    listPromise = Itineraries.index();
  }

  listPromise
    .then((list) => {
      console.log(`Returning ${list.length} itineraries`);
      res.json(list);
    })
    .catch((err) => {
      console.log("Error fetching itineraries:", err);
      res.status(500).json({ error: String(err) });
    });
});

// GET /api/itineraries/:itineraryid
router.get("/:itineraryid", (req: Request, res: Response) => {
  const { itineraryid } = req.params;

  Itineraries.get(itineraryid)
    .then((itinerary) => {
      if (itinerary) res.json(itinerary);
      else res.status(404).json({ error: "Itinerary not found", itineraryid });
    })
    .catch((err) => res.status(500).json({ error: String(err) }));
});

// POST /api/itineraries
router.post("/", (req: Request, res: Response) => {
  const newItinerary = req.body;

  Itineraries.create(newItinerary)
    .then((itinerary) => res.status(201).json(itinerary))
    .catch((err) => res.status(500).json({ error: String(err) }));
});

// PUT /api/itineraries/:itineraryid
router.put("/:itineraryid", (req: Request, res: Response) => {
  const { itineraryid } = req.params;
  const updated = req.body;

  Itineraries.update(itineraryid, updated)
    .then((itinerary) => res.json(itinerary))
    .catch((err) => res.status(500).json({ error: String(err) }));
});

// DELETE /api/itineraries/:itineraryid
router.delete("/:itineraryid", (req: Request, res: Response) => {
  const { itineraryid } = req.params;

  Itineraries.remove(itineraryid)
    .then(() => res.status(204).end())
    .catch((err) => res.status(500).json({ error: String(err) }));
});

export default router;
