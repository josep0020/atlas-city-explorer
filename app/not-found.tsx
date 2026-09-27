import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="page">
      <div className="empty">
        <Compass />
        <h2>This place isn&apos;t on the map.</h2>
        <p>The city or page you were looking for doesn&apos;t exist.</p>
        <Link className="darkBtn" href="/explore">
          Explore cities <ArrowRight />
        </Link>
      </div>
    </div>
  );
}
