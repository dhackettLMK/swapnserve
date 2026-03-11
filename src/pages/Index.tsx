import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import ImpactSnapshot from "@/components/ImpactSnapshot";
import TimelineSection from "@/components/TimelineSection";
import EventsSection from "@/components/EventsSection";
import VolunteerRoles from "@/components/VolunteerRoles";
import PartnersSection from "@/components/PartnersSection";
import FaqSection from "@/components/FaqSection";
import CtaBanner from "@/components/CtaBanner";
import SiteFooter from "@/components/SiteFooter";
import MobileCta from "@/components/MobileCta";
import BackToTop from "@/components/BackToTop";

const Index = () => {
  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <HowItWorks />
        <ImpactSnapshot />
        <TimelineSection />
        <EventsSection />
        <VolunteerRoles />
        <PartnersSection />
        <FaqSection />
        <CtaBanner />
      </main>
      <SiteFooter />
      <MobileCta />
      <BackToTop />
    </>
  );
};

export default Index;
