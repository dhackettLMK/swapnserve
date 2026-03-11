import { motion } from "framer-motion";
import { Package, Shirt, HandHeart, Sparkles, Repeat } from "lucide-react";

const steps = [
  {
    icon: Package,
    title: "Collect",
    description: "We gather clean, usable clothing from schools, individuals, and local organisations across Limerick.",
  },
  {
    icon: Shirt,
    title: "Sort & Prepare",
    description: "Volunteers sort donations by type and size, ensuring everything is in good, wearable condition.",
  },
  {
    icon: HandHeart,
    title: "Redistribute",
    description: "At our swap events, anyone can pick up what they need—no sign-up, no paperwork, no questions asked.",
  },
  {
    icon: Sparkles,
    title: "Empower",
    description: "We engage young people as volunteers, building confidence, skills, and a sense of purpose.",
  },
  {
    icon: Repeat,
    title: "Repeat & Grow",
    description: "Each event strengthens the cycle—more donors, more volunteers, more families supported.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-card">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            A simple, respectful process from donation to doorstep.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <step.icon size={28} className="text-primary" />
              </div>
              <div className="text-sm font-semibold text-secondary mb-1">Step {i + 1}</div>
              <h3 className="text-lg font-display font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
