"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteFooter() {
  // The explore view is a full-height app layout without a footer.
  if (usePathname() === "/explore") return null;
  return (
    <footer>
      <Link className="brand" href="/">
        ATLAS<span>°</span>
      </Link>
      <p>Find your place in the world.</p>
      <div>
        <Link href="/explore">Explore</Link>
        <Link href="/compare">Compare</Link>
        <Link href="/discover">Discover</Link>
      </div>
      <small>© 2026 ATLAS · Santiago / The world</small>
    </footer>
  );
}
