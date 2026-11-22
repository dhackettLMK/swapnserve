import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MISSION_SUMMARY } from "@/content/mission";

const faqs = [
  {
    q: "What is Swap'n'Serve?",
    a: MISSION_SUMMARY,
  },
  {
    q: "Is Swap'N'Serve only about clothing events?",
    a: "No. Clothing redistribution is our flagship event, but we are an umbrella organisation for the betterment of Limerick City. Our projects bring together community support, sport, creativity, enterprise and upskilling to address financial and social tensions, employment barriers and overlooked talent.",
  },
  {
    q: "What change are you working towards in Limerick?",
    a: "We want to celebrate the city's strengths while challenging the conditions that hold people back. Our ambition is to contribute to social, economic, political and cultural regeneration over the next five years and beyond, including stronger trust between communities, civil servants and the council. This is a long-term purpose, not a promise that any single project can solve every problem.",
  },
  {
    q: "Do I need experience or qualifications to get involved?",
    a: "Not necessarily. We believe people without major experience or accolades deserve opportunities to learn and a stage to demonstrate their talents. A fresh perspective can lead to real change. Some roles have specific responsibilities or requirements, but you can also propose an idea based on your own skills or interests through our volunteer page.",
  },
  {
    q: "What values guide your work?",
    a: "We work with dignity and without judgement or ill intent. We aim for excellence, creativity and work that makes a lasting difference, rather than safe, repeatable efforts. We challenge complacency and unnecessary bureaucracy, take thoughtful risks and treat learning from failure as seriously as success.",
  },
  {
    q: "How do you approach transparency and responsibility?",
    a: "We believe we owe the people of Limerick clear, honest information about what we do and who we work with, including when things go wrong. We must not hide behind lies, jargon or bureaucracy. We aim to recruit responsible people and build strong departments so the organisation can outlive any one person's talents and protect the future we are working towards.",
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
    a: "Clean, wearable clothing of all sizes, including shoes, coats, school uniforms and children's clothing. Items should be in good condition and ready to be worn. We have also received donations ranging from suits and dresses to official Munster training gear.",
  },
  {
    q: "What happens to leftover clothing after an event?",
    a: "Nothing goes to waste. All leftover items are distributed equally amongst over 10 local Limerick charities, including Saint Vincent de Paul, Self Help Africa, Irish Cancer Society, Enable Ireland and the Sue Ryder Foundation. Every piece serves someone before going anywhere else.",
  },
  {
    q: "How does this address fast fashion?",
    a: "Ireland discards around 110,000 tonnes of textiles every year, and the average Irish person produces more than 53 kg of textile waste annually, over double the EU average. By removing every financial barrier, we make the sustainable choice the default rather than the privilege. Our work aligns directly with the EU Strategy for Sustainable and Circular Textiles and UN Sustainable Development Goal 12.",
  },
  {
    q: "How can I volunteer?",
    a: "Open the volunteer page using 'Want to Volunteer' at the top of the website, explore the open roles and apply through the 'Join the team' form. If you have a skill, interest or proposal that does not fit an existing role, use 'Think we missed something?' to share it. We welcome people who want to learn, take responsibility and help create positive change in Limerick.",
  },
  {
    q: "Do you collect personal data?",
    a: "We collect only the minimum information needed to coordinate volunteers and donations (for example, name, contact details and availability). We never share your data with third parties.",
  },
  {
    q: "How can my school, business or organisation get involved?",
    a: "We actively partner with schools, colleges, churches and local businesses across Limerick. Past partners include Villiers, Crescent College Comprehensive SJ, TUS, the University of Limerick, Fior Jewellery, Van Rossum Clothing and Careline Moving & Storage. Reach out via the contact details in the footer to start a conversation.",
  },
];

const FaqSection = () => {
  return (
    <section id="faq" className="py-20 md:py-28 bg-card relative overflow-hidden">

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-full bg-muted text-foreground px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-4">
            Questions
          </span>
          <h2 className="text-3xl md:text-4xl font-section font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
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
                  className="rounded-lg border border-border bg-background px-5 overflow-hidden"
                >
                  <AccordionTrigger className="text-left text-base font-medium text-foreground hover:no-underline py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
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
