import { motion, useReducedMotion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, Github, Linkedin, Mail, MessageCircle, Phone } from "lucide-react";

const contactLinks = [
  {
    label: "WhatsApp",
    href: "https://wa.me/5562996207144",
    icon: MessageCircle,
  },
  {
    label: "GitHub",
    href: "https://github.com/MateusBueno2034",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mateus-henrique-bueno-de-carvalho-598a2539b/",
    icon: Linkedin,
  },
];

export function Contact() {
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <section
      id="contato"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden px-6 py-28 sm:py-36 lg:px-10 lg:py-44"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--border)]" />
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 18, scale: 0.995 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: prefersReducedMotion ? 0.01 : 0.82, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-7xl"
      >
        <div aria-hidden="true" className="contact-depth-composition">
          <span />
          <span />
          <span />
        </div>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-14">
          <div className="lg:col-span-8">
            <p className="eyebrow mb-7">06 / Contato</p>
            <motion.h2
              id="contact-heading"
              initial={prefersReducedMotion ? false : { clipPath: "inset(0 0 100% 0)" }}
              whileInView={{ clipPath: "inset(0 0 0% 0)" }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.72, delay: prefersReducedMotion ? 0 : 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-5xl text-[clamp(3rem,8vw,7.5rem)] leading-[0.94] tracking-[-0.07em] text-[var(--text-primary)]"
            >
              Vamos conversar.
            </motion.h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg sm:leading-8">
              Estou aberto a oportunidades de estágio, colaborações e novos
              desafios em desenvolvimento de software.
            </p>
          </div>

          <div className="lg:col-span-4 lg:justify-self-end">
            <a
              href="mailto:mateusbueno54321@gmail.com"
              className="focus-state group inline-flex min-h-14 w-full items-center justify-between gap-6 border border-[var(--border-strong)] px-5 text-sm text-[var(--text-primary)] transition-colors hover:bg-[var(--accent-muted)] sm:w-auto sm:min-w-64"
            >
              <span className="inline-flex items-center gap-3">
                <Mail size={16} aria-hidden="true" />
                Escrever um e-mail
              </span>
              <ArrowUpRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>

        <div className="mt-12 grid gap-8 border-t border-[var(--border)] pt-6 sm:grid-cols-2 sm:items-end lg:mt-16">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Contato direto
            </p>
            <a
              href="mailto:mateusbueno54321@gmail.com"
              className="focus-state mt-3 inline-flex min-h-11 max-w-full items-center gap-3 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              <Mail size={14} aria-hidden="true" />
              <span className="break-all">mateusbueno54321@gmail.com</span>
            </a>
            <a
              href="tel:+5562996207144"
              className="focus-state flex min-h-11 items-center gap-3 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              <Phone size={14} aria-hidden="true" />
              (62) 99620-7144
            </a>
          </div>

          <div className="sm:justify-self-end">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Outros caminhos
            </p>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
              {contactLinks.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (abre em nova aba)`}
                    className="group focus-state inline-flex min-h-11 items-center gap-2 text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                  >
                    <Icon size={14} aria-hidden="true" />
                    {label}
                    <ArrowDownRight
                      size={12}
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
