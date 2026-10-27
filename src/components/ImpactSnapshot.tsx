import { motion } from "framer-motion";
import { Shirt, Users, School, Recycle, Heart } from "lucide-react";

const metrics = [
  { icon: Shirt, value: "4,000+", label: "Items Redistributed" },
  { icon: Users, value: "75+", label: "Active Volunteers" },
  { icon: School, value: "5", label: "Partner Schools" },
  { icon: Recycle, value: "1,200+ kg", label: "Textile Waste Diverted" },
  { icon: Heart, value: "10+", label: "Local Charities Supported" },
];

const ImpactSnapshot = () => {
  return (
    <section id="impact" className="py-20 md:py-28 bg-primary relative overflow-hidden">

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-left mb-10"
        >
          <span className="inline-block rounded-full bg-primary-foreground/15 text-primary-foreground px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-4">
            Making a Difference
          </span>
          <h2 className="text-3xl md:text-4xl font-section font-bold text-primary-foreground mb-4">
            Our Impact So Far
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto">
            Two events in. Aligned with the EU Strategy for Sustainable and Circular
            Textiles and UN SDG 12. Built by Limerick, for Limerick.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
              className={`rounded-xl border border-primary-foreground/15 bg-primary-foreground/10 backdrop-blur-sm p-6 text-center shadow-sm cursor-default transition-shadow hover:shadow-lg hover:shadow-primary-foreground/5 ${
                i === 0
                  ? "col-span-2 lg:col-span-2 lg:row-span-2 flex flex-col justify-center items-center bg-primary-foreground/15"
                  : "lg:col-span-2"
              }`}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`mx-auto rounded-lg bg-primary-foreground/15 flex items-center justify-center mb-4 ${
                  i === 0 ? "w-16 h-16 lg:w-20 lg:h-20" : "w-12 h-12"
                }`}
              >
                <m.icon size={i === 0 ? 36 : 24} className="text-primary-foreground" />
              </motion.div>
              <div
                className={`font-section font-bold text-primary-foreground mb-1 ${
                  i === 0 ? "text-5xl lg:text-6xl" : "text-3xl md:text-4xl"
                }`}
              >
                {m.value}
              </div>
              <div className={`font-medium text-primary-foreground/80 ${i === 0 ? "text-base" : "text-sm"}`}>
                {m.label}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm text-primary-foreground/60 mt-8 max-w-lg mx-auto text-center"
        >
          <strong className="text-primary-foreground/80">How we measure:</strong> All figures are self-reported and tracked by our volunteer
          team. We are working towards independent verification as we scale.
        </motion.p>
      </div>
    </section>
  );
};

export default ImpactSnapshot;
