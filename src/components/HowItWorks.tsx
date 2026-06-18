import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Package, Shirt, HandHeart, Users, Repeat } from "lucide-react";

const steps = [
  {
    icon: Package,
    title: "Collect",
    description:
      "We gather clean, usable clothing from schools, individuals, and local organisations across Limerick.",
    accent: "from-primary/15 to-primary/5",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: Shirt,
    title: "Sort & Prepare",
    description:
      "Volunteers sort donations by type and size, making sure everything is in good, wearable condition.",
    accent: "from-secondary/15 to-secondary/5",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
  },
  {
    icon: HandHeart,
    title: "Redistribute",
    description:
      "At the event, quality clothing is offered at €1 per item or free where appropriate. No sign-up, no means testing, no questions asked.",
    accent: "from-accent/20 to-accent/5",
    iconBg: "bg-accent/15",
    iconColor: "text-accent-foreground",
  },
  {
    icon: Users,
    title: "Upskill",
    description:
      "Volunteers gain real experience in event management, social media, partnerships, public speaking and leadership, opportunities Limerick has historically lacked.",
    accent: "from-primary/15 to-primary/5",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: Repeat,
    title: "Share the Leftovers",
    description:
      "Every remaining item is distributed equally amongst 10+ local Limerick charities. Nothing is sent to landfill. Every piece serves someone.",
    accent: "from-secondary/15 to-secondary/5",
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
  },
];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const progressWidth = useTransform(scrollYProgress, [0.1, 0.85], ["0%", "100%"]);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-20 md:py-28 bg-card overflow-hidden"
    >
      {/* Soft background blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-secondary/10 blur-3xl"
      />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 md:mb-20"
        >
          <span className="inline-block rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-4">
            The Process
          </span>
          <h2 className="text-3xl md:text-5xl font-section font-bold text-foreground mb-4 heading-underline in-view">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            A simple, respectful process from donation to doorstep.
          </p>
        </motion.div>

        {/* Desktop horizontal flow */}
        <div className="hidden lg:block relative">
          {/* Connector track */}
          <div className="absolute top-[3.25rem] left-[10%] right-[10%] h-1 rounded-full bg-border/70 overflow-hidden">
            <motion.div
              style={{ width: progressWidth }}
              className="h-full bg-gradient-to-r from-primary via-secondary to-primary rounded-full"
            />
          </div>

          <ol className="grid grid-cols-5 gap-4 relative">
            {steps.map((step, i) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center text-center"
              >
                {/* Numbered ring node sitting on the track */}
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="relative z-10 mb-6"
                >
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl scale-110" />
                  <div className="relative w-[6.5rem] h-[6.5rem] rounded-full bg-background border-2 border-border shadow-md flex items-center justify-center">
                    <div
                      className={`w-16 h-16 rounded-full ${step.iconBg} flex items-center justify-center`}
                    >
                      <step.icon size={28} className={step.iconColor} />
                    </div>
                    <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md ring-4 ring-card">
                      {i + 1}
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                  className={`group relative w-full rounded-3xl border border-border bg-gradient-to-br ${step.accent} backdrop-blur p-6 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all`}
                >
                  <h3 className="text-lg font-section font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* Mobile / tablet vertical timeline */}
        <ol className="lg:hidden relative max-w-xl mx-auto">
          {/* Vertical track */}
          <div className="absolute left-[2.05rem] top-2 bottom-2 w-0.5 rounded-full bg-border overflow-hidden">
            <motion.div
              style={{ height: progressWidth }}
              className="w-full bg-gradient-to-b from-primary via-secondary to-primary"
            />
          </div>

          {steps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="relative pl-20 pb-8 last:pb-0"
            >
              <motion.div
                whileHover={{ scale: 1.06, rotate: 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="absolute left-0 top-0"
              >
                <div className="relative w-[4.5rem] h-[4.5rem] rounded-full bg-background border-2 border-border shadow-md flex items-center justify-center">
                  <div
                    className={`w-12 h-12 rounded-full ${step.iconBg} flex items-center justify-center`}
                  >
                    <step.icon size={22} className={step.iconColor} />
                  </div>
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center shadow ring-4 ring-card">
                    {i + 1}
                  </span>
                </div>
              </motion.div>

              <div
                className={`rounded-3xl border border-border bg-gradient-to-br ${step.accent} p-5 hover-lift hover:shadow-lg hover:shadow-primary/5`}
              >
                <h3 className="text-lg font-section font-bold text-foreground mb-1.5">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;
