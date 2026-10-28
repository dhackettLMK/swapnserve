import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Recycle, Heart, Users, Leaf } from "lucide-react";
import CupButtonBrand from "@/components/cup/CupButtonBrand";
import heroBg from "@/assets/hero-community.jpg";
import heroBgSmall from "@/assets/hero-community-sm.jpg";

const chips = [
  { label: "Youth-led, Limerick-born", icon: Users },
  { label: "Circular textiles", icon: Recycle },
  { label: "Aligned with UN SDG 12", icon: Leaf },
  { label: "No cost. No sign-up. No questions.", icon: Heart },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-[640px] overflow-hidden md:min-h-[720px]">
      <div className="absolute inset-0 bg-primary">
        <img
          src={heroBg}
          srcSet={`${heroBgSmall} 632w, ${heroBg} 1264w`}
          sizes="100vw"
          alt="The Swap'n'Serve volunteer team at a community event in Limerick"
          className="h-full w-full object-cover object-center"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          width={1264}
          height={848}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-primary/65 to-secondary/90" />
      </div>

      <div className="container relative z-10 flex min-h-[640px] items-end pt-28 pb-8 md:min-h-[720px] md:pt-40 md:pb-20">
        <div className="max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-3 text-xs font-semibold uppercase text-primary-foreground/80"
          >
            LIMERICK · COMMUNITY · OPPORTUNITY
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-balance font-display text-4xl font-bold leading-tight text-primary-foreground sm:text-6xl md:text-7xl"
          >
            Swap'n'Serve
            <span className="mt-3 block text-2xl font-medium text-primary-foreground/90 sm:text-3xl md:text-4xl">For the betterment of Limerick City.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 max-w-2xl text-sm leading-relaxed text-primary-foreground/90 md:mb-8 md:text-lg"
          >
            Swap'n'Serve is a Limerick-based grassroots organisation, founded in 2025, We are a non-profit where we use our operations as opportunities to connect in local youth talent with resources and a stage to develop and demonstrate their skills and opportunities to promote growth and widespread regeneration into Limerick city by approaching problems in a unique and innovative manner, a culture where hate is not tolerated in any form. We also host a range of world class events, you should come :)
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-5 flex flex-col gap-3 sm:flex-row"
          >
            <Button variant="cta" size="lg" asChild className="min-w-[220px] rounded-lg">
              <Link to="/cup?src=hero" aria-label="Sign Up to the Swap'n'Serve Cup">
                <CupButtonBrand wordmarkClass="h-5" cupClass="h-7" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              asChild
              className="min-w-[200px] rounded-lg border border-primary-foreground/35 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link to="/volunteer" aria-label="Want to volunteer with Swap'n'Serve">
                Want to Volunteer
              </Link>
            </Button>
          </motion.div>

          <div className="mb-4 md:mb-8" />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hidden flex-wrap gap-x-6 gap-y-2 border-t border-primary-foreground/20 pt-5 sm:flex"
          >
            {chips.map((chip, i) => (
              <motion.span
                key={chip.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-1.5 rounded-lg px-0 py-1.5 text-xs font-medium text-primary-foreground/90 cursor-default"
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
