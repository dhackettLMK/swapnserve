import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, HandHeart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LendAHand = () => (
  <section id="open-roles" className="bg-background py-20 md:py-28">
    <div className="container">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-10 text-center">
        <span className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase text-primary"><HandHeart size={14} />Get Involved</span>
        <h2 className="mb-4 text-3xl font-bold text-foreground md:text-5xl">Want to lend a Hand?</h2>
        <p className="mx-auto max-w-xl text-lg text-muted-foreground">There is always space for another pair of hands in Limerick. Find your role and join the team.</p>
      </motion.div>
      <div className="mx-auto max-w-3xl">
        <Button asChild className="h-auto w-full justify-between whitespace-normal rounded-lg border border-accent/40 px-6 py-6 text-left shadow-refined md:px-8 md:py-7">
          <Link to="/volunteer" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
            <span className="min-w-0"><span className="block font-section text-xl font-bold md:text-2xl">See open roles</span><span className="mt-2 block text-sm font-normal text-primary-foreground/80">14 roles across 5 teams</span></span>
            <span className="flex shrink-0 items-center gap-4"><span className="hidden items-center gap-2 text-xs sm:inline-flex"><Clock size={14} />Flexible</span><ArrowRight size={24} /></span>
          </Link>
        </Button>
      </div>
    </div>
  </section>
);
export default LendAHand;
