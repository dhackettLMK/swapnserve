import { motion } from "framer-motion";
import { Handshake } from "lucide-react";

const PartnersSection = () => {
  return (
    <section id="partners" className="py-20 md:py-28 bg-primary/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-4">
            Together
          </span>
          <h2 className="text-3xl md:text-4xl font-section font-bold text-foreground mb-4">
            Community Partners
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            We work alongside schools, local organisations, and community groups across Limerick.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto rounded-3xl border border-primary/15 bg-card p-8 md:p-12 text-center shadow-sm"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6"
          >
            <Handshake size={32} className="text-primary" />
          </motion.div>
          <p className="text-muted-foreground mb-6">
            Partner logos and details will be displayed here as collaborations are confirmed. If
            your school or organisation would like to support Swap'n'Serve, we would love to hear from
            you.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["School Partner", "Community Org", "Local Brand", "Youth Group"].map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.06 }}
                className="rounded-full bg-primary/10 px-5 py-2.5 text-sm text-primary font-medium cursor-default"
              >
                {name}
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/60 mt-6 italic">
            Listing as a partner does not imply formal endorsement or affiliation.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersSection;
