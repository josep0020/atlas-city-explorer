"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import { cities, regions } from "../lib/cities";
import { pad2 } from "../lib/format";
import CityCard from "./city-card";

const MotionLink = motion.create(Link);

export default function Home() {
  return (
    <>
      <section className="homeHero">
        <span className="homeHeroGlow glowPeach" aria-hidden="true" />
        <span className="homeHeroGlow glowAqua" aria-hidden="true" />
        <div className="homeHeroContent">
          <motion.div
            className="heroEditorialIndex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span>01</span>
            <i />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="heroEyebrow"
          >
            THE EMOTIONAL GEOGRAPHY OF CITIES
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            Explore the world<em>differently.</em>
          </motion.h1>
          <motion.p
            className="heroSub"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            Discover how cities feel, compare their personalities and find the
            places that match you.
          </motion.p>
          <motion.div
            className="heroActions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.27 }}
          >
            <Link className="heroPrimary" href="/explore">
              Explore cities <ArrowRight />
            </Link>
            <Link className="heroSecondary" href="/discover">
              Find your city <Compass />
            </Link>
          </motion.div>
        </div>
        <motion.figure
          className="homeHeroVisual"
          initial={{ opacity: 0, x: 34, scale: 0.985 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="heroImageFrame">
            <img
              className="homeHeroImage"
              src="https://images.unsplash.com/photo-1559581516-bd33e4cfaca6?auto=format&fit=crop&w=1800&q=85"
              alt="Sunlit glass architecture against a clear blue sky"
              fetchPriority="high"
            />
          </div>
        </motion.figure>
      </section>
      <Section
        title="Featured cities"
        kicker="CITY PULSE"
        aside={`${cities.length} cities, one living atlas`}
      >
        <div className="cityGrid">
          {cities.slice(0, 6).map((c, i) => (
            <CityCard city={c} key={c.id} index={i} />
          ))}
        </div>
      </Section>
      <motion.section
        className="continentBand"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="liquidScene" aria-hidden="true">
          <span className="liquidOrb orbOne" />
          <span className="liquidOrb orbTwo" />
          <span className="liquidRing" />
        </div>
        <motion.div
          className="continentIntro"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow dark">THE WORLD, CURATED</p>
          <h2>
            Follow a feeling,
            <br />
            not an itinerary.
          </h2>
          <p className="continentHint">
            Choose a region to open its cities in the atlas.
          </p>
        </motion.div>
        <div className="continentList">
          {regions.map((x, i) => (
            <MotionLink
              key={x}
              href={`/explore?region=${encodeURIComponent(x)}`}
              aria-label={`Explore cities in ${x}`}
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.65 }}
              transition={{
                duration: 0.58,
                delay: i * 0.09,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ x: 8 }}
              whileTap={{ scale: 0.985 }}
            >
              <b>{pad2(i + 1)}</b>
              <span>{x}</span>
              <ArrowRight />
            </MotionLink>
          ))}
        </div>
      </motion.section>
      <Section
        title="You might like"
        kicker="ATLAS PICKS"
        aside="Curated for culture, movement and light"
      >
        <div className="wideRow">
          {cities.slice(6, 10).map((c, i) => (
            <CityCard city={c} key={c.id} index={i} />
          ))}
        </div>
      </Section>
    </>
  );
}

function Section({
  title,
  kicker,
  aside,
  children,
}: {
  title: string;
  kicker: string;
  aside: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section">
      <div className="sectionHead">
        <div>
          <p className="eyebrow dark">{kicker}</p>
          <h2>{title}</h2>
        </div>
        <p>{aside}</p>
      </div>
      {children}
    </section>
  );
}
