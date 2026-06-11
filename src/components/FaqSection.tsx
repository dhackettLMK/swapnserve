import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is Swap'n'Serve?",
    a: "Swap'n'Serve is a community-led clothing redistribution initiative based in Limerick. We collect clean, usable clothing and redistribute it to families and individuals who can use it, free of charge and with no questions asked.",
  },
  {
    q: "Who can attend the swap events?",
    a: "Anyone. Our events are open to all members of the community. There is no sign-up, no paperwork, and no eligibility check. You simply come along and take what you need.",
  },
  {
    q: "Is Swap'n'Serve a registered charity?",
    a: "Swap'n'Serve is a community initiative. We operate transparently and are exploring formal structures as we grow. For now, we function as a grassroots volunteer-driven project.",
  },
  {
    q: "What kind of clothing can I donate?",
    a: "We accept clean, wearable clothing of all sizes, including shoes, coats, school uniforms, and children's clothing. Items should be in good condition, ready to be worn.",
  },
  {
    q: "How can I volunteer?",
    a: "Click the 'Sign Up to Volunteer' button on this page. You will be taken to a short form that takes about 2 minutes to complete. No prior experience is required.",
  },
  {
    q: "Do you collect personal data?",
    a: "We collect only the minimum information needed to coordinate volunteers (for example, name, contact details, and availability). We never share your data with third parties.",
  },
  {
    q: "How can my school or organisation get involved?",
    a: "We welcome partnerships with schools, community groups, and local organisations. Reach out via our contact details in the footer and we will arrange a conversation about how we can collaborate.",
  },
];

const FaqSection = () => {
  return (
    <section id="faq" className="py-20 md:py-28 bg-primary relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-10 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px]" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-full bg-white/15 text-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-4">
            Questions
          </span>
          <h2 className="text-3xl md:text-4xl font-section font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Answers to the things we are asked most often.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <AccordionItem
                  value={`faq-${i}`}
                  className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm px-5 overflow-hidden"
                >
                  <AccordionTrigger className="text-left text-base font-medium text-white hover:no-underline py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-white/75 pb-4 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
