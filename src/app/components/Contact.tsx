import { motion } from "motion/react";
import { Phone, Mail, MessageCircle, Github, Linkedin } from "lucide-react";
import { SectionHeader } from "./About";

export function Contact() {
  return (
    <section id="contato" className="relative py-28 px-6 lg:px-10">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/[0.05] to-transparent pointer-events-none" />
      <div className="max-w-5xl mx-auto relative">
        <SectionHeader
          eyebrow="05 / Contato"
          title="Vamos construir algo juntos?"
          description="Estou aberto a oportunidades de estágio, colaborações e novos desafios em desenvolvimento de software."
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-blue-950/10 to-transparent backdrop-blur-md p-8 sm:p-12"
        >
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <ContactItem
              icon={Phone}
              label="Telefone"
              value="(62) 99620-7144"
              href="tel:+5562996207144"
            />
            <ContactItem
              icon={Mail}
              label="E-mail"
              value="mateusbueno54321@gmail.com"
              href="mailto:mateusbueno54321@gmail.com"
            />
          </div>

          <div className="border-t border-white/5 pt-8">
            <div className="text-xs text-zinc-500 mb-4 tracking-wider uppercase">
              Conecte-se
            </div>
            <div className="flex flex-wrap gap-3">
              <SocialButton
                icon={MessageCircle}
                label="WhatsApp"
                href="https://wa.me/5562996207144"
                color="from-emerald-600/80 to-emerald-800/80"
                border="border-emerald-500/30"
              />
              <SocialButton
                icon={Github}
                label="GitHub"
                href="https://github.com/MateusBueno2034"
                color="from-zinc-700/80 to-zinc-900/80"
                border="border-white/10"
              />
              <SocialButton
                icon={Linkedin}
                label="LinkedIn"
                href="https://www.linkedin.com/in/mateus-henrique-bueno-de-carvalho-598a2539b/"
                color="from-blue-700/80 to-blue-900/80"
                border="border-blue-500/30"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ContactItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.05] hover:border-white/20 transition"
    >
      <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-blue-300" />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-zinc-500">{label}</div>
        <div className="text-sm text-zinc-200 truncate group-hover:text-white transition">
          {value}
        </div>
      </div>
    </a>
  );
}

function SocialButton({
  icon: Icon,
  label,
  href,
  color,
  border,
}: {
  icon: typeof Github;
  label: string;
  href: string;
  color: string;
  border: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${label}`}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-b ${color} ${border} border text-white text-sm hover:scale-[1.08] hover:shadow-xl hover:shadow-white/10 transition-all duration-300`}
    >
      <Icon size={15} className="group-hover:animate-pulse" />
      {label}
    </a>
  );
}
