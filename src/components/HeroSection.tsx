import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Recycle, Heart, Users, Leaf } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const chips = [
  { label: "Youth-led", icon: Users },
  { label: "Circular fashion", icon: Recycle },
  { label: "Limerick community", icon: Heart },
  { label: "Dignity-first", icon: Leaf },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Folded clothes prepared for a community redistribution event"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/78 to-primary/88" />
      </div>

      <div className="container relative z-10 flex min-h-screen items-center pt-28 pb-16 md:pt-32">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground/90"
          >
            Community Initiative · Limerick
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-balance font-display text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl md:text-6xl"
          >
            Clothes Find New Homes.
            <span className="block text-primary-foreground">Communities Grow Stronger.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 max-w-2xl text-base leading-relaxed text-primary-foreground/90 md:text-lg"
          >
            Swap'n'Serve is a Limerick-based community initiative redistributing clean, usable
            clothing to families and individuals—no questions asked. Founded by David Hackett, we
            focus on sustainability, dignity, and neighbour-to-neighbour support.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-5 flex flex-col gap-3 sm:flex-row"
          >
            <Button variant="cta" size="lg" asChild className="min-w-[220px] rounded-full">
              <a href="https://example.com/volunteer">Sign Up to Volunteer</a>
            </Button>
            <a
              href="#events"
              className="inline-flex min-w-[220px] items-center justify-center rounded-full border border-primary-foreground/35 bg-primary-foreground/10 px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/18"
            >
              Donate Clothes
            </a>
          </motion.div>

          <p className="mb-8 text-sm text-primary-foreground/80">Takes 2 minutes. No experience needed.</p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-2"
          >
            {chips.map((chip) => (
              <span
                key={chip.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1.5 text-xs font-medium text-primary-foreground/90"
              >
                <chip.icon size={13} />
                {chip.label}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
