import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, HandHeart, Clock } from "lucide-react";

/**
 * Placeholder open roles. Each entry is one card in the revealed list:
 * replace title, commitment and blurb with the real roles as they arrive.
 */
const roles = [
  {
    title: "Role title",
    commitment: "Commitment TBC",
    blurb: "Role details to be confirmed.",
  },
  {
    title: "Role title",
    commitment: "Commitment TBC",
    blurb: "Role details to be confirmed.",
  },
  {
    title: "Role title",
    commitment: "Commitment TBC",
    blurb: "Role details to be confirmed.",
  },
];

const LendAHand = () => {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="open-roles"
      className="relative py-20 md:py-28 bg-background overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/5 to-transparent"
      />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-semibold uppercase mb-4">
            <HandHeart size={14} />
            Get Involved
          </span>
          <h2 className="text-3xl md:text-5xl font-section font-bold text-foreground mb-4 heading-underline in-view">
            Want to lend a Hand?
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            There is always space for another pair of hands in Limerick. Have a
            look at what we are currently asking volunteers to cover.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto max-w-3xl"
        >
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls="open-roles-list"
            className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-accent/40 bg-primary px-6 py-6 text-left shadow-refined transition-all hover:border-accent/70 hover:shadow-lg hover:shadow-primary/10 md:px-8 md:py-7"
          >
            <span className="min-w-0">
              <span className="block font-section text-xl font-bold text-primary-foreground md:text-2xl">
                See open roles
              </span>
              <span className="mt-1 block text-sm text-primary-foreground/70">
                {open
                  ? "Hide the current list"
                  : `${roles.length} roles listed, more added as we need them`}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-3">
              <span className="hidden items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1.5 text-xs font-semibold text-primary-foreground sm:inline-flex">
                <Clock size={13} />
                Flexible
              </span>
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground ring-1 ring-accent/60"
              >
                <ChevronDown size={18} />
              </motion.span>
            </span>
          </button>
        </motion.div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="open-roles-list"
              key="roles"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-5xl overflow-hidden"
            >
              <ul className="grid gap-5 pt-10 sm:grid-cols-2 lg:grid-cols-3">
                {roles.map((role, i) => (
                  <motion.li
                    key={`${role.title}-${i}`}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.4 }}
                    className="flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-refined"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="font-section text-sm font-bold text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold uppercase text-muted-foreground">
                        Coming soon
                      </span>
                    </div>
                    <h3 className="font-section text-lg font-bold text-foreground mb-2">
                      {role.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {role.blurb}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
                      <span className="text-xs font-semibold uppercase text-muted-foreground">
                        {role.commitment}
                      </span>
                      <a
                        href="#volunteer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-accent"
                      >
                        Enquire
                        <ArrowRight size={15} />
                      </a>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default LendAHand;
