import Hero from "@/components/sections/Hero";
import Statement from "@/components/sections/Statement";
import Location from "@/components/sections/Location";
import HowIWork from "@/components/sections/HowIWork";
import Works from "@/components/sections/Works";
import Contacts from "@/components/sections/Contacts";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main id="main" className="relative z-[1]">
      <Hero />
      <Statement />
      <Location />
      <HowIWork />
      <Works />
      <div className="relative" data-scene="contacts">
        <Contacts />
        <Footer />
      </div>
    </main>
  );
}
