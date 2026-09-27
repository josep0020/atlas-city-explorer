"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cities, City, DNA, dnaLabels, getCity } from "../lib/cities";
import { compareCities } from "../lib/scoring";
import PageTitle from "./page-title";

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

export default function Compare() {
  const [a, setA] = useState("tokyo");
  const [b, setB] = useState("barcelona");
  const ca = getCity(a) ?? cities[0];
  const cb = getCity(b) ?? cities[1];
  const { aWins, bWins, leader } = compareCities(ca, cb, keys);
  return (
    <div className="page comparePage">
      <PageTitle
        eyebrow="SIDE BY SIDE"
        title="City vs. city"
        text="Not which city is better. Which city is better for you."
      />
      <div className="compareSelectors">
        <CitySelect value={a} exclude={b} set={setA} label="First city" />
        <b>VS</b>
        <CitySelect value={b} exclude={a} set={setB} label="Second city" />
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
        {leader ? (
          <>
            <h2>
              {leader.name} leads this match, {Math.max(aWins, bWins)} to{" "}
              {Math.min(aWins, bWins)}.
            </h2>
            <Link className="darkBtn" href={`/city/${leader.id}`}>
              Explore the winner <ArrowRight />
            </Link>
          </>
        ) : (
          <h2>
            A draw: {ca.name} and {cb.name} win {aWins} categories each.
          </h2>
        )}
      </div>
    </div>
  );
}

function CitySelect({
  value,
  exclude,
  set,
  label,
}: {
  value: string;
  exclude: string;
  set: (x: string) => void;
  label: string;
}) {
  const c: City = getCity(value) ?? cities[0];
  return (
    <label
      className="selectCity"
      style={{ "--accent": c.accent } as React.CSSProperties}
    >
      <span>{c.country}</span>
      <select
        value={value}
        aria-label={label}
        onChange={(e) => set(e.target.value)}
      >
        {cities
          .filter((x) => x.id !== exclude)
          .map((x) => (
            <option value={x.id} key={x.id}>
              {x.name}
            </option>
          ))}
      </select>
    </label>
  );
}
