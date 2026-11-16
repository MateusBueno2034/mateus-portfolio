export type ProjectReference = {
  name: string;
  number: string;
};

export type Technology = {
  name: string;
  category: string;
  description: string;
  projects: ProjectReference[];
};

const projects = {
  finora: { name: "Finora", number: "01" },
  speakUp: { name: "SpeakUp", number: "02" },
  mesaFlow: { name: "MesaFlow", number: "03" },
  smokehouse: { name: "Smokehouse Landing Page", number: "04" },
} satisfies Record<string, ProjectReference>;

export const technologies: Technology[] = [
  { name: "React", category: "Interfaces", description: "Biblioteca usada na construção das interfaces de Finora, SpeakUp e MesaFlow.", projects: [projects.finora, projects.speakUp, projects.mesaFlow] },
  { name: "TypeScript", category: "Linguagem", description: "Linguagem presente nas interfaces e regras de aplicação de Finora, SpeakUp e MesaFlow.", projects: [projects.finora, projects.speakUp, projects.mesaFlow] },
  { name: "JavaScript", category: "Interação", description: "Usado nas interações da landing page Smokehouse e também listado na stack de SpeakUp.", projects: [projects.speakUp, projects.smokehouse] },
  { name: "HTML", category: "Estrutura", description: "Base da estrutura das páginas, presente em Smokehouse e na stack de SpeakUp.", projects: [projects.speakUp, projects.smokehouse] },
  { name: "CSS", category: "Estilo", description: "Usado para compor a apresentação visual e responsiva de Smokehouse e SpeakUp.", projects: [projects.speakUp, projects.smokehouse] },
  { name: "Tailwind CSS", category: "Estilo", description: "Framework de estilos listado nas stacks de Finora, SpeakUp e MesaFlow.", projects: [projects.finora, projects.speakUp, projects.mesaFlow] },
  { name: "Vite", category: "Desenvolvimento", description: "Ferramenta de desenvolvimento e build listada em Finora, SpeakUp e MesaFlow.", projects: [projects.finora, projects.speakUp, projects.mesaFlow] },
  { name: "shadcn/ui", category: "Componentes", description: "Biblioteca de componentes listada na stack de SpeakUp.", projects: [projects.speakUp] },
  { name: "LocalStorage", category: "Persistência", description: "Usado por Finora para persistir os dados localmente no navegador.", projects: [projects.finora] },
  { name: "jQuery", category: "Interação", description: "Tecnologia listada na stack da landing page Smokehouse.", projects: [projects.smokehouse] },
  { name: "ScrollReveal", category: "Animação", description: "Tecnologia listada na stack da landing page Smokehouse.", projects: [projects.smokehouse] },
  { name: "Node.js", category: "Ambiente de execução", description: "Ambiente de execução JavaScript para estudos e desenvolvimento de aplicações Back-End.", projects: [] },
  { name: "Python", category: "Linguagem", description: "Linguagem de programação presente na formação e nos estudos de desenvolvimento de software.", projects: [] },
  { name: "SQL", category: "Linguagem de consulta", description: "Linguagem usada no MesaFlow para consultas, manipulação de dados e operações protegidas no banco.", projects: [projects.mesaFlow] },
  { name: "PostgreSQL", category: "Banco de dados", description: "Banco de dados relacional utilizado pelo MesaFlow, incluindo relacionamentos, JOINs, migrations e políticas de acesso.", projects: [projects.mesaFlow] },
  { name: "Supabase", category: "Plataforma", description: "Plataforma utilizada no MesaFlow para os serviços de dados, autenticação e regras protegidas com RLS, policies e funções SQL/RPC.", projects: [projects.mesaFlow] },
  { name: "Docker", category: "Infraestrutura", description: "Ferramenta de infraestrutura e conteinerização utilizada para executar serviços do Supabase no ambiente local.", projects: [projects.mesaFlow] },
];
