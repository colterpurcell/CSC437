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

export default defineConfig({
  build: {
    rollupOptions: {
      input,
    },
  },
});
