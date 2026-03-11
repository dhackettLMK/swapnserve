import { motion } from "framer-motion";
import { Shirt, Users, School, Recycle } from "lucide-react";

const metrics = [
  { icon: Shirt, value: "1,200+", label: "Items Redistributed", note: "placeholder" },
  { icon: Users, value: "50+", label: "Active Volunteers", note: "placeholder" },
  { icon: School, value: "10+", label: "Partner Schools", note: "placeholder" },
  { icon: Recycle, value: "500 kg", label: "Textile Waste Diverted", note: "placeholder" },
];

const ImpactSnapshot = () => {
  return (
    <section id="impact" className="py-20 md:py-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-4">
            Making a Difference
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Our Impact So Far
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Numbers tell part of the story. Behind each one are real people and real change.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
              className="rounded-3xl border border-border bg-card p-6 text-center shadow-sm cursor-default transition-shadow hover:shadow-lg hover:shadow-primary/5"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-12 h-12 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4"
              >
                <m.icon size={24} className="text-primary" />
              </motion.div>
              <div className="text-3xl md:text-4xl font-display font-bold text-foreground mb-1">
                {m.value}
              </div>
              <div className="text-sm font-medium text-muted-foreground">{m.label}</div>
              <div className="text-xs text-muted-foreground/60 mt-1 italic">({m.note})</div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-centre text-sm text-muted-foreground mt-8 max-w-lg mx-auto text-center"
        >
          <strong>How we measure:</strong> All figures are self-reported and tracked by our volunteer
          team. We are working towards independent verification as we scale.
        </motion.p>
      </div>
    </section>
  );
};

export default ImpactSnapshot;
