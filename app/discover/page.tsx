import type { Metadata } from "next";
import Discover from "../../components/discover";

export const metadata: Metadata = { title: "Find your city — ATLAS" };

export default function Page() {
  return <Discover />;
}
