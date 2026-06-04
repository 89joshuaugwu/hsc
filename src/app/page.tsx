import { HeroSection } from "@/components/home/HeroSection";
import { LiveActivityStrip } from "@/components/home/LiveActivityStrip";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LiveActivityStrip />

      {/* Remaining homepage sections will be added in subsequent prompts:
          - Announcements Section
          - Upcoming Events Section
          - Departments Quick Links
          - Scripture / Mission Quote
          - Fellowship Callout
          - Gallery Teaser
      */}
    </>
  );
}
