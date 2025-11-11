import dotenv from "dotenv";
import express, {
  NextFunction,
  Request,
  Response
} from "express";
import jwt from "jsonwebtoken";

import credentials from "../services/credential-svc";

const router = express.Router();

dotenv.config();
const TOKEN_SECRET: string =
  process.env.TOKEN_SECRET || "NOT_A_SECRET";
router.post("/register", (req: Request, res: Response) => {
  const { username, password } = req.body; // from form
  console.log("Register request:", { username, password: password ? "***" : "" });

  if ( typeof username !== "string" ||
    typeof password !== "string"
  ) {
    console.log("Invalid input data");
    res.status(400).send({ error: "Bad request: Invalid input data." });
  } else {
    credentials
      .create(username, password)
      .then((creds) => {
        console.log("User created successfully:", creds.username);
        return generateAccessToken(creds.username);
      })
      .then((token) => {
        console.log("Token generated for:", username);
        res.status(201).send({ token: token });
      })
      .catch((err) => {
        console.log("Registration error:", err);
        res.status(409).send({ error: err.message });
      });
  }
});

router.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body; // from form

  if (!username || !password) {
    res.status(400).send({ error: "Bad request: Invalid input data." });
  } else {
    credentials
      .verify(username, password)
      .then((goodUser: string) => generateAccessToken(goodUser))
      .then((token) => res.status(200).send({ token: token }))
      .catch((error) => res.status(401).send({ error: "Invalid username or password" }));
  }
});

function generateAccessToken(
  username: string
): Promise<String> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username: username },
      TOKEN_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) reject(error);
        else resolve(token as string);
      }
    );
  });
}

export function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  //Getting the 2nd part of the auth header (the token)
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Authenticating request:", req.method, req.originalUrl);
  console.log("Auth header:", authHeader ? "present" : "missing");
  console.log("Token:", token ? "present" : "missing");

  if (!token) {
    console.log("No token provided");
    res.status(401).json({ error: "No token provided" });
    return;
  }

  jwt.verify(token, TOKEN_SECRET, (error, decoded) => {
    if (error) {
      console.log("Token verification failed:", error);
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    console.log("Token verified successfully for user:", (decoded as any)?.username);
    // Add user info to request for potential use in routes
    (req as any).user = decoded;
    next();
  });
}

export default router;
