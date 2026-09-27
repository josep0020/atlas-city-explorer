import type { Metadata } from "next";
import Explore from "../../components/explore";
import { regions } from "../../lib/cities";

export const metadata: Metadata = { title: "Explore cities — ATLAS" };

type Props = { searchParams: Promise<{ region?: string | string[] }> };

export default async function Page({ searchParams }: Props) {
  const requested = (await searchParams).region;
  const region = regions.find((r) => r === requested);
  // Reset selection and filters whenever the region in the URL changes.
  return <Explore key={region ?? "all"} region={region} />;
}
