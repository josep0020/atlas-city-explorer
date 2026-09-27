import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CityPage from "../../../components/city-page";
import { cities, getCity } from "../../../lib/cities";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return cities.map((city) => ({ id: city.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = getCity((await params).id);
  if (!city) return { title: "City not found — ATLAS" };
  const title = `${city.name}, ${city.country} — ATLAS`;
  return {
    title,
    description: city.description,
    openGraph: { title, description: city.description, images: ["/og.png"] },
    twitter: { title, description: city.description, images: ["/og.png"] },
  };
}

export default async function Page({ params }: Props) {
  const city = getCity((await params).id);
  if (!city) notFound();
  return <CityPage city={city} />;
}
