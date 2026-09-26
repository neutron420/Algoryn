import Content from "@/components/templates/nova/sections/content-1";
import FAQs from "@/components/templates/nova/sections/faqs-1";
import Footer from "@/components/templates/nova/sections/footer-1";
import HeroSection from "@/components/templates/nova/sections/hero-section-1";
import Pricing from "@/components/templates/nova/sections/pricing-1";
import Topics from "@/components/templates/nova/sections/topics-1";
import Testimonials from "@/components/templates/nova/sections/testimonials-1";
import HowItWorks from "@/components/ui/how-it-works";
import { AlgorynBentoGrid } from "@/components/landing/algoryn-bento";
import Announcement9 from "@/components/ui/announcement-9";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Algoryn | Company-wise Coding Interview Prep",
  description:
    "Practice LeetCode problems by company, filter by topic, and track your solved progress.",
};

export default function Landing() {
  return (
    <>
      <HeroSection />
      <AlgorynBentoGrid showSectionHeader={true} />
      <HowItWorks />
      <Topics />
      <Content />
      <Pricing />
      <Testimonials />
      <FAQs />
      <Footer />
      <Announcement9 />
    </>
  );
}
