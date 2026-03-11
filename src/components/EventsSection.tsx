import { CalendarDays, MapPin, Clock, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const acceptedItems = [
  "Clean, wearable clothing (all sizes)",
  "Shoes in good condition",
  "Coats, jackets, and warm layers",
  "School uniforms",
  "Baby and children's clothing",
];

const EventsSection = () => {
  return (
    <section id="events" className="py-20 md:py-28">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Events & Donations
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Find out when our next event is happening and how you can donate.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Upcoming event card */}
          <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <CalendarDays size={20} className="text-secondary" />
              Upcoming Event
            </h3>
            <div className="bg-muted rounded-lg p-5 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Info size={16} />
                <span className="italic">Details to be announced</span>
              </div>
              <p className="text-sm text-muted-foreground">
                We're planning our next clothing swap event. Follow us on social media or check
                back here for updates on dates and locations.
              </p>
            </div>
            <Button variant="hero-outline" size="sm" asChild>
              <a href="https://example.com/volunteer">Get Notified</a>
            </Button>
          </div>

          {/* Donation info */}
          <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-secondary" />
              Donate Clothes
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drop-off points are arranged in the weeks leading up to each event. Contact us to
              find the nearest collection point or to arrange a pickup for larger donations.
            </p>

            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Clock size={16} className="text-primary" />
              What We Accept
            </h4>
            <ul className="space-y-2">
              {acceptedItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
