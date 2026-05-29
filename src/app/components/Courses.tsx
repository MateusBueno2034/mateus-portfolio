import { motion } from "motion/react";
import { Award, ExternalLink } from "lucide-react";
import { SectionHeader } from "./About";

const courses = [
  {
    title: "Imersão Digital Front-End",
    org: "Alura",
    desc: "Desenvolvimento web moderno com HTML, CSS e JavaScript.",
    tag: "Front-End",
  },
  {
    title: "Algoritmos e Programação",
    org: "Curso em Vídeo — Gustavo Guanabara",
    desc: "Lógica de programação e fundamentos de algoritmos.",
    tag: "Fundamentos",
  },
  {
    title: "Python",
    org: "Curso em Vídeo — Gustavo Guanabara",
    desc: "Programação em Python do básico ao orientado a objetos.",
    tag: "Linguagem",
  },
];

export function Courses() {
  return (
    <section id="cursos" className="relative py-28 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="04 / Cursos & Certificados"
          title="Formação contínua e aprimoramento"
          description="Cursos concluídos que sustentam minha base técnica e meu desenvolvimento profissional."
        />

        <div className="grid md:grid-cols-3 gap-5 mt-14">
          {courses.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-md overflow-hidden hover:border-white/20 transition"
            >
              {/* Certificate top decoration */}
              <div className="relative h-32 bg-gradient-to-br from-zinc-900 to-black border-b border-white/5 overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(45deg, transparent 48%, rgba(96,165,250,0.2) 50%, transparent 52%), linear-gradient(-45deg, transparent 48%, rgba(96,165,250,0.1) 50%, transparent 52%)",
                    backgroundSize: "20px 20px",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                    <Award size={24} className="text-blue-300" />
                  </div>
                </div>
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] text-zinc-300 border border-white/10 bg-black/40 backdrop-blur-md">
                  {c.tag}
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div>
                  <h4 className="text-zinc-100 leading-snug">{c.title}</h4>
                  <div className="text-xs text-blue-400 mt-1">{c.org}</div>
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {c.desc}
                </p>
                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500">
                    Certificado digital
                  </span>
                  <ExternalLink
                    size={13}
                    className="text-zinc-600 group-hover:text-blue-400 transition-colors"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
