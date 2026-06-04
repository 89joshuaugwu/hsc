import { HeroSection } from "@/components/home/HeroSection";
import { AnnouncementsSection } from "@/components/home/AnnouncementsSection";
import { EventsSection } from "@/components/home/EventsSection";
import { DepartmentsStrip } from "@/components/home/DepartmentsStrip";
import { ScriptureSection } from "@/components/home/ScriptureSection";
import { FellowshipSection } from "@/components/home/FellowshipSection";
import { GalleryTeaser } from "@/components/home/GalleryTeaser";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AnnouncementsSection />
      <EventsSection />
      <DepartmentsStrip />
      <ScriptureSection />
      <FellowshipSection />
      <GalleryTeaser />
    </>
  );
}
