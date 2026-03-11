import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Recycle, Heart, Users, Leaf } from "lucide-react";

const chips = [
  { label: "Youth-Led", icon: Users },
  { label: "Circular Fashion", icon: Recycle },
  { label: "Limerick Community", icon: Heart },
  { label: "Dignity-First", icon: Leaf },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 pb-16 overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-20 right-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {chips.map((chip) => (
              <span
                key={chip.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
              >
                <chip.icon size={14} />
                {chip.label}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight mb-6 text-balance">
            Clothes Find New Homes.{" "}
            <span className="text-primary">Communities Grow Stronger.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance">
            Swap'n'Serve is a Limerick-based community initiative redistributing clean, usable
            clothing to families and individuals—no questions asked. Founded by David Hackett,
            we believe in sustainability, dignity, and the power of showing up for each other.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="lg" asChild className="min-w-[220px]">
              <a href="https://example.com/volunteer">Sign Up to Volunteer</a>
            </Button>
            <Button variant="hero-outline" size="lg" asChild className="min-w-[220px]">
              <a href="#events">Donate Clothes</a>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Takes 2 minutes. No experience needed.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
