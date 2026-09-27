import type { Metadata } from "next";
import { headers } from "next/headers";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";
import SiteFooter from "../components/site-footer";
import SiteNav from "../components/site-nav";

// Prefer a configured canonical URL; fall back to the request host so social
// previews still get absolute image URLs on preview deployments.
async function siteUrl(): Promise<URL | undefined> {
  if (process.env.SITE_URL) return new URL(process.env.SITE_URL);
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  if (!host) return undefined;
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.includes("localhost") ? "http" : "https");
  return new URL(`${protocol}://${host}`);
}

export async function generateMetadata(): Promise<Metadata> {
  const title = "ATLAS — The emotional geography of cities";
  const description =
    "Explore how cities feel, compare their personalities and find your place in the world.";
  const image = {
    url: "/og.png",
    width: 1672,
    height: 941,
    alt: "ATLAS — Find cities that match your vibe.",
  };
  return {
    metadataBase: await siteUrl(),
    title,
    description,
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: { title, description, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SiteNav />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
