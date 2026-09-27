"use client";
import Link from "next/link";
import { ArrowRight, Bookmark } from "lucide-react";
import { cities } from "../lib/cities";
import { useFavorites } from "../lib/visitor";
import CityCard from "./city-card";
import PageTitle from "./page-title";

export default function Favorites() {
  const { favorites } = useFavorites();
  const saved = cities.filter((c) => favorites.includes(c.id));
  return (
    <div className="page favorites">
      <PageTitle
        eyebrow="YOUR ATLAS"
        title="Saved cities"
        text="A personal collection of places worth returning to."
      />
      {saved.length ? (
        <div className="cityGrid">
          {saved.map((c, i) => (
            <CityCard city={c} index={i} key={c.id} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <Bookmark />
          <h2>Your atlas is still open.</h2>
          <p>Save cities as you explore and they&apos;ll appear here.</p>
          <Link className="darkBtn" href="/explore">
            Explore cities <ArrowRight />
          </Link>
        </div>
      )}
    </div>
  );
}
