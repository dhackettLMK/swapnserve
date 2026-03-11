import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CtaBanner = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary rounded-t-[3rem]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-[80px]" />

      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Whether you have an hour or a day, your time and energy can help families across
            Limerick. Join the Swap'n'Serve volunteer team today.
          </p>
          <motion.a
            href="https://example.com/volunteer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full bg-secondary px-8 py-4 text-lg font-bold text-secondary-foreground shadow-xl shadow-secondary/25 transition-shadow hover:shadow-2xl hover:shadow-secondary/40"
          >
            Sign Up to Volunteer
            <ArrowRight size={20} />
          </motion.a>
          <p className="text-sm text-primary-foreground/60 mt-4">
            Takes 2 minutes. No experience needed.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaBanner;
