import type { Metadata } from "next";
import Favorites from "../../components/favorites";

export const metadata: Metadata = { title: "Saved cities — ATLAS" };

export default function Page() {
  return <Favorites />;
}
