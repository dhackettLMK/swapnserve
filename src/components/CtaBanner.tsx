import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CtaBanner = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Whether you have an hour or a day, your time and energy can help families across
            Limerick. Join the Swap'n'Serve volunteer team today.
          </p>
          <Button variant="cta" size="lg" asChild className="min-w-[260px]">
            <a href="https://example.com/volunteer" className="inline-flex items-center gap-2">
              Sign Up to Volunteer
              <ArrowRight size={20} />
            </a>
          </Button>
          <p className="text-sm text-primary-foreground/60 mt-4">
            Takes 2 minutes. No experience needed.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaBanner;
