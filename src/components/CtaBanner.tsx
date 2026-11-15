import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import CupButtonBrand from "@/components/cup/CupButtonBrand";

const CtaBanner = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary rounded-t-[3rem]" />

      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-section font-bold text-primary-foreground mb-6">
            Come down for the Cup.
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Team places are sold out, but we would love you to come and watch. Enjoy free food, live local musicians and poets, and cheer on the teams.
          </p>
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block"
          >
            <Link
              to="/cup?src=cta-banner"
              aria-label="Cup sold out. Come down and watch"
              className="inline-flex items-center gap-3 rounded-full bg-secondary px-8 py-4 shadow-sm shadow-secondary/25 transition-shadow hover:shadow-sm hover:shadow-secondary/40"
            >
              <CupButtonBrand wordmarkClass="h-5" cupClass="h-7" />
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaBanner;
