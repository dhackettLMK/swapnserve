import { motion } from "framer-motion";
import { Package, Shirt, HandHeart, Users, Repeat } from "lucide-react";

const steps = [
  {
    icon: Package,
    title: "Collect",
    description: "We gather clean, usable clothing from schools, individuals, and local organisations across Limerick.",
  },
  {
    icon: Shirt,
    title: "Sort & Prepare",
    description: "Volunteers sort donations by type and size, making sure everything is in good, wearable condition.",
  },
  {
    icon: HandHeart,
    title: "Redistribute",
    description: "At our swap events, anyone can pick up what they need. No sign-up, no paperwork, no questions asked.",
  },
  {
    icon: Users,
    title: "Empower",
    description: "We engage young people as volunteers, building confidence, skills, and a sense of purpose.",
  },
  {
    icon: Repeat,
    title: "Repeat & Grow",
    description: "Each event strengthens the cycle: more donors, more volunteers, more families supported.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-card">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-4">
            The Process
          </span>
          <h2 className="text-3xl md:text-4xl font-section font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            A simple, respectful process from donation to doorstep.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group flex flex-col items-center text-center rounded-3xl bg-background border border-border p-6 cursor-default transition-shadow hover:shadow-lg hover:shadow-primary/5"
            >
              <motion.div
                whileHover={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.5 }}
                className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors"
              >
                <step.icon size={26} className="text-primary" />
              </motion.div>
              <div className="text-xs font-semibold text-secondary mb-1 tracking-wide">Step {i + 1}</div>
              <h3 className="text-lg font-section font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
