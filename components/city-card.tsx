"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { City, imageAt } from "../lib/cities";
import { pad2 } from "../lib/format";

const MotionLink = motion.create(Link);

export default function CityCard({ city, index }: { city: City; index: number }) {
  return (
    <MotionLink
      className="cityCard"
      href={`/city/${city.id}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -8 }}
    >
      <img
        src={imageAt(city.image, 900)}
        alt=""
        loading="lazy"
        decoding="async"
      />
      <span className="shade" />
      <div>
        <span className="cardIndex">{pad2(index + 1)}</span>
        <h3>{city.name}</h3>
        <p>
          {city.country} · avg {city.temperature}°C
        </p>
      </div>
      <span className="cardArrow">
        <ArrowRight />
      </span>
    </MotionLink>
  );
}
