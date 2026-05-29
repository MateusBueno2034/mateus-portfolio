import { motion } from "motion/react";
import { ArrowRight, Mail, Code2, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      {/* Glow */}
      <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-blue-900/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-700/10 blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-12 items-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-7"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs text-zinc-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            Disponível para oportunidades de estágio
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-[1.05]">
              Mateus Henrique
              <br />
              <span className="bg-gradient-to-r from-zinc-200 via-zinc-400 to-blue-400 bg-clip-text text-transparent">
                Bueno de Carvalho
              </span>
            </h1>
            <div className="flex items-center gap-3 text-zinc-400">
              <Code2 size={16} className="text-blue-400" />
              <p className="text-sm sm:text-base">
                Estudante de Engenharia de Software{" "}
                <span className="text-zinc-600">|</span> Desenvolvedor Front-End
              </p>
            </div>
          </div>

          <p className="text-zinc-400 text-base lg:text-lg max-w-lg leading-relaxed">
            Estudante de Engenharia de Software apaixonado por tecnologia,
            interfaces modernas e desenvolvimento de soluções digitais.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="#projetos"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-b from-blue-600 to-blue-800 text-white border border-blue-500/40 shadow-[0_0_30px_-5px_rgba(37,99,235,0.5)] hover:shadow-[0_0_40px_-5px_rgba(37,99,235,0.7)] transition-all"
            >
              Ver Projetos
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
            <a
              href="#contato"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white/5 border border-white/10 text-zinc-200 hover:bg-white/10 backdrop-blur-md transition-all"
            >
              <Mail size={16} />
              Contato
            </a>
          </div>

          <div className="flex gap-8 pt-4 border-t border-white/5">
            <div>
              <div className="text-2xl text-white">2026</div>
              <div className="text-xs text-zinc-500">Início faculdade</div>
            </div>
            <div>
              <div className="text-2xl text-white">10+</div>
              <div className="text-xs text-zinc-500">Tecnologias</div>
            </div>
            <div>
              <div className="text-2xl text-white">3+</div>
              <div className="text-xs text-zinc-500">Cursos concluídos</div>
            </div>
          </div>
        </motion.div>

        {/* Right illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative aspect-square max-w-md mx-auto">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-md" />

            {/* Floating code window */}
            <div className="absolute top-8 left-8 right-8 rounded-xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="ml-3 text-xs text-zinc-500">
                  developer.tsx
                </span>
              </div>
              <pre className="px-4 py-4 text-xs leading-relaxed">
                <code>
                  <span className="text-blue-400">const</span>{" "}
                  <span className="text-zinc-200">developer</span>{" "}
                  <span className="text-zinc-500">=</span>{" "}
                  <span className="text-zinc-300">{"{"}</span>
                  {"\n  "}
                  <span className="text-zinc-400">name</span>:{" "}
                  <span className="text-emerald-300">'Mateus'</span>,{"\n  "}
                  <span className="text-zinc-400">role</span>:{" "}
                  <span className="text-emerald-300">'Front-End'</span>,{"\n  "}
                  <span className="text-zinc-400">stack</span>: [
                  <span className="text-emerald-300">'React'</span>,{"\n    "}
                  <span className="text-emerald-300">'TypeScript'</span>,
                  {"\n    "}
                  <span className="text-emerald-300">'Tailwind'</span>],{"\n  "}
                  <span className="text-zinc-400">passion</span>:{" "}
                  <span className="text-blue-400">true</span>,{"\n"}
                  <span className="text-zinc-300">{"}"}</span>;
                </code>
              </pre>
            </div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-10 left-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <Sparkles size={16} className="text-blue-300" />
              </div>
              <div>
                <div className="text-xs text-zinc-300">Front-End</div>
                <div className="text-[10px] text-zinc-500">UI moderna</div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-2 right-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl"
            >
              <div className="text-xs text-zinc-300">SpeakUp</div>
              <div className="text-[10px] text-zinc-500">React + TS</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
