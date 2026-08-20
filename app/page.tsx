"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Compass,
  ExternalLink,
  Footprints,
  Heart,
  Leaf,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  SunMedium,
  Train,
  X,
} from "lucide-react";
import { cities, City, DNA, dnaLabels, getCity } from "./cities";
import ExploreMap, { ExploreMapResult } from "./explore-map";
import DnaBackdrop from "./dna-backdrop";

type Route = {
  page: "home" | "city" | "compare" | "explore" | "discover" | "favorites";
  id?: string;
  region?: string;
};
const parseRoute = (): Route => {
  if (typeof window === "undefined") return { page: "home" };
  const p = location.pathname;
  if (p.startsWith("/city/")) return { page: "city", id: p.split("/")[2] };
  if (p === "/compare") return { page: "compare" };
  if (p === "/explore")
    return {
      page: "explore",
      region: new URLSearchParams(location.search).get("region") || undefined,
    };
  if (p === "/discover") return { page: "discover" };
  if (p === "/favorites") return { page: "favorites" };
  return { page: "home" };
};
const pathFor = (r: Route) =>
  r.page === "home"
    ? "/"
    : r.page === "city"
      ? `/city/${r.id}`
      : r.page === "explore" && r.region
        ? `/explore?region=${encodeURIComponent(r.region)}`
        : `/${r.page}`;
function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  useEffect(() => {
    try {
      setFavorites(JSON.parse(localStorage.getItem("atlas-favorites") || "[]"));
    } catch {}
  }, []);
  const toggle = (id: string) =>
    setFavorites((v) => {
      const n = v.includes(id) ? v.filter((x) => x !== id) : [...v, id];
      localStorage.setItem("atlas-favorites", JSON.stringify(n));
      return n;
    });
  return { favorites, toggle };
}

export default function Atlas() {
  const [route, setRoute] = useState<Route>({ page: "home" });
  const [menu, setMenu] = useState(false);
  const fav = useFavorites();
  useEffect(() => {
    setRoute(parseRoute());
    const f = () => setRoute(parseRoute());
    addEventListener("popstate", f);
    return () => removeEventListener("popstate", f);
  }, []);
  const go = (r: Route) => {
    history.pushState({}, "", pathFor(r));
    setRoute(r);
    scrollTo({ top: 0, behavior: "smooth" });
    setMenu(false);
  };
  return (
    <main>
      <Nav route={route} go={go} menu={menu} setMenu={setMenu} />
      <AnimatePresence mode="wait">
        <motion.div
          key={pathFor(route)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {route.page === "home" && <Home go={go} />}{" "}
          {route.page === "city" && (
            <CityPage city={getCity(route.id || "tokyo")} go={go} fav={fav} />
          )}{" "}
          {route.page === "compare" && <Compare go={go} />}{" "}
          {route.page === "explore" && (
            <Explore go={go} region={route.region} />
          )}{" "}
          {route.page === "discover" && <Discover go={go} />}{" "}
          {route.page === "favorites" && <Favorites go={go} fav={fav} />}
        </motion.div>
      </AnimatePresence>
      {route.page !== "explore" && <Footer go={go} />}
    </main>
  );
}

function Nav({
  route,
  go,
  menu,
  setMenu,
}: {
  route: Route;
  go: (r: Route) => void;
  menu: boolean;
  setMenu: (x: boolean) => void;
}) {
  const links: [Route["page"], string][] = [
    ["explore", "Explore"],
    ["compare", "Compare"],
    ["discover", "Find your city"],
    ["favorites", "Saved"],
  ];
  const homeNav = route.page === "home";
  const navClass = `nav navAtlas${route.page === "city" ? " navAtlasOverlay" : ""}`;
  return (
    <>
      <header className={navClass}>
        <button className="brand" onClick={() => go({ page: "home" })}>
          ATLAS<span>°</span>
        </button>
        <nav>
          {links.map(([p, l]) => (
            <button
              className={route.page === p || (homeNav && p === "explore") ? "active" : ""}
              key={p}
              onClick={() => go({ page: p })}
            >
              {l}
            </button>
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
          {links.map(([p, l]) => (
            <button
              className={route.page === p || (homeNav && p === "explore") ? "active" : ""}
              key={p}
              onClick={() => go({ page: p })}
            >
              {l}
              <ArrowRight />
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function Home({ go }: { go: (r: Route) => void }) {
  const regions = [
    "Asia",
    "Europe",
    "South America",
    "North America",
    "Oceania",
  ];
  return (
    <>
      <section className="homeHero">
        <span className="homeHeroGlow glowPeach" aria-hidden="true" />
        <span className="homeHeroGlow glowAqua" aria-hidden="true" />
        <div className="homeHeroContent">
          <motion.div
            className="heroEditorialIndex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span>01</span>
            <i />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="heroEyebrow"
          >
            THE EMOTIONAL GEOGRAPHY OF CITIES
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            Explore the world<em>differently.</em>
          </motion.h1>
          <motion.p
            className="heroSub"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            Discover how cities feel, compare their personalities and find the
            places that match you.
          </motion.p>
          <motion.div
            className="heroActions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.27 }}
          >
            <button
              className="heroPrimary"
              onClick={() => go({ page: "explore" })}
            >
              Explore cities <ArrowRight />
            </button>
            <button
              className="heroSecondary"
              onClick={() => go({ page: "discover" })}
            >
              Find your city <Compass />
            </button>
          </motion.div>
        </div>
        <motion.figure
          className="homeHeroVisual"
          initial={{ opacity: 0, x: 34, scale: 0.985 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="heroImageFrame">
            <img
              className="homeHeroImage"
              src="https://images.unsplash.com/photo-1559581516-bd33e4cfaca6?auto=format&fit=crop&w=1800&q=88"
              alt="Sunlit glass architecture against a clear blue sky"
            />
          </div>
        </motion.figure>
      </section>
      <Section
        title="Trending now"
        kicker="CITY PULSE"
        aside="12 cities, one living atlas"
      >
        <div className="cityGrid">
          {cities.slice(0, 6).map((c, i) => (
            <CityCard city={c} key={c.id} index={i} go={go} />
          ))}
        </div>
      </Section>
      <motion.section
        className="continentBand"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="liquidScene" aria-hidden="true">
          <span className="liquidOrb orbOne" />
          <span className="liquidOrb orbTwo" />
          <span className="liquidRing" />
        </div>
        <motion.div
          className="continentIntro"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow dark">THE WORLD, CURATED</p>
          <h2>
            Follow a feeling,
            <br />
            not an itinerary.
          </h2>
          <p className="continentHint">
            Choose a region to open its cities in the live atlas.
          </p>
        </motion.div>
        <div className="continentList">
          {regions.map((x, i) => (
            <motion.button
              key={x}
              aria-label={`Explore cities in ${x}`}
              onClick={() => go({ page: "explore", region: x })}
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.65 }}
              transition={{
                duration: 0.58,
                delay: i * 0.09,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ x: 8 }}
              whileTap={{ scale: 0.985 }}
            >
              <b>0{i + 1}</b>
              <span>{x}</span>
              <ArrowRight />
            </motion.button>
          ))}
        </div>
      </motion.section>
      <Section
        title="You might like"
        kicker="ATLAS PICKS"
        aside="Based on culture, movement and light"
      >
        <div className="wideRow">
          {cities.slice(6, 10).map((c, i) => (
            <CityCard city={c} key={c.id} index={i} go={go} />
          ))}
        </div>
      </Section>
    </>
  );
}
function Section({
  title,
  kicker,
  aside,
  children,
}: {
  title: string;
  kicker: string;
  aside: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section">
      <div className="sectionHead">
        <div>
          <p className="eyebrow dark">{kicker}</p>
          <h2>{title}</h2>
        </div>
        <p>{aside}</p>
      </div>
      {children}
    </section>
  );
}
function CityCard({
  city,
  index,
  go,
}: {
  city: City;
  index: number;
  go: (r: Route) => void;
}) {
  return (
    <motion.button
      className="cityCard"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -8 }}
      onClick={() => go({ page: "city", id: city.id })}
    >
      <img src={city.image} alt="" />
      <span className="shade" />
      <div>
        <span className="cardIndex">0{index + 1}</span>
        <h3>{city.name}</h3>
        <p>
          {city.country} · {city.temperature}°C
        </p>
      </div>
      <span className="cardArrow">
        <ArrowRight />
      </span>
    </motion.button>
  );
}

function localHour(city: City) {
  try {
    return (
      Number(
        new Intl.DateTimeFormat("en-US", {
          timeZone: city.timezone,
          hour: "numeric",
          hour12: false,
        }).format(new Date()),
      ) % 24
    );
  } catch {
    return 12;
  }
}
function CityPage({
  city,
  go,
  fav,
}: {
  city: City;
  go: (r: Route) => void;
  fav: { favorites: string[]; toggle: (s: string) => void };
}) {
  const hour = localHour(city);
  const phase =
    hour < 6
      ? "Night"
      : hour < 11
        ? "Morning"
        : hour < 17
          ? "Day"
          : hour < 21
            ? "Sunset"
            : "Night";
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: city.timezone,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
  const cityIndex = cities.findIndex((candidate) => candidate.id === city.id);
  const nextCity = cities[(cityIndex + 1) % cities.length] || city;
  return (
    <>
      <section
        className={`cityHero phase-${phase.toLowerCase()}`}
        style={{ "--accent": city.accent } as React.CSSProperties}
      >
        <img src={city.image} alt={`${city.name} skyline`} />
        <div className="cityOverlay" />
        <div className="cityMetaTop">
          <span>{city.coordinates[0].toFixed(4)}°</span>
          <span>{city.coordinates[1].toFixed(4)}°</span>
          <span>{phase} light</span>
        </div>
        <div className="cityTitle">
          <p>
            {city.country} · {city.region}
          </p>
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {city.name.toUpperCase()}
          </motion.h1>
          <div className="cityBottom">
            <p>“{city.description}”</p>
            <div>
              <span>
                <Clock3 /> {time}
              </span>
              <span>{city.temperature}°C</span>
            </div>
          </div>
        </div>
        <button
          className={`saveFab ${fav.favorites.includes(city.id) ? "saved" : ""}`}
          onClick={() => fav.toggle(city.id)}
          aria-label="Save city"
        >
          <Heart
            fill={fav.favorites.includes(city.id) ? "currentColor" : "none"}
          />
        </button>
      </section>
      <section className="intro">
        <p className="eyebrow dark">CITY PORTRAIT · {city.population} PEOPLE</p>
        <h2>
          {city.name} {city.portrait.lead} <em>{city.portrait.emphasis}</em>
        </h2>
        <p>{city.portrait.description}</p>
      </section>
      <CityDNA city={city} />
      <CityMatch city={city} />
      <Timeline city={city} />
      <section
        key={`${city.id}-${nextCity.id}`}
        className="nextCity"
        style={{
          backgroundImage: `linear-gradient(100deg,#0007,#0002),url("${nextCity.image}")`,
        }}
      >
        <p className="eyebrow">NEXT CITY</p>
        <h2>{nextCity.name}</h2>
        <button onClick={() => go({ page: "city", id: nextCity.id })}>
          Continue exploring <ArrowRight />
        </button>
      </section>
    </>
  );
}

function CityDNA({ city }: { city: City }) {
  const keys = (Object.keys(city.dna) as (keyof DNA)[]).slice(0, 8);
  return (
    <section
      className="dna"
      style={{ "--accent": city.accent } as React.CSSProperties}
    >
      <DnaBackdrop accent={city.accent} />
      <div className="dnaIntro">
        <p className="eyebrow">CITY DNA / 01</p>
        <h2>
          The city,
          <br />
          <em>decoded.</em>
        </h2>
        <p>
          A living signature built from the qualities that shape daily life.
        </p>
      </div>
      <div className="dnaList">
        {keys.map((k, i) => (
          <motion.div
            className="dnaRow"
            key={k}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            title={`${dnaLabels[k]} measures how strongly this quality shapes everyday life in ${city.name}.`}
          >
            <span>0{i + 1}</span>
            <b>{dnaLabels[k]}</b>
            <div className="bar">
              <motion.i
                initial={{ width: 0 }}
                whileInView={{ width: `${city.dna[k]}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.05 }}
              />
            </div>
            <strong>{city.dna[k]}</strong>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
const prefKeys: (keyof DNA)[] = [
  "cost",
  "nature",
  "nightlife",
  "transit",
  "safety",
  "culture",
];
function PreferenceSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const thumbOffset = 12 - value * 0.24;
  return (
    <div className="preference">
      <span>{label}</span>
      <div className="preferenceControl">
        <output style={{ left: `calc(${value}% + ${thumbOffset}px)` }}>
          {value}%
        </output>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          aria-label={`${label} importance`}
          aria-valuetext={`${value} percent`}
          style={{ "--value": `${value}%` } as React.CSSProperties}
          onChange={(e) => onChange(Number(e.currentTarget.value))}
        />
      </div>
    </div>
  );
}
function CityMatch({ city }: { city: City }) {
  const [prefs, setPrefs] = useState<Record<string, number>>(() => {
    const defaults = Object.fromEntries(prefKeys.map((k) => [k, 70]));
    if (typeof window === "undefined") return defaults;
    try {
      return {
        ...defaults,
        ...JSON.parse(localStorage.getItem("atlas-preferences") || "{}"),
      };
    } catch {
      return defaults;
    }
  });
  const updatePref = (key: keyof DNA, value: number) =>
    setPrefs((current) => ({ ...current, [key]: value }));
  const score = Number(
    (
      prefKeys.reduce(
        (s, k) => s + (100 - Math.abs(city.dna[k] - prefs[k])),
        0,
      ) / prefKeys.length
    ).toFixed(1),
  );
  const ranked = [...prefKeys].sort(
    (a, b) =>
      Math.abs(city.dna[a] - prefs[a]) - Math.abs(city.dna[b] - prefs[b]),
  );
  useEffect(() => {
    localStorage.setItem("atlas-preferences", JSON.stringify(prefs));
  }, [prefs]);
  return (
    <section className="match">
      <div className="matchHead">
        <p className="eyebrow dark">PERSONAL COMPASS / 02</p>
        <h2>Would I live here?</h2>
        <p>Tell Atlas what matters. We&apos;ll measure the chemistry.</p>
      </div>
      <div className="matchGrid">
        <div className="sliders">
          {prefKeys.map((k) => (
            <PreferenceSlider
              key={k}
              label={dnaLabels[k]}
              value={prefs[k]}
              onChange={(value) => updatePref(k, value)}
            />
          ))}
        </div>
        <div className="scoreCard">
          <p>YOUR MATCH</p>
          <motion.strong
            key={score}
            initial={{ opacity: 0.4, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {score.toFixed(1)}
            <sup>%</sup>
          </motion.strong>
          <h3>{city.name} matches your lifestyle.</h3>
          <div className="matchNotes">
            <p>
              <Check /> Strong:{" "}
              {ranked
                .slice(0, 3)
                .map((k) => dnaLabels[k])
                .join(", ")}
            </p>
            <p>
              <X /> Tension:{" "}
              {ranked
                .slice(-2)
                .map((k) => dnaLabels[k])
                .join(", ")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
function Timeline({ city }: { city: City }) {
  const [active, setActive] = useState(0);
  const stops = city.timeline;
  return (
    <section
      className={`timeline ambient-${active}`}
      style={{ backgroundImage: `url(${city.image})` }}
    >
      <div className="timelineSticky">
        <p className="eyebrow">24 HOURS IN</p>
        <h2>{city.name}</h2>
        <p>One day. Six shifts in atmosphere.</p>
        <span className="timelineProgress">0{active + 1} / 06</span>
        <small className="timelineVerified">
          Facts checked {city.verifiedAt}
        </small>
      </div>
      <div className="stops">
        {stops.map((s, i) => (
          <motion.article
            className={active === i ? "active" : ""}
            key={s.time}
            initial={{ opacity: 0.25, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            onViewportEnter={() => setActive(i)}
            viewport={{ margin: "-25% 0px -25%" }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <span>{s.time}</span>
            <div>
              <p>
                0{i + 1} · {s.label}
              </p>
              <h3>{s.fact}</h3>
              <a
                className="timelineSource"
                href={s.sourceUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open source for ${city.name}: ${s.label}`}
              >
                Source: {s.sourceLabel}
                <ExternalLink />
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Compare({ go }: { go: (r: Route) => void }) {
  const [a, setA] = useState("tokyo"),
    [b, setB] = useState("barcelona");
  const ca = getCity(a),
    cb = getCity(b);
  const keys: (keyof DNA)[] = [
    "cost",
    "weather",
    "transit",
    "walkability",
    "nightlife",
    "culture",
    "safety",
    "nature",
  ];
  const lead = keys.filter((k) => ca.dna[k] > cb.dna[k]).length > 4 ? ca : cb;
  return (
    <div className="page comparePage">
      <PageTitle
        eyebrow="SIDE BY SIDE"
        title="City vs. city"
        text="Not which city is better. Which city is better for you."
      />
      <div className="compareSelectors">
        <CitySelect value={a} set={setA} />
        <b>VS</b>
        <CitySelect value={b} set={setB} />
      </div>
      <div className="compareDuel">
        {keys.map((k) => (
          <div className="duel" key={k}>
            <div className={ca.dna[k] >= cb.dna[k] ? "winner" : ""}>
              <strong>{ca.dna[k]}</strong>
              <i style={{ width: `${ca.dna[k]}%`, background: ca.accent }} />
            </div>
            <span>{dnaLabels[k]}</span>
            <div className={cb.dna[k] >= ca.dna[k] ? "winner" : ""}>
              <strong>{cb.dna[k]}</strong>
              <i style={{ width: `${cb.dna[k]}%`, background: cb.accent }} />
            </div>
          </div>
        ))}
      </div>
      <div className="verdict">
        <p>THE VERDICT</p>
        <h2>{lead.name} leads this match.</h2>
        <button
          className="darkBtn"
          onClick={() => go({ page: "city", id: lead.id })}
        >
          Explore the winner <ArrowRight />
        </button>
      </div>
    </div>
  );
}
function CitySelect({
  value,
  set,
}: {
  value: string;
  set: (x: string) => void;
}) {
  const c = getCity(value);
  return (
    <label
      className="selectCity"
      style={{ "--accent": c.accent } as React.CSSProperties}
    >
      <span>{c.country}</span>
      <select value={value} onChange={(e) => set(e.target.value)}>
        {cities.map((x) => (
          <option value={x.id} key={x.id}>
            {x.name}
          </option>
        ))}
      </select>
    </label>
  );
}

type ExploreMetric =
  | "overall"
  | "cost"
  | "safety"
  | "nightlife"
  | "transit"
  | "weather"
  | "walkability"
  | "nature";
const exploreMetricKeys: Exclude<ExploreMetric, "overall">[] = [
  "cost",
  "safety",
  "nightlife",
  "transit",
  "weather",
  "walkability",
  "nature",
];
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
const exploreScore = (city: City, metric: ExploreMetric) =>
  metric === "overall"
    ? Math.round(
        exploreMetricKeys.reduce((total, key) => total + city.dna[key], 0) /
          exploreMetricKeys.length,
      )
    : city.dna[metric];
const detailMetrics: (keyof DNA)[] = ["safety", "transit", "nature"];

function Explore({ go, region }: { go: (r: Route) => void; region?: string }) {
  const [metric, setMetric] = useState<ExploreMetric>("overall");
  const [activeRegion, setActiveRegion] = useState(region);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselEdges, setCarouselEdges] = useState({
    start: true,
    end: false,
  });
  const scoped = useMemo(
    () =>
      activeRegion
        ? cities.filter((city) => city.region === activeRegion)
        : cities,
    [activeRegion],
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
  const selectedResult =
    results.find((result) => result.city.id === selectedId) || results[0];
  const selected = selectedResult?.city;
  const selectedScore = selectedResult?.score ?? 0;
  const selectCity = (city: City) => setSelectedId(city.id);
  const showAll = () => {
    setActiveRegion(undefined);
    setSelectedId(undefined);
    history.replaceState({}, "", "/explore");
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
        <p className="exploreKicker">LIVE ATLAS</p>
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
        {activeRegion && (
          <div className="exploreRegion">
            <span>
              <Compass />
              {activeRegion}
            </span>
            <button onClick={showAll}>Show all</button>
          </div>
        )}
      </aside>

      <section className="exploreCenter" aria-label="City matches">
        <div className="exploreMapPanel">
          <div className="exploreMapMeta">
            <span>LIVE WORLD MAP</span>
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
                    <img src={city.image} alt="" />
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
              <img src={selected.image} alt={`${selected.name} city view`} />
              <div className="exploreDetailShade" />
              <div className="exploreDetailTop">
                <span>TOP MATCH</span>
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
                <span>{selected.temperature}°C now</span>
              </div>
              <button
                className="exploreCta"
                onClick={() => go({ page: "city", id: selected.id })}
              >
                Explore {selected.name}
                <ArrowRight />
              </button>
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
type IntentLabel =
  | "Adventure"
  | "Career"
  | "Nightlife"
  | "Calm"
  | "Nature"
  | "Culture"
  | "Affordable living"
  | "Great transit";
const intentIconPaths: Record<IntentLabel, React.ReactNode> = {
  Adventure: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" />
    </>
  ),
  Career: (
    <>
      <path d="M12 12h.01" />
      <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <path d="M22 13a18.15 18.15 0 0 1-20 0" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </>
  ),
  Nightlife: (
    <>
      <path d="M12 12 4.207 4.207A.707.707 0 0 1 4.707 3h14.586a.707.707 0 0 1 .5 1.207z" />
      <path d="M12 12v10" />
      <path d="M7 22h10" />
    </>
  ),
  Calm: (
    <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
  ),
  Nature: (
    <>
      <path d="m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z" />
      <path d="M12 22v-3" />
    </>
  ),
  Culture: (
    <>
      <path d="M10 18v-7" />
      <path d="M11.119 2.205a2 2 0 0 1 1.762 0l7.84 3.846A.5.5 0 0 1 20.5 7h-17a.5.5 0 0 1-.22-.949z" />
      <path d="M14 18v-7" />
      <path d="M18 18v-7" />
      <path d="M3 22h18" />
      <path d="M6 18v-7" />
    </>
  ),
  "Affordable living": (
    <>
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </>
  ),
  "Great transit": (
    <>
      <path d="M8 3.1V7a4 4 0 0 0 8 0V3.1" />
      <path d="m9 15-1-1" />
      <path d="m15 15 1-1" />
      <path d="M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z" />
      <path d="m8 19-2 3" />
      <path d="m16 19 2 3" />
    </>
  ),
};
function IntentIcon({ label }: { label: IntentLabel }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {intentIconPaths[label]}
    </svg>
  );
}
const intents: { label: IntentLabel; key: keyof DNA }[] = [
  { label: "Adventure", key: "energy" },
  { label: "Career", key: "density" },
  { label: "Nightlife", key: "nightlife" },
  { label: "Calm", key: "safety" },
  { label: "Nature", key: "nature" },
  { label: "Culture", key: "culture" },
  { label: "Affordable living", key: "cost" },
  { label: "Great transit", key: "transit" },
];
function Discover({ go }: { go: (r: Route) => void }) {
  const [selected, setSelected] = useState<string[]>([
    "Culture",
    "Great transit",
  ]);
  const recs = useMemo(
    () =>
      cities
        .map((c) => ({
          ...c,
          match: Math.round(
            selected.reduce(
              (s, x) => s + c.dna[intents.find((i) => i.label === x)!.key],
              0,
            ) / (selected.length || 1),
          ),
        }))
        .sort((a, b) => b.match - a.match)
        .slice(0, 3),
    [selected],
  );
  return (
    <div className="page discover">
      <PageTitle
        eyebrow="DISCOVERY MODE"
        title="Find your city"
        text="Choose the feelings and qualities you want more of."
      />
      <div className="intentGrid">
        {intents.map((x) => (
          <button
            className={selected.includes(x.label) ? "selected" : ""}
            key={x.label}
            onClick={() =>
              setSelected((v) =>
                v.includes(x.label)
                  ? v.filter((y) => y !== x.label)
                  : [...v, x.label],
              )
            }
          >
            <IntentIcon label={x.label} />
            {x.label}
          </button>
        ))}
      </div>
      <p className="recommendLabel">YOUR CITIES</p>
      <div className="recommendations">
        {recs.map((c, i) => (
          <button onClick={() => go({ page: "city", id: c.id })} key={c.id}>
            <img src={c.image} alt="" />
            <span>0{i + 1}</span>
            <div>
              <p>{c.match}% alignment</p>
              <h3>{c.name}</h3>
              <small>
                Strong in{" "}
                {selected.slice(0, 2).join(" and ").toLowerCase() ||
                  "urban discovery"}
                .
              </small>
            </div>
            <ArrowRight />
          </button>
        ))}
      </div>
    </div>
  );
}
function Favorites({
  go,
  fav,
}: {
  go: (r: Route) => void;
  fav: { favorites: string[]; toggle: (s: string) => void };
}) {
  const saved = cities.filter((c) => fav.favorites.includes(c.id));
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
            <CityCard city={c} go={go} index={i} key={c.id} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <Bookmark />
          <h2>Your atlas is still open.</h2>
          <p>Save cities as you explore and they&apos;ll appear here.</p>
          <button className="darkBtn" onClick={() => go({ page: "explore" })}>
            Explore cities <ArrowRight />
          </button>
        </div>
      )}
    </div>
  );
}
function PageTitle({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="pageTitle">
      <p className="eyebrow dark">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{text}</p>
    </div>
  );
}
function Footer({ go }: { go: (r: Route) => void }) {
  return (
    <footer>
      <button className="brand" onClick={() => go({ page: "home" })}>
        ATLAS<span>°</span>
      </button>
      <p>Find your place in the world.</p>
      <div>
        <button onClick={() => go({ page: "explore" })}>Explore</button>
        <button onClick={() => go({ page: "compare" })}>Compare</button>
        <button onClick={() => go({ page: "discover" })}>Discover</button>
      </div>
      <small>© 2026 ATLAS · Santiago / The world</small>
    </footer>
  );
}
