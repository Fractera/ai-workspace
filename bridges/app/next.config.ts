import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  env: {
    NEXT_PUBLIC_BRIDGE_URL: process.env.NEXT_PUBLIC_BRIDGE_URL ?? "",
    NEXT_PUBLIC_PTY_URL:    process.env.NEXT_PUBLIC_PTY_URL    ?? "",
    NEXT_PUBLIC_AUTH_URL:   process.env.NEXT_PUBLIC_AUTH_URL   ?? "",
  },
};

export default config;
