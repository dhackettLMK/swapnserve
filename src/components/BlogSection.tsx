import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ARTICLES } from "@/content";
import communityPhoto from "@/assets/hero-community.jpg";

const BlogSection = () => (
  <section id="blog" aria-labelledby="blog-heading" className="border-y border-border bg-muted/25 py-20 md:py-28">
    <div className="container">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase text-primary">From Limerick, with purpose</p>
          <h2 id="blog-heading" className="text-3xl font-bold text-foreground md:text-5xl">The Swap'N'Serve blog</h2>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">Stories from our city, our events and the people making them happen.</p>
        </div>
        <Button asChild variant="outline" size="lg">
          <Link to="/press/blog" onClick={() => window.scrollTo(0, 0)}>View all posts <ArrowRight aria-hidden="true" /></Link>
        </Button>
      </div>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="overflow-hidden rounded-lg">
          <img src={communityPhoto} alt="Swap'N'Serve volunteers together at a Limerick clothing event" loading="lazy" width={1264} height={848} className="aspect-[4/3] h-full max-h-[560px] w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center divide-y divide-border">
          {ARTICLES.slice(0, 2).map((article) => (
            <article key={article.slug} className="py-7 first:pt-0 last:pb-0 lg:py-9">
              <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-muted-foreground">
                <span className="uppercase text-primary">{article.tag}</span>
                <time dateTime={article.dateISO}>{article.date}</time>
                <span>{article.readingTime}</span>
              </div>
              <h3 className="text-xl font-semibold leading-snug text-foreground md:text-2xl">{article.title}</h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">{article.standfirst}</p>
              <Button asChild variant="link" className="mt-5 h-auto justify-start p-0">
                <Link to={`/press/blog/${article.slug}`} onClick={() => window.scrollTo(0, 0)} aria-label={`Read ${article.title}`}>Read story <ArrowUpRight aria-hidden="true" /></Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default BlogSection;