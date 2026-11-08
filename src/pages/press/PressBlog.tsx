import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PressLayout from "@/components/press/PressLayout";
import PressSeo from "@/components/press/PressSeo";
import { ARTICLES } from "@/content";

const PressBlog = () => (
  <PressLayout>
    <PressSeo
      title="Blog | Swap 'N' Serve"
      description="Stories from Swap 'N' Serve's events and community projects in Limerick."
      path="/press/blog"
    />
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Stories from Limerick</p>
      <h1 className="mt-3 font-press-serif text-4xl font-semibold tracking-tight md:text-5xl">The Swap'N'Serve blog</h1>
      <div className="mt-10 space-y-6">
        {ARTICLES.length === 0 && <p className="border-t border-border pt-8 text-muted-foreground">New stories coming soon.</p>}
        {ARTICLES.map((a) => (
          <Link
            key={a.slug}
            to={`/press/blog/${a.slug}`}
            className="group block rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-refined)]"
          >
            <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
              <span className="rounded-full bg-primary/10 px-3 py-1 font-bold uppercase tracking-wide text-primary">{a.tag}</span>
              <time dateTime={a.dateISO}>{a.date}</time>
              <span aria-hidden>·</span>
              <span>{a.readingTime}</span>
            </div>
            <h2 className="mt-3 font-press-serif text-2xl font-semibold leading-snug text-foreground group-hover:text-primary">
              {a.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">{a.standfirst}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              Read article <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          </Link>
        ))}
      </div>
    </div>
  </PressLayout>
);

export default PressBlog;
