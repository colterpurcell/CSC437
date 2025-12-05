import express, { Request, Response } from "express";
import ItinerariesSvc, { Itineraries } from "../services/itinerary-svc";
import { authenticateUser } from "./auth";

const router = express.Router();

// GET /api/itineraries?trip=tripid&owner=username
router.get("/", (req: Request, res: Response) => {
  console.log("GET /api/itineraries called");
  const { trip, owner } = req.query as { trip?: string; owner?: string };

  let listPromise: Promise<any[]>;

  if (trip) {
    listPromise = Itineraries.getByTrip(trip);
  } else if (owner) {
    listPromise = Itineraries.getByOwner(owner);
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
// Create a new itinerary. Requires auth; binds itinerary to current user.
router.post("/", authenticateUser, (req: Request, res: Response) => {
  const newItinerary = req.body;

  // attach authenticated username as owner
  const user = (req as any).user as { username?: string };
  if (user?.username) {
    newItinerary.owner = user.username;
  }

  // Basic defensive checks to avoid free-floating content
  // Ensure required fields exist
  if (
    typeof newItinerary.itineraryid !== "string" ||
    typeof newItinerary.tripid !== "string" ||
    typeof newItinerary.tripName !== "string" ||
    typeof newItinerary.day !== "number" ||
    typeof newItinerary.date !== "string" ||
    !Array.isArray(newItinerary.activities)
  ) {
    return res
      .status(400)
      .json({ error: "Missing or invalid itinerary fields" });
  }

  Itineraries.create(newItinerary)
    .then((itinerary) => res.status(201).json(itinerary))
    .catch((err) => res.status(500).json({ error: String(err) }));
});

// Note: Bulk trip deletion endpoint removed. Client performs per-itinerary deletes after listing.

// PUT /api/itineraries/:itineraryid
router.put("/:itineraryid", authenticateUser, (req: Request, res: Response) => {
  const { itineraryid } = req.params;
  const updated = req.body;

  // Ownership check: only owner can update
  Itineraries.get(itineraryid)
    .then((existing) => {
      const username = (req as any).user?.username;
      if (!existing) {
        res.status(404).json({ error: "Not found" });
        return null;
      }
      if (!username || existing.owner !== username) {
        res.status(403).json({ error: "Forbidden" });
        return null;
      }
      return Itineraries.update(itineraryid, updated);
    })
    .then((itinerary) => {
      if (itinerary) res.json(itinerary);
    })
    .catch((err) => res.status(500).json({ error: String(err) }));
});

// DELETE /api/itineraries/:itineraryid
router.delete(
  "/:itineraryid",
  authenticateUser,
  (req: Request, res: Response) => {
    const { itineraryid } = req.params;

    // Ownership check: only owner can delete
    Itineraries.get(itineraryid)
      .then((existing) => {
        const username = (req as any).user?.username;
        if (!existing) {
          res.status(404).json({ error: "Not found" });
          return null;
        }
        if (!username || existing.owner !== username) {
          res.status(403).json({ error: "Forbidden" });
          return null;
        }
        return Itineraries.remove(itineraryid);
      })
      .then((result) => {
        if (result === undefined) res.status(204).end();
      })
      .catch((err) => res.status(500).json({ error: String(err) }));
  }
);

export default router;
