import type { Metadata } from "next";
import { headers } from "next/headers";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

export async function generateMetadata():Promise<Metadata>{
  const requestHeaders=await headers();
  const host=requestHeaders.get('x-forwarded-host')??requestHeaders.get('host');
  const protocol=requestHeaders.get('x-forwarded-proto')??(host?.includes('localhost')?'http':'https');
  const socialImage=host?`${protocol}://${host}/og.png`:undefined;
  const title="ATLAS — The emotional geography of cities";
  const description="Explore how cities feel, compare their personalities and find your place in the world.";
  return{
    title,
    description,
    icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"},
    openGraph:{title,description,images:socialImage?[{url:socialImage,width:1672,height:941,alt:"ATLAS — Find cities that match your vibe."}]:undefined},
    twitter:{card:"summary_large_image",title,description,images:socialImage?[socialImage]:undefined},
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
