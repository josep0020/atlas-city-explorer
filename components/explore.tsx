"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Compass,
  Footprints,
  Leaf,
  Moon,
  Search,
  ShieldCheck,
  SunMedium,
  Train,
  X,
} from "lucide-react";
import { cities, City, DNA, dnaLabels, imageAt } from "../lib/cities";
import { exploreScore, ExploreMetric } from "../lib/scoring";
import ExploreMap, { ExploreMapResult } from "./explore-map";

const exploreMetrics = [
  { key: "overall" as const, label: "Overall", Icon: Compass },
  { key: "cost" as const, label: "Affordability", Icon: CircleDollarSign },
  { key: "safety" as const, label: "Safety", Icon: ShieldCheck },
  { key: "nightlife" as const, label: "Nightlife", Icon: Moon },
  { key: "transit" as const, label: "Transit", Icon: Train },
  { key: "weather" as const, label: "Weather", Icon: SunMedium },
  { key: "walkability" as const, label: "Walkability", Icon: Footprints },
  { key: "nature" as const, label: "Nature", Icon: Leaf },
];
const detailMetrics: (keyof DNA)[] = ["safety", "transit", "nature"];

export default function Explore({ region }: { region?: string }) {
  const router = useRouter();
  const [metric, setMetric] = useState<ExploreMetric>("overall");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselEdges, setCarouselEdges] = useState({
    start: true,
    end: false,
  });
  const scoped = useMemo(
    () => (region ? cities.filter((city) => city.region === region) : cities),
    [region],
  );
  const results = useMemo<ExploreMapResult[]>(() => {
    const normalized = query.trim().toLowerCase();
    return scoped
      .filter(
        (city) =>
          !normalized ||
          `${city.name} ${city.country} ${city.region}`
            .toLowerCase()
            .includes(normalized),
      )
      .map((city) => ({ city, score: exploreScore(city, metric) }))
      .sort(
        (a, b) => b.score - a.score || a.city.name.localeCompare(b.city.name),
      );
  }, [metric, query, scoped]);
  const selectedIndex = Math.max(
    0,
    results.findIndex((result) => result.city.id === selectedId),
  );
  const selectedResult = results[selectedIndex];
  const selected = selectedResult?.city;
  const selectedScore = selectedResult?.score ?? 0;
  const selectCity = useCallback((city: City) => setSelectedId(city.id), []);
  const showAll = () => {
    setSelectedId(undefined);
    router.replace("/explore", { scroll: false });
  };
  const scrollCards = (direction: -1 | 1) =>
    carouselRef.current?.scrollBy({
      left: carouselRef.current.clientWidth * 0.78 * direction,
      behavior: "smooth",
    });

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const updateEdges = () =>
      setCarouselEdges({
        start: carousel.scrollLeft < 4,
        end:
          carousel.scrollLeft + carousel.clientWidth >=
          carousel.scrollWidth - 4,
      });
    carousel.scrollTo({ left: 0 });
    updateEdges();
    carousel.addEventListener("scroll", updateEdges, { passive: true });
    const observer = new ResizeObserver(updateEdges);
    observer.observe(carousel);
    return () => {
      carousel.removeEventListener("scroll", updateEdges);
      observer.disconnect();
    };
  }, [results]);

  return (
    <div className="explorePage">
      <aside className="exploreSidebar">
        <p className="exploreKicker">CITY ATLAS</p>
        <h1>
          Find cities that match <em>your vibe.</em>
        </h1>
        <label className="exploreSearch">
          <Search />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search cities or regions"
            aria-label="Search cities or regions"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search">
              <X />
            </button>
          )}
        </label>
        <div className="exploreFilterHead">
          <span>WHAT MATTERS MOST?</span>
        </div>
        <div
          className="exploreFilters"
          role="group"
          aria-label="City ranking metric"
        >
          {exploreMetrics.map(({ key, label, Icon }) => (
            <button
              key={key}
              className={metric === key ? "isActive" : ""}
              aria-pressed={metric === key}
              onClick={() => {
                setMetric(key);
                setSelectedId(undefined);
              }}
            >
              <Icon />
              <span>{label}</span>
            </button>
          ))}
        </div>
        {region && (
          <div className="exploreRegion">
            <span>
              <Compass />
              {region}
            </span>
            <button onClick={showAll}>Show all</button>
          </div>
        )}
      </aside>

      <section className="exploreCenter" aria-label="City matches">
        <div className="exploreMapPanel">
          <div className="exploreMapMeta">
            <span>WORLD MAP</span>
            <small>
              {metric === "overall" ? "Overall match" : dnaLabels[metric]}
            </small>
          </div>
          <ExploreMap
            results={results}
            selectedId={selected?.id}
            onSelect={selectCity}
          />
        </div>
        <div className="exploreResults">
          <div className="exploreResultsHead">
            <div>
              <span>Cities</span>
            </div>
            {results.length > 0 && (
              <div className="exploreResultsNav">
                <button
                  onClick={() => scrollCards(-1)}
                  disabled={carouselEdges.start}
                  aria-label="Previous cities"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={() => scrollCards(1)}
                  disabled={carouselEdges.end}
                  aria-label="Next cities"
                >
                  <ChevronRight />
                </button>
              </div>
            )}
          </div>
          {results.length ? (
            <div
              className="exploreCardGrid"
              ref={carouselRef}
              tabIndex={0}
              aria-label="Scrollable city results"
            >
              {results.map(({ city, score }, index) => (
                <button
                  className={`exploreResultCard ${selected?.id === city.id ? "isSelected" : ""}`}
                  key={city.id}
                  onClick={() => selectCity(city)}
                  aria-pressed={selected?.id === city.id}
                >
                  <div className="exploreCardImage">
                    <img
                      src={imageAt(city.image, 600)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="exploreCardRank">{index + 1}</span>
                    <strong>{score}</strong>
                    <div>
                      <b>{city.name}</b>
                      <small>{city.country}</small>
                    </div>
                  </div>
                  <div className="exploreCardMeta">
                    <span>City DNA</span>
                    <i>
                      <b style={{ width: `${city.dna.safety}%` }} />
                      <b style={{ width: `${city.dna.transit}%` }} />
                      <b style={{ width: `${city.dna.nature}%` }} />
                    </i>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="exploreEmpty">
              <Search />
              <h2>No cities found</h2>
              <p>Try another city, country or region.</p>
              <button onClick={() => setQuery("")}>Clear search</button>
            </div>
          )}
        </div>
      </section>

      <aside
        key={selected?.id || "no-city"}
        className="exploreDetail"
        aria-live="polite"
        style={
          selected
            ? ({
                "--city-accent": selected.accent,
                "--score-angle": `${selectedScore * 3.6}deg`,
              } as React.CSSProperties)
            : undefined
        }
      >
        {selected ? (
          <>
            <div className="exploreDetailHero">
              <img
                src={imageAt(selected.image, 900)}
                alt={`${selected.name} city view`}
              />
              <div className="exploreDetailShade" />
              <div className="exploreDetailTop">
                <span>
                  {selectedIndex === 0
                    ? "TOP MATCH"
                    : `MATCH #${selectedIndex + 1}`}
                </span>
                <div
                  className="exploreScoreRing"
                  aria-label={`${selectedScore} match score`}
                >
                  <strong>{selectedScore}</strong>
                  <small>Match</small>
                </div>
              </div>
              <div className="exploreDetailTitle">
                <h2>{selected.name}</h2>
                <p>{selected.country}</p>
              </div>
            </div>
            <div className="exploreDetailBody">
              <div className="exploreDna">
                <span>CITY DNA</span>
                {detailMetrics.map((key) => (
                  <div key={key}>
                    <label>
                      <span>{dnaLabels[key]}</span>
                      <b>{selected.dna[key]}</b>
                    </label>
                    <i>
                      <b style={{ width: `${selected.dna[key]}%` }} />
                    </i>
                  </div>
                ))}
              </div>
              <div className="exploreFacts">
                <span>{selected.population} people</span>
                <span>avg {selected.temperature}°C</span>
              </div>
              <Link className="exploreCta" href={`/city/${selected.id}`}>
                Explore {selected.name}
                <ArrowRight />
              </Link>
            </div>
          </>
        ) : (
          <div className="exploreDetailEmpty">
            <Compass />
            <h2>Your next city is out there.</h2>
            <p>Adjust your search to discover a match.</p>
          </div>
        )}
      </aside>
    </div>
  );
}
