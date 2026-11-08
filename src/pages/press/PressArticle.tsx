import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Link2, Mail, Mail as MailIcon, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";
import PressLayout from "@/components/press/PressLayout";
import PressSeo from "@/components/press/PressSeo";
import NotFound from "@/pages/NotFound";
import { ARTICLES, CONTACT } from "@/content";
import TalentProfiles from "@/components/press/TalentProfiles";
import { resolvePressPortrait } from "@/lib/pressPortraits";

const PressArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return <NotFound />;

  const url = `https://swapnserve.com/press/blog/${article.slug}`;
  const shareText = `${article.title} | Swap 'N' Serve`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* clipboard unavailable */
    }
    toast.success("Link copied");
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.standfirst,
    datePublished: article.dateISO,
    author: { "@type": "Person", name: "David Hackett" },
    publisher: { "@type": "Organization", name: "Swap 'N' Serve" },
    mainEntityOfPage: url,
  };

  const mid = article.peopleSections ? article.body.length : Math.ceil(article.body.length / 2);

  return (
    <PressLayout>
      <PressSeo title={`${article.title} | Swap 'N' Serve`} description={article.standfirst} path={`/press/blog/${article.slug}`} jsonLd={jsonLd} />
      <article className={`mx-auto w-full px-4 py-14 sm:px-6 ${article.talentProfiles ? "max-w-6xl" : "max-w-3xl"}`}>
        <Link to="/press/blog" className="no-print inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" aria-hidden /> All articles
        </Link>

        <div className="mt-8 flex items-center gap-3 text-xs font-semibold text-muted-foreground">
          <span className="rounded-full bg-primary/10 px-3 py-1 font-bold uppercase tracking-wide text-primary">{article.tag}</span>
          <time dateTime={article.dateISO}>{article.date}</time>
          <span aria-hidden>·</span>
          <span>{article.readingTime}</span>
        </div>
        <h1 className="mt-4 font-press-serif text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          {article.title}
        </h1>
        <p className="mt-5 font-press-serif text-xl italic leading-relaxed text-foreground/80">{article.standfirst}</p>
        <p className="mt-6 border-b border-border pb-6 text-sm font-semibold text-foreground">
          By <span className="text-primary">David Hackett</span>
        </p>

        {article.image && (
          <figure className="mt-8">
            <img src={article.image} alt={article.imageAlt ?? article.title} className="h-auto w-full rounded-lg" />
            <figcaption className="mt-3 text-sm text-muted-foreground">The people behind the Cup. Photo collage supplied by Swap'N'Serve.</figcaption>
          </figure>
        )}

        <div className="no-print mt-6 flex flex-wrap items-center gap-2" aria-label="Share this article">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            <Share2 className="h-3.5 w-3.5" aria-hidden /> Share
          </span>
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary"
          >
            <Link2 className="h-3.5 w-3.5" aria-hidden /> Copy link
          </button>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary"
          >
            X
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary"
          >
            LinkedIn
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary"
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden /> WhatsApp
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(url)}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary"
          >
            <MailIcon className="h-3.5 w-3.5" aria-hidden /> Email
          </a>
        </div>

        <div className="mt-10 space-y-6">
          {article.body.slice(0, mid).map((para, i) => (
            <p key={i} className="text-lg leading-relaxed text-foreground/90">
              {para}
            </p>
          ))}
          {article.pullQuote && (
            <blockquote className="border-l-4 border-accent py-2 pl-6 font-press-serif text-2xl font-semibold leading-snug text-primary">
              "{article.pullQuote}"
            </blockquote>
          )}
          {article.body.slice(mid).map((para, i) => (
            <p key={i + mid} className="text-lg leading-relaxed text-foreground/90">
              {para}
            </p>
          ))}
        </div>

        {article.peopleSections && (
          <div className="mt-12 divide-y divide-border border-y border-border">
            {article.peopleSections.map((person, index) => (
              <section key={person.name} aria-label={person.name} className="grid gap-6 py-9 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-8">
                {person.photo ? (
                  <img src={resolvePressPortrait(person.photo)} alt={person.name} loading="lazy" className="aspect-[4/5] w-36 rounded-lg object-cover object-top" />
                ) : (
                  <div aria-hidden="true" className="flex aspect-[4/5] w-36 items-center justify-center rounded-lg border border-border bg-muted text-3xl font-semibold text-primary/40">
                    {person.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="mb-2 text-xs font-semibold uppercase text-primary">{String(index + 1).padStart(2, "0")} · {person.role}</p>
                  <h2 className="text-2xl font-semibold text-foreground">{person.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{person.area}</p>
                  <p className="mt-4 text-base leading-relaxed text-foreground/90">{person.text}</p>
                </div>
              </section>
            ))}
          </div>
        )}

        {article.closing && <div className="mt-10 space-y-6">{article.closing.map((paragraph) => <p key={paragraph} className="text-lg leading-relaxed text-foreground/90">{paragraph}</p>)}</div>}

        {article.talentProfiles && <TalentProfiles />}

        <aside className="mt-12 rounded-xl border border-primary/25 bg-primary/5 p-6">
          <h2 className="font-press-serif text-xl font-semibold">Writing about this?</h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/80">
            Contact {CONTACT.name}, {CONTACT.role}. {CONTACT.note}
          </p>
          <a
            href={`mailto:${CONTACT.email}`}
            className="no-print mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Mail className="h-4 w-4" aria-hidden /> {CONTACT.email}
          </a>
        </aside>
      </article>
    </PressLayout>
  );
};

export default PressArticle;
