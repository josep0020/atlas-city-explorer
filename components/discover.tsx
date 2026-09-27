"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { cities, DNA, dnaLabels, imageAt } from "../lib/cities";
import { pad2 } from "../lib/format";
import { discoverMatches } from "../lib/scoring";
import PageTitle from "./page-title";

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

export default function Discover() {
  const [selected, setSelected] = useState<IntentLabel[]>([
    "Culture",
    "Great transit",
  ]);
  const recs = useMemo(
    () =>
      discoverMatches(
        cities,
        intents.filter((i) => selected.includes(i.label)).map((i) => i.key),
      ),
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
            aria-pressed={selected.includes(x.label)}
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
      {recs.length ? (
        <div className="recommendations">
          {recs.map(({ city, match, strengths }, i) => (
            <Link href={`/city/${city.id}`} key={city.id}>
              <img
                src={imageAt(city.image, 900)}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <span>{pad2(i + 1)}</span>
              <div>
                <p>{match}% alignment</p>
                <h3>{city.name}</h3>
                <small>
                  Strongest in{" "}
                  {strengths
                    .map((k) => dnaLabels[k].toLowerCase())
                    .join(" and ")}
                  .
                </small>
              </div>
              <ArrowRight />
            </Link>
          ))}
        </div>
      ) : (
        <p className="discoverHint">
          Pick at least one quality to see your cities.
        </p>
      )}
    </div>
  );
}
