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
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Our Impact So Far
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Numbers tell part of the story. Behind each one are real people and real change.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-card rounded-xl border border-border p-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <m.icon size={24} className="text-primary" />
              </div>
              <div className="text-3xl md:text-4xl font-display font-bold text-foreground mb-1">
                {m.value}
              </div>
              <div className="text-sm font-medium text-muted-foreground">{m.label}</div>
              <div className="text-xs text-muted-foreground/60 mt-1 italic">({m.note})</div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8 max-w-lg mx-auto">
          <strong>How we measure:</strong> All figures are self-reported and tracked by our volunteer
          team. We're working towards independent verification as we scale.
        </p>
      </div>
    </section>
  );
};

export default ImpactSnapshot;
