import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Recycle, Heart, Users, Leaf, ArrowRight, ChevronDown } from "lucide-react";
import logo from "@/assets/logo.png";
import heroBg from "@/assets/hero-bg.jpg";

const chips = [
  { label: "Youth-Led", icon: Users },
  { label: "Circular Fashion", icon: Recycle },
  { label: "Limerick Community", icon: Heart },
  { label: "Dignity-First", icon: Leaf },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Full background image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
        {/* Dark overlay with gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/75 to-primary/90" />
        {/* Color accent overlays */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-secondary/10" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[120px]" />
        <div className="absolute top-40 left-10 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px]" />
      </div>

      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container relative z-10 pt-28 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Staggered content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
            className="text-center"
          >
            {/* Large logo watermark behind text */}
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 },
              }}
              transition={{ duration: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] opacity-[0.03] pointer-events-none"
            >
              <img src={logo} alt="" className="w-full brightness-0 invert" aria-hidden="true" />
            </motion.div>

            {/* Chips */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex flex-wrap justify-center gap-2 mb-8"
            >
              {chips.map((chip, i) => (
                <motion.span
                  key={chip.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-primary-foreground/10 bg-primary-foreground/[0.06] backdrop-blur-sm text-primary-foreground/70 text-xs font-medium tracking-wide"
                >
                  <chip.icon size={13} className="text-accent" />
                  {chip.label}
                </motion.span>
              ))}
            </motion.div>

            {/* Main headline */}
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.7 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-display font-bold text-primary-foreground leading-[1.1] mb-6 text-balance tracking-tight"
            >
              Clothes Find
              <br className="hidden sm:block" /> New Homes.{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--secondary)))",
                }}
              >
                Communities
                <br className="hidden sm:block" /> Grow Stronger.
              </span>
            </motion.h1>

            {/* Subhead */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-primary-foreground/60 max-w-2xl mx-auto mb-10 leading-relaxed text-balance"
            >
              Swap'n'Serve is a Limerick-based community initiative redistributing clean,
              usable clothing to families and individuals—no questions asked. Founded by
              David Hackett, we believe in sustainability, dignity, and showing up for each
              other.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a
                href="https://example.com/volunteer"
                className="group relative inline-flex items-center gap-2.5 rounded-full bg-secondary px-8 py-4 text-base font-bold text-secondary-foreground shadow-2xl shadow-secondary/30 transition-all hover:shadow-secondary/50 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Sign Up to Volunteer</span>
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
              <a
                href="#events"
                className="group inline-flex items-center gap-2 rounded-full border-2 border-primary-foreground/20 bg-primary-foreground/[0.04] backdrop-blur-sm px-7 py-3.5 text-base font-semibold text-primary-foreground/80 transition-all hover:border-primary-foreground/40 hover:text-primary-foreground hover:bg-primary-foreground/[0.08]"
              >
                Donate Clothes
              </a>
            </motion.div>

            {/* Microcopy */}
            <motion.p
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
              }}
              transition={{ delay: 0.8 }}
              className="text-sm text-primary-foreground/35 mt-5"
            >
              Takes 2 minutes · No experience needed
            </motion.p>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.a
            href="#how-it-works"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center gap-2 text-primary-foreground/30 hover:text-primary-foreground/50 transition-colors"
          >
            <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
            <ChevronDown size={18} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
