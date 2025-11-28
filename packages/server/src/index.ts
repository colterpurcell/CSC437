import auth, { authenticateUser } from "./routes/auth";
import express, { Request, Response } from "express";
import path from "path";
import fs from "node:fs/promises";
import { connect } from "./services/mongo";
import campsites from "./routes/campsites";
import parks from "./routes/parks";
import paths from "./routes/paths";
import poi from "./routes/poi";
import itineraries from "./routes/itineraries";

connect("natty");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));

// Middleware:
app.use(express.json());

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.use("/api/auth", auth);
app.use("/api/campsites", authenticateUser, campsites);
app.use("/api/parks", authenticateUser, parks);
app.use("/api/paths", authenticateUser, paths);
app.use("/api/poi", authenticateUser, poi);
app.use("/api/itineraries", authenticateUser, itineraries);

app.use(
  "/api",
  (err: unknown, req: Request, res: Response, _next: Function) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
);

app.use("/api", (req: Request, res: Response) => {
  res
    .status(404)
    .json({ error: "Not Found", path: req.originalUrl, method: req.method });
});

// SPA Routes: /app/...
app.use("/app", (req: Request, res: Response) => {
  const indexHtml = path.resolve(staticDir, "index.html");
  fs.readFile(indexHtml, { encoding: "utf8" }).then((html) => res.send(html));
});

// Removed legacy static rewrites for multi-page HTML; SPA handles routes under /app

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
