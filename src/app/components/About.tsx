import { motion } from "motion/react";
import { Calendar, MapPin, GraduationCap, Code2 } from "lucide-react";

const timeline = [
  {
    year: "2024",
    title: "Curso em Vídeo — Algoritmos & Python",
    desc: "Fundamentos de lógica de programação e Python com Gustavo Guanabara.",
    icon: Code2,
  },
  {
    year: "2025",
    title: "Imersão Front-End — Alura",
    desc: "Aprofundamento em HTML, CSS, JavaScript e desenvolvimento de interfaces modernas.",
    icon: Code2,
  },
  {
    year: "2026",
    title: "Engenharia de Software — UniEVANGÉLICA",
    desc: "Início da graduação com foco em desenvolvimento de software e arquitetura.",
    icon: GraduationCap,
  },
  {
    year: "2026",
    title: "Projeto SpeakUp",
    desc: "Desenvolvimento de plataforma para registro e acompanhamento de denúncias urbanas.",
    icon: Code2,
  },
];

export function About() {
  return (
    <section id="sobre" className="relative py-28 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="01 / Sobre Mim"
          title="Conhecendo o desenvolvedor por trás do código"
        />

        <div className="grid lg:grid-cols-5 gap-10 mt-16">
          {/* Info card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-md p-7 space-y-5">
              <p className="text-zinc-400 leading-relaxed">
                Tenho 19 anos e estou começando minha jornada no mundo da
                tecnologia, com foco em desenvolvimento front-end, interfaces
                modernas e construção de soluções digitais elegantes e
                funcionais.
              </p>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <InfoRow
                  icon={Calendar}
                  label="Nascimento"
                  value="24 de Junho de 2006"
                />
                <InfoRow
                  icon={MapPin}
                  label="Natural de"
                  value="Vianópolis — Goiás"
                />
                <InfoRow
                  icon={GraduationCap}
                  label="Universidade"
                  value="UniEVANGÉLICA — Anápolis"
                />
                <InfoRow
                  icon={Code2}
                  label="Cursando"
                  value="Engenharia de Software"
                />
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <div className="lg:col-span-3 relative">
            <div className="absolute left-[18px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-500/40 via-white/10 to-transparent" />
            <ul className="space-y-7">
              {timeline.map((t, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative pl-14"
                >
                  <div className="absolute left-0 top-1 w-9 h-9 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center shadow-[0_0_0_4px_rgba(0,0,0,0.5)]">
                    <t.icon size={14} className="text-blue-400" />
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-5 hover:bg-white/[0.04] hover:border-white/20 transition">
                    <div className="text-xs text-blue-400 tracking-wider mb-1">
                      {t.year}
                    </div>
                    <h3 className="text-zinc-100 mb-1">{t.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                      {t.desc}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
        <Icon size={14} className="text-blue-400" />
      </div>
      <div>
        <div className="text-xs text-zinc-500">{label}</div>
        <div className="text-sm text-zinc-200">{value}</div>
      </div>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      <div className="text-xs tracking-[0.25em] text-blue-400 mb-4 uppercase">
        {eyebrow}
      </div>
      <h2 className="text-3xl sm:text-4xl text-white tracking-tight leading-tight">
        {title}
      </h2>
      {description && (
        <p className="text-zinc-400 mt-4 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
