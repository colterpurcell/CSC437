import { defineConfig } from "vite";
import { resolve } from "path";
import fs from "node:fs/promises";

// Custom plugin to handle dynamic routing
const dynamicRoutingPlugin = () => {
  return {
    name: "dynamic-routing",
    configureServer(server: any) {
      // SPA fallback for /app and /app/* to index.html during development
      server.middlewares.use("/app", async (_req: any, res: any, next: any) => {
        try {
          const indexPath = resolve(process.cwd(), "index.html");
          const html = await fs.readFile(indexPath, { encoding: "utf8" });
          res.setHeader("Content-Type", "text/html");
          res.end(html);
        } catch (err) {
          next();
        }
      });

      server.middlewares.use("/parks", (req: any, _res: any, next: any) => {
        // Handle /parks/:parkid/index.html -> /parks/park/index.html
        if (req.url?.match(/^\/parks\/[^\/]+\/index\.html$/)) {
          req.url = "/parks/park/index.html";
        }
        next();
      });

      server.middlewares.use((req: any, _res: any, next: any) => {
        // Handle /paths/:pathid.html -> /paths/path/index.html
        if (req.url?.match(/^\/paths\/[^\/]+\.html$/)) {
          req.url = "/paths/path/index.html";
        }
        next();
      });

      server.middlewares.use("/campsites", (req: any, _res: any, next: any) => {
        // Handle /campsites/:siteid.html -> /campsites/site/index.html
        if (req.url?.match(/^\/campsites\/[^\/]+\.html$/)) {
          req.url = "/campsites/site/index.html";
        }
        next();
      });

      server.middlewares.use("/poi", (req: any, _res: any, next: any) => {
        // Handle /poi/:poiid.html -> /poi/poi/index.html
        if (req.url?.match(/^\/poi\/[^\/]+\.html$/)) {
          req.url = "/poi/poi/index.html";
        }
        next();
      });
    },
  };
};

export default defineConfig({
  plugins: [dynamicRoutingPlugin()],
  server: {
    proxy: {
      "/api": "http://localhost:3000",
      "/auth": "http://localhost:3000",
      "/images": "http://localhost:3000",
      "/login": "http://localhost:3000",
      "/register": "http://localhost:3000"
    },
    // Handle dynamic routing in development
    middlewareMode: false,
    fs: {
      strict: false,
    },
  },
  // Configure as single-page application
  appType: "spa",
});
