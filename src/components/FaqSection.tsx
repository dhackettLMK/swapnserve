import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is Swap'n'Serve?",
    a: "Swap'n'Serve is a community-led clothing redistribution initiative based in Limerick. We collect clean, usable clothing and redistribute it to families and individuals who can use it—free of charge and with no questions asked.",
  },
  {
    q: "Who can attend the swap events?",
    a: "Anyone. Our events are open to all members of the community. There's no sign-up, no paperwork, and no eligibility check. You simply come along and take what you need.",
  },
  {
    q: "Is Swap'n'Serve a registered charity?",
    a: "Swap'n'Serve is a community initiative. We operate transparently and are exploring formal structures as we grow. For now, we function as a grassroots volunteer-driven project.",
  },
  {
    q: "What kind of clothing can I donate?",
    a: "We accept clean, wearable clothing of all sizes—including shoes, coats, school uniforms, and children's clothing. Items should be in good condition, ready to be worn.",
  },
  {
    q: "How can I volunteer?",
    a: "Click the 'Sign Up to Volunteer' button on this page. You'll be taken to a short form that takes about 2 minutes to complete. No prior experience is required.",
  },
  {
    q: "Do you collect personal data?",
    a: "We collect only the minimum information needed to coordinate volunteers (e.g., name, contact details, and availability). We never share your data with third parties.",
  },
  {
    q: "How can my school or organisation get involved?",
    a: "We'd love to partner with you! Reach out via our contact details in the footer, and we'll arrange a conversation about how we can collaborate.",
  },
];

const FaqSection = () => {
  return (
    <section id="faq" className="py-20 md:py-28 bg-card">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Got questions? We've got answers.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-background rounded-lg border border-border px-5"
              >
                <AccordionTrigger className="text-left text-base font-medium text-foreground hover:no-underline py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
