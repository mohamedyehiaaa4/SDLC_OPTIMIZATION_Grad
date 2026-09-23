import path from "node:path";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";

// Environment variables live in the project root (.env), shared with the backend.
// forceReload: Next.js has already loaded (and cached) env files from frontend/.
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
nextEnv.loadEnvConfig(projectRoot, process.env.NODE_ENV !== "production", console, true);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // The browser calls /api/*; Next.js forwards it to the FastAPI backend.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
