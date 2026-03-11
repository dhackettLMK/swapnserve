import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Newspaper, ExternalLink, Calendar, MapPin, Users, Sparkles, Award, Mic, X } from "lucide-react";
import teamPhoto from "@/assets/team-photo.jpg";
import websummitPhoto from "@/assets/websummit-photo.jpg";

type TimelineEvent = {
  date: string;
  title: string;
  description: string;
  icon: React.ElementType;
  image?: string;
  imageAlt?: string;
  press?: {
    outlet: string;
    headline: string;
    excerpt: string;
    url: string;
  };
  highlight?: boolean;
};

const events: TimelineEvent[] = [
  {
    date: "Early 2025",
    title: "The Idea Takes Root",
    icon: Sparkles,
    description:
      "David Hackett and a small group of Limerick locals begin organising around a simple idea: clothing should not go to waste when neighbours need it. Inspired by community and sustainability, Swap'n'Serve is born.",
  },
  {
    date: "June 2025",
    title: "Donations Start Flowing",
    icon: Users,
    description:
      "Schools and local organisations begin collecting clean, wearable clothing. Drop-off points open at Abundant Life Christian Church on Henry Street. The community response is immediate.",
  },
  {
    date: "August 2025",
    title: "First Public Swap and Giveaway",
    icon: Calendar,
    highlight: true,
    description:
      "On August 30th, Swap'n'Serve holds its inaugural clothing giveaway at Abundant Life Christian Church. Over 1,000 items donated, around 300 people attend, including Limerick Mayor John Moran. Everything is free, no questions asked.",
    press: {
      outlet: "I Love Limerick",
      headline: "Swap N Serve community project gives back to those in need",
      excerpt:
        "A new community-based project organised by a group of Limerick young people, has set out with one clear goal: to give back and help those in need, no questions asked.",
      url: "https://www.ilovelimerick.ie/swap-n-serve-community-project/",
    },
  },
  {
    date: "Autumn 2025",
    title: "Guest Speaker at NUIG & TUS",
    icon: Mic,
    highlight: true,
    description:
      "David is invited as a guest speaker at NUI Galway and TUS, sharing the Swap'n'Serve story and his journey in community-led entrepreneurship. Speaking to students and faculty, he shows how a simple idea born in Limerick can inspire action far beyond the city.",
  },
  {
    date: "Late 2025",
    title: "Web Summit Scholarship",
    icon: Award,
    highlight: true,
    image: websummitPhoto,
    imageAlt: "David Hackett at Web Summit with his Scholar badge",
    description:
      "David Hackett's work with Swap'n'Serve earns him a prestigious Web Summit scholarship, bringing him to one of the world's largest tech conferences in Lisbon. The experience opens doors to new connections, collaborators, and ideas — proving that grassroots community work can resonate on a global stage.",
    press: {
      outlet: "Irish Independent",
      headline: "Meet the Limerick student with a keen eye for AI who has just secured Web Summit invite",
      excerpt:
        "A Limerick student with a passion for AI and community impact has secured an invite to Web Summit, one of the world's largest technology conferences.",
      url: "https://www.independent.ie/regionals/limerick/news/meet-the-limerick-student-with-a-keen-eye-for-ai-who-has-just-secured-web-summit-invite/a949833630.html",
    },
  },
  {
    date: "Early 2026",
    title: "Tekpon AI Summit Invite",
    icon: Award,
    highlight: true,
    description:
      "David's community work with Swap'n'Serve helped earn him a place as one of 50 Irish students selected for Web Summit — and it was there, waiting for a taxi in the rain, that he met Gina Schinkel of Driftawave. Struck by his drive and impressed by his AI and systems engineering skills, she invited him to attend the Tekpon AI Summit in Bucharest on a premium ticket. What started as a local clothing swap had opened doors to an international stage.",
    press: {
      outlet: "Irish Independent",
      headline: "Limerick student lands premium invite to Romania's Tekpon AI Summit",
      excerpt:
        "A Limerick student has landed a premium invite to Romania's Tekpon AI Summit after a chance encounter at Web Summit. 'It's crazy to think how much my life has changed.'",
      url: "https://www.independent.ie/regionals/limerick/news/limerick-student-lands-premium-invite-to-romanias-tekpon-ai-summit-its-crazy-to-think-how-much-my-life-has-changed/a460097414.html",
    },
  },
  {
    date: "March 2026",
    title: "Exciting New Collaborations",
    icon: MapPin,
    highlight: true,
    description:
      "Swap'n'Serve partners with local brands Fior Jewellery and Van Rossum Clothing for its second event. The project expands its vision to better integrate Limerick's diverse communities.",
    press: {
      outlet: "Irish Independent",
      headline: "Limerick entrepreneur brings back charity project Swap'n'Serve in exciting collaboration",
      excerpt:
        "David Hackett is preparing for the second instalment of Swap'n'Serve, a community-led charity event aimed at tackling fast fashion, boosting sustainability and building stronger ties in Limerick city.",
      url: "https://www.independent.ie/regionals/limerick/news/limerick-entrepreneur-brings-back-charity-project-swapnserve-in-exciting-collaboration-with-two-local-brands/a2079616764.html",
    },
  },
  {
    date: "April 2026",
    title: "Second Event at Abundant Life",
    icon: Calendar,
    description:
      "The next Swap'n'Serve takes place on Saturday, April 11th, at Abundant Life Christian Church on Henry Street. Clothing sold for just one euro per item, with all remaining stock distributed equally among partner charities.",
  },
];

// Photos placed between specific timeline items (after index N)
const floatingPhotos: {
  afterIndex: number;
  src: string;
  alt: string;
  caption: string;
  side: "left" | "right";
}[] = [
  {
    afterIndex: 4, // After "Web Summit Scholarship"
    src: websummitPhoto,
    alt: "David Hackett at Web Summit with his Scholar badge",
    caption: "David at Web Summit, Lisbon",
    side: "right",
  },
  {
    afterIndex: 6, // After "Exciting New Collaborations"
    src: teamPhoto,
    alt: "The Swap'n'Serve team alongside partners Fior Jewellery and Van Rossum Clothing",
    caption: "The team & partners",
    side: "left",
  },
];

const PressCard = ({ press }: { press: NonNullable<TimelineEvent["press"]> }) => (
  <motion.a
    href={press.url}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.15 }}
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className="mt-4 block rounded-2xl bg-primary/5 border border-primary/10 p-4 transition-all hover:border-primary/20 hover:shadow-md group text-left"
  >
    <div className="flex items-start gap-3">
      <div className="shrink-0 mt-0.5 w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
        <Newspaper size={16} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
            {press.outlet}
          </span>
          <ExternalLink
            size={12}
            className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>
        <p className="text-sm font-semibold text-foreground leading-snug mb-1">
          {press.headline}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {press.excerpt}
        </p>
      </div>
    </div>
  </motion.a>
);

const CurveConnector = ({ fromRight }: { fromRight: boolean }) => (
  <svg
    viewBox="0 0 800 80"
    className="hidden md:block w-full h-16"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      d={
        fromRight
          ? "M 600 0 C 600 50, 200 30, 200 80"
          : "M 200 0 C 200 50, 600 30, 600 80"
      }
      fill="none"
      stroke="hsl(var(--primary))"
      strokeOpacity="0.15"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const Lightbox = ({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-pointer"
    onClick={onClose}
  >
    <motion.button
      onClick={onClose}
      className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-background/20 hover:bg-background/40 flex items-center justify-center text-white transition-colors z-10"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <X size={20} />
    </motion.button>
    <motion.img
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.85, opacity: 0 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 22 }}
      src={src}
      alt={alt}
      className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain"
      onClick={(e) => e.stopPropagation()}
    />
  </motion.div>
);

const InlinePhoto = ({
  src,
  alt,
  caption,
  side,
  onImageClick,
}: {
  src: string;
  alt: string;
  caption: string;
  side: "left" | "right";
  onImageClick: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className={`flex ${side === "right" ? "md:justify-end" : "md:justify-start"} justify-center py-4`}
  >
    <div className={`w-[85%] md:w-[38%] ${side === "right" ? "md:mr-[4%]" : "md:ml-[4%]"}`}>
      <motion.div
        whileHover={{ scale: 1.02, rotate: 0 }}
        whileTap={{ scale: 0.98 }}
        onClick={onImageClick}
        className={`rounded-2xl overflow-hidden shadow-lg border border-border/30 cursor-pointer ${
          side === "right" ? "rotate-1" : "-rotate-1"
        } hover:rotate-0 transition-transform duration-500 hover:shadow-xl`}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
      </motion.div>
      <p className="text-[11px] text-muted-foreground mt-2.5 text-center italic">
        {caption}
      </p>
    </div>
  </motion.div>
);

const TimelineSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  return (
    <>
      <section id="timeline" className="py-20 md:py-28 bg-card overflow-hidden">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-4">
              Our Story
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              The Journey So Far
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              From a conversation between friends to a movement covered by national press.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            {events.map((event, i) => {
              const isExpanded = expandedIndex === i;
              const Icon = event.icon;
              const isRight = i % 2 !== 0;

              // Check if there's a photo to show after this event
              const photoAfter = floatingPhotos.find((p) => p.afterIndex === i);

              return (
                <div key={i}>
                  {i > 0 && <CurveConnector fromRight={i % 2 === 0} />}
                  {i > 0 && (
                    <div className="md:hidden flex justify-center -my-1">
                      <div className="w-px h-8 bg-gradient-to-b from-primary/20 to-primary/5" />
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, x: isRight ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.55, delay: i * 0.06, type: "spring", stiffness: 70, damping: 16 }}
                    className={`relative flex flex-col md:flex-row items-center gap-4 md:gap-8 ${
                      isRight ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Icon marker */}
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 8 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setExpandedIndex(isExpanded ? null : i)}
                      className={`shrink-0 cursor-pointer w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-all ${
                        event.highlight
                          ? "bg-secondary text-secondary-foreground shadow-secondary/20"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Icon size={22} />
                    </motion.div>

                    {/* Content card */}
                    <motion.div
                      layout
                      onClick={() => setExpandedIndex(isExpanded ? null : i)}
                      whileHover={{ y: -3 }}
                      className={`cursor-pointer w-full md:w-[45%] rounded-3xl border overflow-hidden transition-all ${
                        isExpanded
                          ? "border-primary/20 shadow-xl shadow-primary/5 bg-background"
                          : "border-border/40 bg-background hover:shadow-lg hover:border-border"
                      }`}
                    >
                      <div className="p-5 md:p-6">
                        <span
                          className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 ${
                            event.highlight
                              ? "text-secondary bg-secondary/10"
                              : "text-primary bg-primary/10"
                          }`}
                        >
                          {event.date}
                        </span>

                        <h3 className="text-lg font-display font-bold text-foreground mb-1">
                          {event.title}
                        </h3>

                        <AnimatePresence initial={false}>
                          {isExpanded ? (
                            <motion.div
                              key="content"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.35, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                                {event.description}
                              </p>
                              {event.image && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.1, duration: 0.3 }}
                                  className="mt-4 rounded-2xl overflow-hidden border border-border/30 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxImage({ src: event.image!, alt: event.imageAlt || "" });
                                  }}
                                >
                                  <img
                                    src={event.image}
                                    alt={event.imageAlt || ""}
                                    className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500"
                                    loading="lazy"
                                  />
                                </motion.div>
                              )}
                              {event.press && <PressCard press={event.press} />}
                            </motion.div>
                          ) : (
                            <motion.p
                              key="hint"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-xs text-primary/70 font-medium mt-1.5 flex items-center gap-1.5"
                            >
                              <span className="inline-block w-1 h-1 rounded-full bg-primary/50" />
                              Tap to read more
                              {event.press && (
                                <>
                                  <span className="inline-block w-1 h-1 rounded-full bg-secondary/50" />
                                  <span className="text-secondary font-bold">Press coverage</span>
                                </>
                              )}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Inline photo placed after the relevant milestone */}
                  {photoAfter && (
                    <InlinePhoto
                      src={photoAfter.src}
                      alt={photoAfter.alt}
                      caption={photoAfter.caption}
                      side={photoAfter.side}
                      onImageClick={() =>
                        setLightboxImage({ src: photoAfter.src, alt: photoAfter.alt })
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lightbox overlay */}
      <AnimatePresence>
        {lightboxImage && (
          <Lightbox
            src={lightboxImage.src}
            alt={lightboxImage.alt}
            onClose={() => setLightboxImage(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default TimelineSection;
