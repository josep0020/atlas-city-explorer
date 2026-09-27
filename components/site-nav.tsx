"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

const links = [
  ["/explore", "Explore"],
  ["/compare", "Compare"],
  ["/discover", "Find your city"],
  ["/favorites", "Saved"],
] as const;

export default function SiteNav() {
  const pathname = usePathname() ?? "/";
  const [menu, setMenu] = useState(false);
  const isActive = (href: string) =>
    pathname === href || (pathname === "/" && href === "/explore");
  const close = () => setMenu(false);
  const navClass = `nav navAtlas${pathname.startsWith("/city/") ? " navAtlasOverlay" : ""}`;
  return (
    <>
      <header className={navClass}>
        <Link className="brand" href="/" onClick={close}>
          ATLAS<span>°</span>
        </Link>
        <nav>
          {links.map(([href, label]) => (
            <Link
              className={isActive(href) ? "active" : ""}
              aria-current={pathname === href ? "page" : undefined}
              key={href}
              href={href}
            >
              {label}
            </Link>
          ))}
        </nav>
        <button
          className="menuBtn"
          aria-label={menu ? "Close menu" : "Open menu"}
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      {menu && (
        <div className="mobileNav mobileNavAtlas">
          {links.map(([href, label]) => (
            <Link
              className={isActive(href) ? "active" : ""}
              aria-current={pathname === href ? "page" : undefined}
              key={href}
              href={href}
              onClick={close}
            >
              {label}
              <ArrowRight />
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
