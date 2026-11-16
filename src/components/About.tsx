import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import {
  revealScaleVariants,
  revealVariants,
  staggerVariants,
} from "../lib/motion";
import { timeline } from "../lib/timeline";
import { usePortraitDrag } from "../lib/usePortraitDrag";

const profileImage = `${import.meta.env.BASE_URL}images/profile/mateus.webp`;

const profileDetails = [
  { label: "Idade", value: "20 anos" },
  { label: "Origem", value: "Vianópolis, Goiás" },
  { label: "Universidade", value: "UniEVANGÉLICA · Anápolis" },
];

export function About() {
  const prefersReducedMotion =
    useReducedMotion() ??
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const initial = prefersReducedMotion ? false : "hidden";
  const timelineRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 72%", "end 58%"],
  });
  const timelineProgress = useSpring(scrollYProgress, {
    stiffness: 72,
    damping: 24,
    restDelta: 0.001,
  });
  const portraitDrag = usePortraitDrag();

  return (
    <section
      id="sobre"
      aria-labelledby="about-title"
      className="section-space relative isolate overflow-hidden px-5 sm:px-8 lg:px-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 -z-10 h-[18rem] w-[18rem] rounded-full bg-[radial-gradient(circle,var(--ambient-light),transparent_68%)] opacity-70 lg:-right-48 lg:-top-48 lg:h-[34rem] lg:w-[34rem]"
      />

      <div className="site-container">
        <div className="flex items-center justify-between border-y border-[var(--border)] py-4">
          <p className="eyebrow">Sobre / trajetória</p>
          <span className="text-[0.65rem] uppercase tracking-[0.16em] text-[var(--text-muted)]">
            01 — 04
          </span>
        </div>

        <header className="grid gap-6 py-12 sm:py-16 lg:grid-cols-12 lg:items-end lg:gap-10 lg:py-20">
          <motion.h2
            id="about-title"
            variants={revealVariants}
            initial={initial}
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            className="max-w-5xl text-[clamp(2.75rem,7vw,6.5rem)] font-medium leading-[0.94] tracking-[-0.07em] text-[var(--text-primary)] lg:col-span-9"
          >
            Da lógica à construção{" "}
            <span className="text-[var(--text-secondary)]">
              de interfaces.
            </span>
          </motion.h2>
          <p className="text-xs uppercase leading-6 tracking-[0.13em] text-[var(--text-muted)] lg:col-span-3 lg:pb-2 lg:text-right">
            Uma trajetória em desenvolvimento
          </p>
        </header>

        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-14">
          <motion.div
            variants={staggerVariants}
            initial={initial}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:col-span-5"
          >
            <motion.p
              variants={revealVariants}
              className="max-w-xl text-lg leading-8 text-[var(--text-primary)] sm:text-xl sm:leading-9"
            >
              Sou Mateus, estudante de Engenharia de Software na
              UniEVANGÉLICA, em Anápolis. Tenho 20 anos e me interesso por
              tecnologia, interfaces modernas e soluções digitais funcionais.
            </motion.p>
            <motion.p
              variants={revealVariants}
              className="mt-5 max-w-lg text-sm leading-7 text-[var(--text-secondary)] sm:text-base sm:leading-8"
            >
              Minha trajetória passa pela lógica de programação, por estudos
              de front-end e pela graduação. Hoje, essa base também ganha forma
              em projetos como o SpeakUp.
            </motion.p>

            <motion.dl
              variants={revealVariants}
              className="mt-9 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[var(--border)] pt-5 sm:mt-11 sm:grid-cols-3"
            >
              {profileDetails.map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-[0.65rem] uppercase tracking-[0.13em] text-[var(--text-muted)]">
                    {label}
                  </dt>
                  <dd className="mt-2 text-sm leading-6 text-[var(--text-primary)]">
                    {value}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          <motion.figure
            variants={revealScaleVariants}
            initial={initial}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="group relative z-10 isolate lg:col-span-7"
          >
            <div
              ref={portraitDrag.frameRef}
              role="img"
              aria-label="Fotografia de Mateus Henrique Bueno de Carvalho"
              className="relative aspect-[2/3] w-full max-w-[31rem] cursor-grab overflow-hidden border border-[var(--border-strong)] bg-[var(--background-secondary)] active:cursor-grabbing"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_68%_34%,rgb(232_231_227_/_6%),transparent_56%),linear-gradient(145deg,rgb(255_255_255_/_3%),transparent_52%,rgb(255_255_255_/_1%))] transition-opacity duration-[var(--motion-duration-slow)] group-hover:opacity-75"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-[8%] top-1/2 h-px bg-[var(--border)]"
              />
              <div
                aria-hidden="true"
                className="absolute bottom-[12%] left-[8%] top-[12%] w-px bg-[var(--border)]"
              />
              <span
                aria-hidden="true"
                className="absolute left-[8%] top-[12%] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-[12%] right-[8%] h-1.5 w-1.5 translate-x-1/2 translate-y-1/2 rounded-full bg-[var(--accent)]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 flex select-none items-center justify-center text-[clamp(10rem,30vw,23rem)] font-medium leading-none tracking-[-0.12em] text-[var(--text-primary)]/[0.035]"
              >
                M
              </div>
              <div
                ref={portraitDrag.viewportRef}
                onPointerDown={portraitDrag.onPointerDown}
                onPointerMove={portraitDrag.onPointerMove}
                onPointerUp={portraitDrag.onPointerUp}
                onPointerCancel={portraitDrag.onPointerUp}
                onDoubleClick={portraitDrag.onDoubleClick}
                className="absolute inset-[3%] z-20 touch-none select-none overflow-hidden"
              >
                <img
                  ref={portraitDrag.imageRef}
                  src={profileImage}
                  alt="Fotografia de Mateus Henrique Bueno de Carvalho"
                  width={1079}
                  height={1457}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="absolute left-1/2 top-1/2 max-w-none select-none object-cover object-center"
                />
              </div>
            </div>
            <figcaption className="mt-3 flex items-center justify-between text-[0.65rem] uppercase tracking-[0.12em] text-[var(--text-muted)]">
              <span>Mateus Henrique Bueno de Carvalho</span>
              <span>01 / 04</span>
            </figcaption>
          </motion.figure>
        </div>

        <div className="mt-16 border-t border-[var(--border)] pt-6 sm:mt-20 sm:pt-8">
          <div className="mb-7 flex items-center justify-between">
            <h3 className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)]">
              Percurso
            </h3>
            <span className="text-[0.65rem] uppercase tracking-[0.14em] text-[var(--text-muted)]">
              2024 — 2025
            </span>
          </div>

          <motion.ol
            ref={timelineRef}
            variants={staggerVariants}
            initial={initial}
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="relative grid gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0"
          >
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute left-0 right-0 top-0 z-10 hidden h-px origin-left bg-[var(--accent)] lg:block"
              style={{ scaleX: prefersReducedMotion ? 1 : timelineProgress }}
            />
            {timeline.map(({ year, title, detail }, index) => (
              <motion.li
                key={`${year}-${title}`}
                variants={revealVariants}
                onPointerEnter={() =>
                  window.dispatchEvent(
                    new CustomEvent("portfolio:focus", { detail: `about:${index}` }),
                  )
                }
                onPointerLeave={() =>
                  window.dispatchEvent(new CustomEvent("portfolio:focus", { detail: "" }))
                }
                onFocusCapture={() =>
                  window.dispatchEvent(
                    new CustomEvent("portfolio:focus", { detail: `about:${index}` }),
                  )
                }
                className="relative border-l border-[var(--border-strong)] pl-5 lg:border-l-0 lg:border-t lg:pl-0 lg:pr-6 lg:pt-5"
              >
                <TimelineNode progress={timelineProgress} index={index} />
                <span aria-hidden="true" className="timeline-depth-line" />
                <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  <span>{year}</span>
                  <span aria-hidden="true">/</span>
                  <span>0{index + 1}</span>
                </div>
                <h4 className="mt-3 text-base font-medium leading-6 text-[var(--text-primary)]">
                  {title}
                </h4>
                <p className="mt-1.5 text-sm leading-6 text-[var(--text-secondary)]">
                  {detail}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}

function TimelineNode({
  progress,
  index,
}: {
  progress: ReturnType<typeof useSpring>;
  index: number;
}) {
  const activation = useTransform(
    progress,
    [Math.max(0, index / timeline.length - 0.12), Math.min(1, (index + 1) / timeline.length)],
    [0, 1],
  );
  return (
    <motion.span
      aria-hidden="true"
      style={{ scale: activation, y: useTransform(activation, [0, 1], [10, 0]) }}
      className="timeline-node absolute -left-[0.2rem] top-0 h-2.5 w-2.5 origin-center rounded-full bg-[var(--accent)] shadow-[0_0_0_5px_var(--accent-muted)] lg:-top-[0.3rem] lg:left-0"
    />
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
      <div className="mb-4 text-xs uppercase tracking-[0.25em] text-[var(--text-secondary)]">
        {eyebrow}
      </div>
      <h2 className="text-3xl leading-tight tracking-tight text-[var(--text-primary)] sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 leading-relaxed text-[var(--text-secondary)]">
          {description}
        </p>
      )}
    </div>
  );
}
