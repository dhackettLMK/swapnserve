import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Award } from "lucide-react";
import { DEFAULT_THIRTY, thirtyApi, type Honouree, type ThirtyContent } from "@/lib/thirtyApi";
import { Button } from "@/components/ui/button";
import { resolvePortrait } from "@/lib/thirtyPortraits";

const MAX_PORTRAITS = 6;

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");

const Portrait = ({ honouree, index }: { honouree: Honouree; index: number }) => {
  const [broken, setBroken] = useState(false);

  return (
    <motion.figure
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={`group w-[44%] max-w-[180px] shrink-0 snap-center md:w-auto md:max-w-none ${
        ""
      }`}
    >
      <div className="relative overflow-hidden rounded-xl border border-border bg-muted shadow-sm">
        <div className="aspect-[3/4]">
          {honouree.photo && !broken ? (
            <img
              src={resolvePortrait(honouree.photo)}
              alt={honouree.name}
              loading="lazy"
              onError={() => setBroken(true)}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary">
              <span className="font-section text-3xl font-bold text-primary-foreground/80">
                {initials(honouree.name)}
              </span>
            </div>
          )}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-primary/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <figcaption className="mt-3 px-1">
        <p className="font-section text-base font-bold leading-snug text-foreground">{honouree.name}</p>
        {honouree.role ? (
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {honouree.role}
          </p>
        ) : null}
      </figcaption>
    </motion.figure>
  );
};

const TalentedPeopleSection = () => {
  const [content, setContent] = useState<ThirtyContent | null>(null);

  useEffect(() => {
    let alive = true;
    thirtyApi
      .get()
      .then((saved) => {
        if (alive && saved) setContent(saved);
      })
      .catch(() => {
        /* keep the default copy if the page content cannot be read */
      });
    return () => {
      alive = false;
    };
  }, []);

  const featured = useMemo(() => {
    const honourees = content?.honourees ?? [];
    return honourees
      .filter((h) => h.name && !/^Honouree \d+$/.test(h.name))
      .filter((h) => h.photo)
      .slice(0, MAX_PORTRAITS);
  }, [content]);

  const namedCount = useMemo(() => {
    const honourees = content?.honourees ?? [];
    return honourees.filter((h) => h.name && !/^Honouree \d+$/.test(h.name)).length;
  }, [content]);

  const title = content?.title || DEFAULT_THIRTY.title;
  const intro = content?.intro || DEFAULT_THIRTY.intro;

  return (
    <section id="talented" className="relative overflow-hidden py-20 md:py-28 border-t border-border bg-card">

      <div className="container relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
              <Award size={13} /> Thirty Under Thirty
            </span>

            <h2 className="mt-5 text-3xl font-section font-bold leading-tight text-foreground md:text-4xl lg:text-[2.75rem]">
              {title}
            </h2>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">{intro}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <span className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm">
                {namedCount > 0 ? `${namedCount} named so far` : "Honourees announced soon"}
              </span>
              <span className="inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm">
                Nominated by the city
              </span>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg"><Link to="/thirty-under-thirty">
                Meet the talented people <ArrowRight size={16} />
              </Link></Button>
              {content?.ctaLink ? (
                <a
                  href={content.ctaLink}
                  className="text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
                >
                  {content.ctaLabel || "Nominate someone"}
                </a>
              ) : null}
            </div>
          </motion.div>

          {featured.length > 0 ? (
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-6">
              {featured.map((honouree, i) => (
                <Portrait key={honouree.id} honouree={honouree} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-[2rem] border border-accent/30 bg-gradient-to-br from-[hsl(152_48%_20%)] via-primary to-[hsl(152_50%_22%)] p-10 text-center shadow-lg"
            >
              <Award size={34} className="mx-auto mb-4 text-accent drop-shadow-[0_0_10px_hsl(var(--accent)/0.6)]" />
              <p className="font-section text-xl font-bold text-primary-foreground">
                The honourees are being announced
              </p>
              <p className="mt-3 text-primary-foreground/80">
                Photos and names go up as soon as they are confirmed.
              </p>
              <Link
                to="/thirty-under-thirty"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground transition-transform hover:scale-105"
              >
                See the page <ArrowRight size={16} />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TalentedPeopleSection;
