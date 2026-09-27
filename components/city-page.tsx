"use client";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Clock3, ExternalLink, Heart, X } from "lucide-react";
import { cities, City, dnaKeys, dnaLabels, imageAt } from "../lib/cities";
import { pad2 } from "../lib/format";
import {
  matchCity,
  matchTier,
  prefKeys,
  PrefKey,
} from "../lib/scoring";
import { preferencesStore, useFavorites } from "../lib/visitor";
import DnaBackdrop from "./dna-backdrop";

// The clock only renders on the client (null during SSR) so server and
// client markup always match; it then ticks while the page is open.
const subscribeClock = (tick: () => void) => {
  const id = window.setInterval(tick, 15_000);
  return () => window.clearInterval(id);
};
const currentMinute = () => Math.floor(Date.now() / 60_000);
const serverMinute = () => null;

function cityClock(city: City, minute: number | null) {
  if (minute === null) return null;
  const now = new Date(minute * 60_000);
  try {
    const hour =
      Number(
        new Intl.DateTimeFormat("en-US", {
          timeZone: city.timezone,
          hour: "numeric",
          hour12: false,
        }).format(now),
      ) % 24;
    const time = new Intl.DateTimeFormat("en-US", {
      timeZone: city.timezone,
      hour: "2-digit",
      minute: "2-digit",
    }).format(now);
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
    return { time, phase };
  } catch {
    return null;
  }
}

export default function CityPage({ city }: { city: City }) {
  const clock = cityClock(
    city,
    useSyncExternalStore(subscribeClock, currentMinute, serverMinute),
  );
  const { favorites, toggle } = useFavorites();
  const saved = favorites.includes(city.id);
  const cityIndex = cities.findIndex((candidate) => candidate.id === city.id);
  const nextCity = cities[(cityIndex + 1) % cities.length];
  return (
    <>
      <section
        className={`cityHero${clock ? ` phase-${clock.phase.toLowerCase()}` : ""}`}
        style={{ "--accent": city.accent } as React.CSSProperties}
      >
        <img
          src={imageAt(city.image, 1800)}
          alt={`${city.name} skyline`}
          fetchPriority="high"
        />
        <div className="cityOverlay" />
        <div className="cityMetaTop">
          <span>{city.coordinates[0].toFixed(4)}°</span>
          <span>{city.coordinates[1].toFixed(4)}°</span>
          {clock && <span>{clock.phase} light</span>}
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
                <Clock3 /> {clock?.time ?? "--:--"}
              </span>
              <span>avg {city.temperature}°C</span>
            </div>
          </div>
        </div>
        <button
          className={`saveFab ${saved ? "saved" : ""}`}
          onClick={() => toggle(city.id)}
          aria-label={`Save ${city.name}`}
          aria-pressed={saved}
        >
          <Heart fill={saved ? "currentColor" : "none"} />
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
      <Timeline key={city.id} city={city} />
      <section
        className="nextCity"
        style={{
          backgroundImage: `linear-gradient(100deg,#0007,#0002),url("${imageAt(nextCity.image, 1600)}")`,
        }}
      >
        <p className="eyebrow">NEXT CITY</p>
        <h2>{nextCity.name}</h2>
        <Link href={`/city/${nextCity.id}`}>
          Continue exploring <ArrowRight />
        </Link>
      </section>
    </>
  );
}

function CityDNA({ city }: { city: City }) {
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
        {dnaKeys.map((k, i) => (
          <motion.div
            className="dnaRow"
            key={k}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            title={`${dnaLabels[k]} measures how strongly this quality shapes everyday life in ${city.name}.`}
          >
            <span>{pad2(i + 1)}</span>
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

const matchHeadline = {
  strong: (name: string) => `${name} fits your lifestyle.`,
  possible: (name: string) => `${name} could work for you.`,
  weak: (name: string) => `${name} may not be your city.`,
};

function CityMatch({ city }: { city: City }) {
  const prefs = preferencesStore.useValue();
  const updatePref = (key: PrefKey, value: number) =>
    preferencesStore.set((current) => ({ ...current, [key]: value }));
  const { score, strong, tension } = matchCity(city, prefs);
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
          <h3>{matchHeadline[matchTier(score)](city.name)}</h3>
          <div className="matchNotes">
            <p>
              <Check /> Strong: {strong.map((k) => dnaLabels[k]).join(", ")}
            </p>
            <p>
              <X />{" "}
              {tension.length
                ? `Tension: ${tension.map((k) => dnaLabels[k]).join(", ")}`
                : "No major tension"}
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
      style={{ backgroundImage: `url(${imageAt(city.image, 1600)})` }}
    >
      <div className="timelineSticky">
        <p className="eyebrow">24 HOURS IN</p>
        <h2>{city.name}</h2>
        <p>One day. {stops.length} shifts in atmosphere.</p>
        <span className="timelineProgress">
          {pad2(active + 1)} / {pad2(stops.length)}
        </span>
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
                {pad2(i + 1)} · {s.label}
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
