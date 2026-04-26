import type { Metadata } from "next";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_TITLE ?? "Fractera Light",
};

export default function NotFound() {
  return null;
}
