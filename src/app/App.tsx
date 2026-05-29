import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Technologies } from "../components/Technologies";
import { Projects } from "../components/Projects";
import { Courses } from "../components/Courses";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";

export default function App() {
  return (
    <div className="dark min-h-screen bg-[#06070A] text-zinc-200 antialiased relative overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-900/[0.08] blur-[140px] rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Technologies />
          <Projects />
          <Courses />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
