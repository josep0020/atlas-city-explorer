import type { Metadata } from "next";
import Compare from "../../components/compare";

export const metadata: Metadata = { title: "Compare cities — ATLAS" };

export default function Page() {
  return <Compare />;
}
