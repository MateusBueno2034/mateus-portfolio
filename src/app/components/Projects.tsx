import { motion } from "motion/react";
import { SectionHeader } from "./About";
import smokehousePreview from "../../assets/projects/smokehouse-preview.png";
import {
  AlertCircle,
  LayoutDashboard,
  Bell,
  ClipboardList,
  Smartphone,
  Filter,
  ArrowUpRight,
  MapPin,
  CheckCircle2,
  TrendingUp,
  ExternalLink,
} from "lucide-react";

const features = [
  { icon: AlertCircle, label: "Registro de denúncias" },
  { icon: LayoutDashboard, label: "Dashboard administrativo" },
  { icon: Bell, label: "Sistema de notificações" },
  { icon: ClipboardList, label: "Histórico de ocorrências" },
  { icon: Smartphone, label: "Interface responsiva" },
  { icon: Filter, label: "Organização e filtros" },
];

const techs = [
  "React",
  "TypeScript",
  "TailwindCSS",
  "JavaScript",
  "HTML",
  "CSS",
  "Vite",
  "shadcn/ui",
];

const finoraHighlights = [
  "CRUD de transações",
  "Filtros e busca",
  "Persistência local",
  "Backup e importação",
];

const finoraTechs = ["React", "TypeScript", "Tailwind CSS", "Vite", "LocalStorage"];

const smokehouseHighlights = [
  "Landing page responsiva",
  "Menu mobile e navegação suave",
  "Animações e scroll reveal",
  "UI organizada e visualmente consistente",
];

const smokehouseTechs = ["HTML", "CSS", "JavaScript", "jQuery", "ScrollReveal"];

export function Projects() {
  return (
    <section id="projetos" className="relative py-28 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="03 / Projetos"
          title="Soluções desenvolvidas com propósito"
          description="Projetos que combinam design moderno, código limpo e impacto real para o usuário final."
        />

        <div className="mt-14 space-y-16">
          <ProjectPanel
            eyebrow="Projeto em destaque"
            title="Finora"
            description="Gerenciador financeiro pessoal local-first desenvolvido com React e TypeScript. O projeto reúne CRUD de transações, filtros dinâmicos, visualização de despesas, persistência no navegador e operações de backup, com foco em organização de código, privacidade e segurança."
            highlights={finoraHighlights}
            techs={finoraTechs}
            githubUrl="https://github.com/MateusBueno2034/Finora"
            demoUrl="https://mateusbueno2034.github.io/Finora/"
            previewImage="https://raw.githubusercontent.com/MateusBueno2034/Finora/main/image.png"
            previewAlt="Preview do projeto Finora"
            accentClass="text-emerald-400"
            dotClass="bg-emerald-400"
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid lg:grid-cols-2 gap-10 items-center"
          >
            {/* Left content */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs text-blue-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Projeto em destaque
              </div>
              <h3 className="text-3xl sm:text-4xl text-white tracking-tight">
                SpeakUp
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Plataforma desenvolvida para facilitar o registro e
                acompanhamento de denúncias e problemas urbanos, conectando
                cidadãos e órgãos públicos por meio de uma interface intuitiva e
                responsiva.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {features.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.02] backdrop-blur-md"
                  >
                    <f.icon size={14} className="text-blue-400 shrink-0" />
                    <span className="text-xs text-zinc-300">{f.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {techs.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full text-xs text-zinc-300 border border-white/10 bg-white/5"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <a
                  href="https://github.com/MateusBueno2034/SpeakUp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-zinc-200 hover:bg-white/10 transition text-sm"
                >
                  GitHub
                  <ExternalLink
                    size={14}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </a>
                <a
                  href="#contato"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-zinc-200 hover:bg-white/10 transition text-sm"
                >
                  Saber mais
                  <ArrowUpRight
                    size={14}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </a>
              </div>
            </div>

            {/* Right mockup */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-900/20 via-transparent to-blue-700/10 blur-3xl rounded-full" />
              <div className="relative rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl shadow-2xl overflow-hidden">
                {/* Window header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-black/40">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                  <div className="flex-1 mx-4 px-3 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-zinc-500 truncate">
                    speakup.app/dashboard
                  </div>
                </div>

                {/* Mock dashboard */}
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-zinc-100 text-sm">Dashboard</div>
                      <div className="text-xs text-zinc-500">
                        Visão geral das ocorrências
                      </div>
                    </div>
                    <div className="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-300">
                      Tempo real
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <StatCard
                      icon={ClipboardList}
                      value="248"
                      label="Total"
                      color="text-blue-400"
                    />
                    <StatCard
                      icon={CheckCircle2}
                      value="186"
                      label="Resolvidas"
                      color="text-emerald-400"
                    />
                    <StatCard
                      icon={TrendingUp}
                      value="62"
                      label="Ativas"
                      color="text-amber-400"
                    />
                  </div>

                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-zinc-400">
                        Ocorrências recentes
                      </div>
                      <Filter size={12} className="text-zinc-600" />
                    </div>
                    {[
                      { t: "Buraco na via", l: "Centro", s: "Em análise" },
                      {
                        t: "Iluminação pública",
                        l: "Setor Norte",
                        s: "Resolvido",
                      },
                      { t: "Coleta de lixo", l: "Vila Sul", s: "Pendente" },
                    ].map((o, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 py-2 border-t border-white/5 first:border-t-0"
                      >
                        <div className="w-7 h-7 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                          <MapPin size={12} className="text-blue-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-zinc-200 truncate">
                            {o.t}
                          </div>
                          <div className="text-[10px] text-zinc-500">{o.l}</div>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border ${
                            o.s === "Resolvido"
                              ? "text-emerald-300 border-emerald-500/30 bg-emerald-500/10"
                              : o.s === "Pendente"
                              ? "text-amber-300 border-amber-500/30 bg-amber-500/10"
                              : "text-blue-300 border-blue-500/30 bg-blue-500/10"
                          }`}
                        >
                          {o.s}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                    <div className="text-xs text-zinc-400 mb-2">
                      Atividade semanal
                    </div>
                    <div className="flex items-end gap-1.5 h-16">
                      {[40, 65, 35, 80, 55, 90, 70].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t bg-gradient-to-t from-blue-700/40 to-blue-400/80"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating mobile mockup */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -right-2 sm:-right-6 w-32 sm:w-40 rounded-2xl border border-white/10 bg-zinc-950/90 backdrop-blur-xl shadow-2xl overflow-hidden hidden sm:block"
              >
                <div className="px-3 py-2 border-b border-white/5">
                  <div className="text-[9px] text-zinc-500">SpeakUp</div>
                  <div className="text-xs text-zinc-200">Nova denúncia</div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="h-1.5 rounded-full bg-white/10" />
                  <div className="h-1.5 rounded-full bg-white/10 w-3/4" />
                  <div className="h-1.5 rounded-full bg-white/10 w-1/2" />
                  <div className="h-7 rounded-md bg-blue-600/80 mt-2 flex items-center justify-center text-[9px] text-white">
                    Enviar
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <ProjectPanel
            eyebrow="Landing page"
            title="Smokehouse Landing Page"
            description="Landing page responsiva para uma hamburgueria artesanal fictícia, desenvolvida com foco em identidade visual, navegação fluida, menu mobile e apresentação de conteúdo em uma experiência com boa hierarquia visual e interação."
            highlights={smokehouseHighlights}
            techs={smokehouseTechs}
            githubUrl="https://github.com/MateusBueno2034/SmokeHouse"
            demoUrl="https://mateusbueno2034.github.io/SmokeHouse/"
            previewImage={smokehousePreview}
            previewAlt="Preview da landing page Smokehouse"
            accentClass="text-orange-400"
            dotClass="bg-orange-400"
          />
        </div>
      </div>
    </section>
  );
}

function ProjectPanel({
  eyebrow,
  title,
  description,
  highlights,
  techs,
  githubUrl,
  demoUrl,
  previewImage,
  previewAlt,
  accentClass,
  dotClass,
}: {
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
  techs: string[];
  githubUrl: string;
  demoUrl?: string;
  previewImage: string;
  previewAlt: string;
  accentClass: string;
  dotClass: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center"
    >
      <div className="space-y-6">
        <div className={`flex items-center gap-2 text-xs ${accentClass}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
          {eyebrow}
        </div>
        <h3 className="text-3xl sm:text-4xl text-white tracking-tight">{title}</h3>
        <p className="text-zinc-400 leading-relaxed">{description}</p>

        <div className="grid gap-3 sm:grid-cols-2">
          {highlights.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-white/10 bg-white/[0.02] backdrop-blur-md"
            >
              <CheckCircle2 size={14} className={`${accentClass} shrink-0`} />
              <span className="text-xs text-zinc-300">{item}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {techs.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full text-xs text-zinc-300 border border-white/10 bg-white/5"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-zinc-200 hover:bg-white/10 transition text-sm"
          >
            GitHub
            <ExternalLink
              size={14}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </a>
          {demoUrl ? (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-zinc-200 hover:bg-white/10 transition text-sm"
            >
              Demonstração
              <ArrowUpRight
                size={14}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </a>
          ) : null}
        </div>
      </div>

      <div className="relative">
        <div className={`absolute -inset-4 bg-gradient-to-br ${accentClass === "text-emerald-400" ? "from-emerald-900/20 via-transparent to-emerald-700/10" : accentClass === "text-orange-400" ? "from-orange-900/20 via-transparent to-orange-700/10" : "from-blue-900/20 via-transparent to-blue-700/10"} blur-3xl rounded-full`} />
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl shadow-2xl">
          <img
            src={previewImage}
            alt={previewAlt}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: typeof MapPin;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
      <Icon size={12} className={color} />
      <div className="text-zinc-100 text-base mt-1">{value}</div>
      <div className="text-[10px] text-zinc-500">{label}</div>
    </div>
  );
}
