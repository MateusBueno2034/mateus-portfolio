import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import smokehousePreview from "../assets/projects/smokehouse-preview.png";
import { useAchievements } from "../lib/achievements";

type Project = {
  id: string;
  number: string;
  name: string;
  type: string;
  overview: string;
  technologies: string[];
  features: string[];
  githubUrl?: string;
  demoUrl?: string;
  previewImage?: string;
  previewAlt?: string;
  coverLines: string[];
  mediaOnRight?: boolean;
};

const projects: Project[] = [
  {
    id: "finora",
    number: "01",
    name: "Finora",
    type: "Gerenciador financeiro pessoal",
    overview:
      "Gerenciador financeiro pessoal local-first desenvolvido com React e TypeScript, com foco em organização de código, privacidade e segurança.",
    technologies: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Vite",
      "LocalStorage",
    ],
    features: [
      "CRUD completo de transações",
      "Dashboard com receitas, despesas e saldo",
      "Busca e filtros de transações",
      "Visualização de gastos por categoria",
      "Persistência de dados com LocalStorage",
      "Exportação e importação de backups",
      "Validação de dados",
      "Interface responsiva",
      "Content Security Policy (CSP)",
      "Funcionamento sem backend ou envio de dados financeiros para servidores",
    ],
    githubUrl: "https://github.com/MateusBueno2034/Finora",
    demoUrl: "https://mateusbueno2034.github.io/Finora/",
    coverLines: ["LOCAL-FIRST", "Sem backend"],
  },
  {
    id: "speakup",
    number: "02",
    name: "SpeakUp",
    type: "Plataforma de ocorrências urbanas",
    overview:
      "Plataforma desenvolvida para facilitar o registro e acompanhamento de denúncias e problemas urbanos por meio de uma interface moderna e responsiva.",
    technologies: [
      "React",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Vite",
      "shadcn/ui",
    ],
    features: [
      "Registro de denúncias",
      "Dashboard administrativo",
      "Sistema de notificações",
      "Histórico de ocorrências",
      "Organização e filtros de dados",
      "Interface responsiva",
    ],
    githubUrl: "https://github.com/MateusBueno2034/SpeakUp",
    coverLines: ["Registro e acompanhamento", "Denúncias e problemas urbanos"],
    mediaOnRight: true,
  },
  {
    id: "mesaflow",
    number: "03",
    name: "MesaFlow",
    type: "Plataforma SaaS multiempresa · MVP em desenvolvimento",
    overview:
      "Plataforma para gestão de restaurantes e estabelecimentos alimentícios, centralizando operações de produtos, pedidos, caixa, estoque, pagamentos e equipe. O projeto está em desenvolvimento na etapa de MVP.",
    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Supabase",
      "PostgreSQL",
      "SQL",
      "RLS",
    ],
    features: [
      "Gerenciamento de empresas e unidades",
      "Autenticação, confirmação de e-mail e permissões",
      "Produtos, pedidos e comandas",
      "Abertura e fechamento de sessões de caixa",
      "Estoque, pagamentos e relatórios operacionais",
    ],
    previewImage: `${import.meta.env.BASE_URL}images/projects/mesaflow.webp`,
    previewAlt: "Captura de tela do MesaFlow",
    coverLines: ["MVP em desenvolvimento", "Gestão de operações"],
    mediaOnRight: true,
  },
  {
    id: "smokehouse",
    number: "04",
    name: "SmokeHouse Landing Page",
    type: "Landing page",
    overview:
      "Landing page desenvolvida para uma hamburgueria artesanal fictícia, com foco em desenvolvimento front-end, identidade visual, responsividade e experiência de navegação.",
    technologies: ["HTML", "CSS", "JavaScript", "jQuery", "ScrollReveal"],
    features: [
      "Layout responsivo",
      "Menu mobile",
      "Navegação suave",
      "Animações durante o scroll",
      "Organização visual do conteúdo",
      "Interface adaptada para diferentes tamanhos de tela",
    ],
    githubUrl: "https://github.com/MateusBueno2034/SmokeHouse",
    demoUrl: "https://mateusbueno2034.github.io/SmokeHouse/",
    previewImage: smokehousePreview,
    previewAlt: "Preview da landing page da SmokeHouse",
    coverLines: [],
  },
];

const projectImages = {
  finora: `${import.meta.env.BASE_URL}images/projects/finora.webp`,
  speakup: `${import.meta.env.BASE_URL}images/projects/speakup.webp`,
};

const projectImageMetadata = {
  finora: { src: projectImages.finora, alt: "Captura de tela do Finora" },
  speakup: { src: projectImages.speakup, alt: "Captura de tela do SpeakUp" },
};

Object.entries(projectImageMetadata).forEach(([id, image]) => {
  const project = projects.find((item) => item.id === id);
  if (project) {
    project.previewImage = image.src;
    project.previewAlt = image.alt;
  }
});

export function Projects() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const articles = Array.from(section.querySelectorAll<HTMLElement>("article[id^='projeto-']"));
    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (active) {
          window.dispatchEvent(
            new CustomEvent("portfolio:focus", {
              detail: active.target.id.replace("projeto-", ""),
            }),
          );
        }
      },
      { rootMargin: "-34% 0px -44% 0px", threshold: [0.1, 0.35, 0.6, 0.9] },
    );
    articles.forEach((article) => observer.observe(article));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projetos"
      aria-labelledby="projects-heading"
      className="relative overflow-hidden px-6 py-24 sm:py-28 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <header className="grid gap-6 border-b border-[var(--border)] pb-12 sm:gap-8 md:grid-cols-[minmax(0,1fr)_minmax(15rem,0.62fr)] md:items-end md:gap-16 lg:pb-16">
          <div>
            <p className="eyebrow mb-6">03 / Projetos selecionados</p>
            <h2
              id="projects-heading"
              className="max-w-4xl text-4xl leading-[1.08] tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl"
            >
              Ideias em forma de produto.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[var(--text-secondary)] md:justify-self-end">
            Uma seleção de interfaces e experiências web construídas em
            projetos próprios.
          </p>
        </header>

        <div className="divide-y divide-[var(--border)]">
          {projects.map((project, index) => (
            <ProjectCaseStudy
              key={project.id}
              project={project}
              index={index}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCaseStudy({
  project,
  index,
  prefersReducedMotion,
}: {
  project: Project;
  index: number;
  prefersReducedMotion: boolean;
}) {
  const { unlock } = useAchievements();
  const tiltX = useSpring(useMotionValue(0), { stiffness: 160, damping: 20 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 160, damping: 20 });
  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    tiltX.set(((event.clientY - bounds.top) / bounds.height - 0.5) * -8);
    tiltY.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 8);
    window.dispatchEvent(new CustomEvent("portfolio:focus", { detail: project.id }));
  };
  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };
  const initialVisual = prefersReducedMotion
    ? false
    : index === 0
      ? { opacity: 0, y: 18, scale: 0.985 }
      : index === 1
        ? { opacity: 0, x: 18, scale: 0.99 }
        : { opacity: 0, scale: 0.955, filter: "blur(4px)" };

  return (
    <article
      id={`projeto-${project.id}`}
      aria-labelledby={`project-${project.id}-heading`}
      className="py-12 first:pt-10 sm:py-16 lg:py-20"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onFocusCapture={() =>
        window.dispatchEvent(new CustomEvent("portfolio:focus", { detail: project.id }))
      }
    >
      <div className="mb-7 flex items-center justify-between gap-4 sm:mb-9">
        <span className="font-mono text-xs tabular-nums text-[var(--text-muted)]">
          {project.number} <span aria-hidden="true">/</span>{" "}
          {projects.length.toString().padStart(2, "0")}
        </span>
        <span className="text-right text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
          {project.type}
        </span>
      </div>

      <h3
        id={`project-${project.id}-heading`}
        className="mb-7 text-3xl leading-tight tracking-tight text-[var(--text-primary)] sm:mb-9 sm:text-4xl lg:text-5xl"
      >
        {project.name}
      </h3>

      <div
        className={`grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12 ${
          project.mediaOnRight ? "lg:[&>figure]:order-2" : ""
        }`}
      >
        <motion.figure
          style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 900 }}
          whileHover={prefersReducedMotion ? undefined : { scale: 1.018, z: 12 }}
          initial={initialVisual}
          whileInView={{
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: prefersReducedMotion ? 0.01 : index === 2 ? 0.9 : 0.72,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`group relative m-0 overflow-hidden border border-[var(--border)] bg-[var(--surface)] transition-[border-color,box-shadow] duration-300 after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(110deg,transparent_35%,rgb(255_255_255_/_7%)_50%,transparent_65%)] after:opacity-0 after:transition-opacity after:duration-500 group-hover:after:opacity-100 lg:col-span-7 ${
            project.previewImage
              ? "aspect-[16/9]"
              : "flex aspect-[4/3] flex-col justify-between p-6 sm:p-10 lg:aspect-[16/10]"
          }`}
        >
          {project.previewImage ? (
            <ProjectImage
              src={project.previewImage}
              alt={project.previewAlt ?? ""}
              prefersReducedMotion={prefersReducedMotion}
            />
          ) : (
            <>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Visão geral do projeto
              </span>
              <div>
                <p className="mb-4 text-xs text-[var(--text-secondary)]">
                  {project.type}
                </p>
                <p className="max-w-xl text-3xl leading-[1.12] tracking-tight text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
                  {project.name}
                </p>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--border)] pt-4 text-[10px] uppercase tracking-[0.15em] text-[var(--text-secondary)]">
                {project.coverLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>
            </>
          )}
        </motion.figure>

        <div className="flex flex-col lg:col-span-5 lg:pt-3">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Visão geral
          </div>
          <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)] sm:text-base sm:leading-8">
            {project.overview}
          </p>

          <div className="mt-7 border-t border-[var(--border)] pt-5">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Tecnologias
            </h4>
            <p className="mt-3 text-xs leading-6 text-[var(--text-secondary)] sm:text-sm">
              {project.technologies.join(" · ")}
            </p>
          </div>

          <details className="group/details mt-6 border-t border-[var(--border)]">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] [&::-webkit-details-marker]:hidden">
              <span>Funcionalidades do projeto</span>
              <span
                aria-hidden="true"
                className="text-sm transition-transform duration-200 group-open/details:rotate-45"
              >
                +
              </span>
            </summary>
            <ul className="space-y-2 pb-5 pl-4 text-xs leading-6 text-[var(--text-secondary)] marker:text-[var(--text-muted)]">
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </details>

          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Abrir repositório de ${project.name} em nova aba`}
                onClick={() => unlock("project-explorer")}
                className="group/link inline-flex min-h-11 items-center gap-2 text-xs text-[var(--text-primary)] transition-colors hover:text-[var(--text-secondary)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                <Github size={14} aria-hidden="true" />
                Código-fonte
                <ExternalLink
                  size={12}
                  aria-hidden="true"
                  className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                />
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Abrir demonstração de ${project.name} em nova aba`}
                onClick={() => unlock("project-explorer")}
                className="group/link inline-flex min-h-11 items-center gap-2 text-xs text-[var(--text-primary)] transition-colors hover:text-[var(--text-secondary)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              >
                Explorar projeto
                <ArrowUpRight
                  size={14}
                  aria-hidden="true"
                  className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function ProjectImage({
  src,
  alt,
  prefersReducedMotion,
}: {
  src: string;
  alt: string;
  prefersReducedMotion: boolean;
}) {
  const [hasImage, setHasImage] = useState(true);

  if (!hasImage) {
    return (
      <div className="flex h-full flex-col justify-between bg-[linear-gradient(145deg,var(--surface),var(--background-secondary))] p-6 sm:p-10">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Imagem do projeto
        </span>
        <div>
          <p className="text-3xl leading-[1.12] tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Captura de tela em breve
          </p>
          <p className="mt-3 max-w-sm text-xs leading-5 text-[var(--text-secondary)]">
            Adicione a imagem real do projeto no caminho configurado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={1897}
      height={1078}
      loading="lazy"
      decoding="async"
      onError={() => setHasImage(false)}
      className={`h-full w-full bg-[var(--background-secondary)] object-contain p-2 transition-transform duration-700 sm:p-3 ${
        prefersReducedMotion ? "" : "group-hover:scale-[1.015]"
      }`}
    />
  );
}
