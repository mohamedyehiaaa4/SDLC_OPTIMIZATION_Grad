import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RepoMind — An AI assistant for the whole SDLC",
  description:
    "RepoMind works alongside your team through requirements, design, implementation, and testing — assisting at every stage, from idea to shipped code.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
