import { defineConfig } from "vite";
import { glob } from "glob";
import { resolve } from "path";

// Automatically discover all HTML files
const htmlFiles = glob.sync("./**/*.html", {
  ignore: ["./node_modules/**", "./dist/**", "./coverage/**"],
});

const input = Object.fromEntries(
  // using glob so i don't have to manually update this list 😭
  htmlFiles.map((file: string) => {
    const key = file
      .slice(2) // Remove "./"
      .replace(/\.html$/, "") // Remove ".html"
      .replace(/[\/\\]/g, "-") // Replace path separators with dashes
      .replace(/^-/, ""); // Remove leading dash if present

    return [key, resolve(file)];
  })
);

// Custom plugin to handle dynamic routing
const dynamicRoutingPlugin = () => {
  return {
    name: 'dynamic-routing',
    configureServer(server: any) {
      server.middlewares.use('/parks', (req: any, _res: any, next: any) => {
        // Handle /parks/:parkid/index.html -> /parks/park/index.html
        if (req.url?.match(/^\/parks\/[^\/]+\/index\.html$/)) {
          req.url = '/parks/park/index.html';
        }
        next();
      });

      server.middlewares.use((req: any, _res: any, next: any) => {
        // Handle /paths/:pathid.html -> /paths/path/index.html
        if (req.url?.match(/^\/paths\/[^\/]+\.html$/)) {
          req.url = '/paths/path/index.html';
        }
        next();
      });

      server.middlewares.use('/campsites', (req: any, _res: any, next: any) => {
        // Handle /campsites/:siteid.html -> /campsites/site/index.html
        if (req.url?.match(/^\/campsites\/[^\/]+\.html$/)) {
          req.url = '/campsites/site/index.html';
        }
        next();
      });

      server.middlewares.use('/poi', (req: any, _res: any, next: any) => {
        // Handle /poi/:poiid.html -> /poi/poi/index.html
        if (req.url?.match(/^\/poi\/[^\/]+\.html$/)) {
          req.url = '/poi/poi/index.html';
        }
        next();
      });
    }
  };
};

export default defineConfig({
  plugins: [dynamicRoutingPlugin()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
    // Handle dynamic routing in development
    middlewareMode: false,
    fs: {
      strict: false
    }
  },
  build: {
    rollupOptions: {
      input,
    },
  },
  // Configure as multi-page application
  appType: 'mpa',
});
