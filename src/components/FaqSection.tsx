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
    a: "Swap'n'Serve is a Limerick-based grassroots organisation, founded in 2025 by David Hackett. On the surface we are a community clothing event where quality items are offered for €1 or free. Underneath, we are an umbrella for upskilling, financial relief, circular textiles and tackling antisocial tension across the city.",
  },
  {
    q: "Who can attend the clothing events?",
    a: "Anyone. Our events are open to every member of the community regardless of socioeconomic background, race, age, gender or experience. There is no sign-up, no paperwork, no means testing. You come along and take what you need.",
  },
  {
    q: "Is Swap'n'Serve a registered charity?",
    a: "Swap'n'Serve is currently a grassroots organisation with CLG (Company Limited by Guarantee) registration pending. Charitable status is part of our 12-month roadmap. Until then we operate transparently as a fully volunteer-driven project based at 54 Henry Street, Limerick.",
  },
  {
    q: "What kind of clothing can I donate?",
    a: "Clean, wearable clothing of all sizes — including shoes, coats, school uniforms and children's clothing. Items should be in good condition and ready to be worn. We have also received donations ranging from suits and dresses to official Munster training gear.",
  },
  {
    q: "What happens to leftover clothing after an event?",
    a: "Nothing goes to waste. All leftover items are distributed equally amongst over 10 local Limerick charities, including Saint Vincent de Paul, Self Help Africa, Irish Cancer Society, Enable Ireland and the Sue Ryder Foundation. Every piece serves someone before going anywhere else.",
  },
  {
    q: "How does this address fast fashion?",
    a: "Ireland discards around 110,000 tonnes of textiles every year, and the average Irish person produces more than 53 kg of textile waste annually — over double the EU average. By removing every financial barrier, we make the sustainable choice the default rather than the privilege. Our work aligns directly with the EU Strategy for Sustainable and Circular Textiles and UN Sustainable Development Goal 12.",
  },
  {
    q: "How can I volunteer?",
    a: "Head to the 'Want to Volunteer?' section above and fill out the short form, or email us directly at swapnserve@gmail.com. No prior experience is required — past volunteers have come from secondary schools, colleges and across the city.",
  },
  {
    q: "Do you collect personal data?",
    a: "We collect only the minimum information needed to coordinate volunteers and donations (for example, name, contact details and availability). We never share your data with third parties.",
  },
  {
    q: "How can my school, business or organisation get involved?",
    a: "We actively partner with schools, colleges, churches and local businesses across Limerick — past partners include Villiers, Crescent College Comprehensive SJ, TUS, the University of Limerick, Fior Jewellery, Van Rossum Clothing and Careline Moving & Storage. Reach out via the contact details in the footer to start a conversation.",
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
