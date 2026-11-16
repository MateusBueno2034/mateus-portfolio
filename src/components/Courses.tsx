import { motion, useReducedMotion } from "motion/react";
import { Award } from "lucide-react";

export const courses = [
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
    title: "Python 3 – Mundo 1",
    org: "Curso em Vídeo — Gustavo Guanabara",
    desc: "Fundamentos da linguagem Python e primeiros conceitos de programação.",
    tag: "Linguagem",
  },
  {
    title: "Python 3 – Mundo 2",
    org: "Curso em Vídeo — Gustavo Guanabara",
    desc: "Estruturas condicionais, repetições e controle de fluxo em Python.",
    tag: "Linguagem",
  },
  {
    title: "Python 3 – Mundo 3",
    org: "Curso em Vídeo — Gustavo Guanabara",
    desc: "Estruturas de dados e aprofundamento da programação em Python.",
    tag: "Linguagem",
  },
  {
    title: "Python 3 – Mundo 4",
    org: "Curso em Vídeo — Gustavo Guanabara",
    desc: "Continuação e aprofundamento dos estudos em Python.",
    tag: "Linguagem",
  },
  {
    title: "JavaScript",
    org: "Curso em Vídeo — Gustavo Guanabara",
    desc: "Fundamentos de JavaScript e programação para aplicações web.",
    tag: "Linguagem",
  },
  {
    title: "Git e GitHub",
    org: "Curso em Vídeo — Gustavo Guanabara",
    desc: "Controle de versão, gerenciamento de repositórios e colaboração utilizando Git e GitHub.",
    tag: "Ferramentas",
  },
  {
    title: "PHP Moderno: Módulo 01",
    org: "Curso em Vídeo — Gustavo Guanabara",
    desc: "Fundamentos de PHP moderno e programação no lado do servidor.",
    tag: "Linguagem",
  },
  {
    title: "CS50 — Introduction to Computer Science",
    org: "Harvard University",
    desc: "Fundamentos de ciência da computação, pensamento computacional, Scratch, C, algoritmos, memória, estruturas de dados, Python, SQL, desenvolvimento web e introdução à inteligência artificial.",
    tag: "Ciência da computação",
  },
  {
    title: "Currículo Full-Stack",
    org: "freeCodeCamp",
    desc: "Trilha prática com seis certificações: Responsive Web Design, JavaScript Algorithms and Data Structures, Front End Development Libraries, Python Programming, Relational Databases e Back End Development and APIs.",
    tag: "Desenvolvimento Full-Stack",
  },
  {
    title: "6.0001 — Introduction to CS and Programming in Python",
    org: "MIT OpenCourseWare",
    desc: "Fundamentos da ciência da computação e introdução à programação utilizando Python.",
    tag: "Programação",
  },
  {
    title: "6.0002 — Introduction to Computational Thinking and Data Science",
    org: "MIT OpenCourseWare",
    desc: "Pensamento computacional, análise de dados e resolução de problemas utilizando Python.",
    tag: "Ciência de dados",
  },
  {
    title: "6.S096 — Introduction to C and C++",
    org: "MIT OpenCourseWare",
    desc: "Fundamentos de C e C++, gerenciamento de memória, ponteiros e programação orientada a objetos.",
    tag: "Linguagem",
  },
  {
    title: "6.006 — Introduction to Algorithms",
    org: "MIT OpenCourseWare",
    desc: "Estudo de algoritmos, estruturas de dados e análise de complexidade computacional.",
    tag: "Algoritmos",
  },
  {
    title: "Currículo de Desenvolvimento Full-Stack",
    org: "The Odin Project",
    desc: "Formação prática em desenvolvimento web com HTML, CSS, JavaScript, Git, projetos práticos e trilhas de especialização em Full Stack JavaScript ou Ruby on Rails.",
    tag: "Desenvolvimento Full-Stack",
  },
  {
    title: "Discover",
    org: "Rocketseat",
    desc: "Introdução à programação e ao desenvolvimento web com HTML, CSS, JavaScript, Git, GitHub e construção de um projeto prático.",
    tag: "Fundamentos",
  },
];

export function Courses() {
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <section
      id="cursos"
      aria-labelledby="courses-heading"
      className="section-space-compact relative px-6 lg:px-10"
    >
      <div className="site-container">
        <header className="grid gap-6 border-b border-[var(--border)] pb-10 md:grid-cols-[minmax(0,1fr)_minmax(15rem,0.62fr)] md:items-end md:gap-16">
          <div>
            <p className="eyebrow mb-5">05 / Cursos &amp; Certificados</p>
            <h2
              id="courses-heading"
              className="max-w-3xl text-3xl leading-[1.08] tracking-tight text-[var(--text-primary)] sm:text-4xl lg:text-5xl"
            >
              Formação contínua e aprimoramento.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[var(--text-secondary)] md:justify-self-end">
            Cursos e trilhas de aprendizado nas áreas de programação, tecnologia
            e desenvolvimento de software.
          </p>
        </header>

        <ol className="mt-6 divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {courses.map((course, index) => (
            <motion.li
              key={course.title}
              initial={prefersReducedMotion ? false : { opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: prefersReducedMotion ? 0.01 : 0.58,
                delay: prefersReducedMotion ? 0 : index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              onPointerEnter={() =>
                window.dispatchEvent(
                  new CustomEvent("portfolio:focus", { detail: `course:${index}` }),
                )
              }
              onFocusCapture={() =>
                window.dispatchEvent(
                  new CustomEvent("portfolio:focus", { detail: `course:${index}` }),
                )
              }
              onPointerLeave={() =>
                window.dispatchEvent(new CustomEvent("portfolio:focus", { detail: "" }))
              }
              className="course-depth-row grid gap-3 py-6 sm:grid-cols-[4rem_minmax(0,1fr)_minmax(10rem,0.8fr)] sm:items-center sm:gap-7 lg:gap-12"
            >
              <span className="font-mono text-xs tabular-nums text-[var(--text-muted)]">
                {(index + 1).toString().padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-lg tracking-tight text-[var(--text-primary)] sm:text-xl">
                  {course.title}
                </h3>
                <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
                  {course.org}
                </p>
              </div>
              <div className="grid min-w-0 grid-cols-[1.25rem_minmax(0,1fr)] items-start gap-3 sm:justify-self-stretch">
                <Award
                  size={14}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[var(--accent)]"
                />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    {course.tag}
                  </p>
                  <p className="mt-1 max-w-sm text-xs leading-5 text-[var(--text-secondary)]">
                    {course.desc}
                  </p>
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
