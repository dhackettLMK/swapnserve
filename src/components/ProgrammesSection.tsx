import { motion } from "framer-motion";
import { Shirt, Trophy, Sparkles } from "lucide-react";

const ProgrammesSection = () => {
  return (
    <section id="programmes" className="py-20 md:py-28 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-4">
            Our Programmes
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Built for the Betterment of Limerick
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Swap'n'Serve is a nonprofit organisation running community programmes that put
            dignity, sustainability, and neighbourhood pride first.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Flagship: Clothing Swap */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="relative rounded-3xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-lg hover:shadow-primary/5 overflow-hidden"
          >
            <div className="absolute top-5 right-5 inline-flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-secondary">
              <Sparkles size={12} />
              Flagship Event
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
              <Shirt size={26} className="text-primary" />
            </div>
            <h3 className="text-2xl font-display font-bold text-foreground mb-3">
              The Clothing Swap
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our flagship event. We gather clean, usable clothing from across Limerick and
              redistribute it to families and individuals, no questions asked. A simple,
              respectful exchange rooted in dignity and circular fashion.
            </p>
            <a
              href="#how-it-works"
              className="inline-flex items-center rounded-full border border-primary bg-primary/5 px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:scale-[1.02] active:scale-[0.98]"
            >
              See how it works
            </a>
          </motion.div>

          {/* Swap'n'Serve Cup */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="relative rounded-3xl border border-accent/30 bg-gradient-to-br from-primary to-primary/90 p-8 shadow-sm transition-shadow hover:shadow-xl hover:shadow-primary/20 overflow-hidden"
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-10 w-56 h-56 bg-secondary/10 rounded-full blur-3xl" />

            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center mb-5">
                <Trophy size={26} className="text-accent" />
              </div>
              <h3 className="text-2xl font-display font-bold text-primary-foreground mb-1">
                Swap'n'Serve Cup
              </h3>
              <p
                className="text-sm font-semibold uppercase tracking-[0.18em] mb-4"
                style={{ color: "hsl(var(--accent))" }}
              >
                Coming Soon
              </p>
              <p className="text-primary-foreground/85 leading-relaxed mb-4">
                A community football tournament with a €1,000 prize pot, bringing Limerick
                together on the pitch.
              </p>
              <p className="text-primary-foreground/75 leading-relaxed mb-6">
                Beyond the final whistle, we'll be installing permanent goals into the local
                community, so neighbours of every age can keep enjoying the game long after
                the trophy is lifted.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent">
                  €1,000 prize
                </span>
                <span className="inline-flex items-center rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1.5 text-xs font-medium text-primary-foreground/90">
                  Permanent goals installed
                </span>
                <span className="inline-flex items-center rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3 py-1.5 text-xs font-medium text-primary-foreground/90">
                  For the whole community
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProgrammesSection;
