import { MotionConfig } from "motion/react";
import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Technologies } from "../components/Technologies";
import { Projects } from "../components/Projects";
import { Lab } from "../components/lab/Lab";
import { Courses } from "../components/Courses";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { Intro } from "../components/Intro";
import { AchievementProvider } from "../lib/achievements";
import { ThemeProvider } from "../lib/theme";
import { CustomCursor } from "../components/CustomCursor";
import { AtmosphericLight } from "../components/AtmosphericLight";
import { AudioToggle } from "../components/AudioToggle";
import { AudioProvider } from "../lib/audio";
import { AmbientWorld } from "../components/AmbientWorld";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AchievementProvider>
        <ThemeProvider>
          <AudioProvider>
            <Intro />
            <CustomCursor />
            <div className="relative">
              <AtmosphericLight />
              <AmbientWorld />
              <div className="relative z-10">
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-20 focus:z-[70] focus:min-h-11 focus:bg-[var(--surface-elevated)] focus:px-4 focus:py-3 focus:text-sm focus:text-[var(--text-primary)] focus:outline focus:outline-2 focus:outline-[var(--accent)]"
              >
                Pular para o conteúdo
              </a>
              <Navbar />
              <main id="main-content" tabIndex={-1}>
                <Hero />
                <About />
                <Technologies />
                <Projects />
                <Lab />
                <Courses />
                <Contact />
              </main>
              <Footer />
              </div>
            </div>
          </AudioProvider>
        </ThemeProvider>
      </AchievementProvider>
    </MotionConfig>
  );
}
