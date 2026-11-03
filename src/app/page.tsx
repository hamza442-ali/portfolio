import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { AIJourney } from "@/components/sections/AIJourney";
import { Contact } from "@/components/sections/Contact";
import { Education } from "@/components/sections/Education";
import { Experience } from "@/components/sections/Experience";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { StackMarquee } from "@/components/sections/StackMarquee";

export default function Home() {
  return (
    <main id="main" className="relative">
      <Hero />
      <StackMarquee />
      <About />
      <Experience />
      <FeaturedWork />
      <Projects />
      <Skills />
      <AIJourney />
      <Education />
      <Contact />
    </main>
  );
}
