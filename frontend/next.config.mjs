import path from "node:path";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";

// Environment variables live in the project root (.env), shared with the backend.
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
nextEnv.loadEnvConfig(projectRoot);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
