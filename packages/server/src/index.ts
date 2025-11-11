import auth, { authenticateUser } from "./routes/auth";
import express, { Request, Response } from "express";
import path from "path";
import { connect } from "./services/mongo";
import campsites from "./routes/campsites";
import parks from "./routes/parks";
import paths from "./routes/paths";
import poi from "./routes/poi";

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

// Generic page rewrites for static frontend
const staticRoot = path.resolve(staticDir);

app.get("/parks/:parkid/index.html", (req: Request, res: Response) => {
  res.sendFile(path.join(staticRoot, "parks/park/index.html"));
});

app.get("/campsites/:siteid.html", (req: Request, res: Response) => {
  res.sendFile(path.join(staticRoot, "campsites/site/index.html"));
});

app.get("/paths/:pathid.html", (req: Request, res: Response) => {
  res.sendFile(path.join(staticRoot, "paths/path/index.html"));
});

app.get("/poi/:poiid.html", (req: Request, res: Response) => {
  res.sendFile(path.join(staticRoot, "poi/poi/index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
