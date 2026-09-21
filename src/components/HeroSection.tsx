import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Recycle, Heart, Users, Leaf } from "lucide-react";
import heroBg from "@/assets/hero-community.png.asset.json";

const chips = [
  { label: "Youth-led, Limerick-born", icon: Users },
  { label: "Circular textiles", icon: Recycle },
  { label: "Aligned with UN SDG 12", icon: Leaf },
  { label: "No cost. No sign-up. No questions.", icon: Heart },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroBg.url}
          alt="The Swap'n'Serve volunteer team at a community event in Limerick"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/75 to-primary/90" />
      </div>

      <div className="container relative z-10 flex min-h-screen items-center pt-28 pb-16 md:pt-32">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground/90"
          >
            LIMERICK GRASSROOTS ORGANISATION ·
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-balance font-display text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl md:text-6xl"
          >
            An umbrella for the
            <span className="block text-primary-foreground">Betterment of Limerick City.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 max-w-2xl text-base leading-relaxed text-primary-foreground/90 md:text-lg"
          >
            Swap'n'Serve is a Limerick-based grassroots organisation, founded in 2025 by
            David Hackett. On the surface we are a community clothing event. Underneath, we
            are an umbrella for upskilling, financial relief, circular textiles and breaking
            down the antisocial barriers that hold our city back. Quality clothing for €1 or
            free, opportunities for everyone regardless of background, and a culture where
            hate is not tolerated in any form.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-5 flex flex-col gap-3 sm:flex-row"
          >
            <Button variant="cta" size="lg" asChild className="min-w-[220px] rounded-full">
              <Link to="/cup">Sign Up to the Swap'n'Serve Cup</Link>
            </Button>
            <a
              href="https://www.gofundme.com/f/swapnserve-2"
              className="inline-flex min-w-[220px] items-center justify-center rounded-full border border-primary-foreground/35 bg-primary-foreground/10 px-6 py-3 text-base font-semibold text-primary-foreground transition-all hover:bg-primary-foreground/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              Make a Donation
            </a>
          </motion.div>

          <div className="mb-8" />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-2"
          >
            {chips.map((chip, i) => (
              <motion.span
                key={chip.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1.5 text-xs font-medium text-primary-foreground/90 cursor-default"
              >
                <chip.icon size={13} />
                {chip.label}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
