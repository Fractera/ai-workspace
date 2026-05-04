import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  output: "standalone",
  allowedDevOrigins: ["auth.partner.fractera.local"],
};

export default nextConfig;
