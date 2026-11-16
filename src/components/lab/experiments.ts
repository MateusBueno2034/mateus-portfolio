export type ExperimentId =
  | "snake"
  | "tetris"
  | "pong"
  | "breakout"
  | "memory"
  | "typing"
  | "drawing";

export type Experiment = {
  id: ExperimentId;
  name: string;
  description: string;
  kind: "Jogo" | "Experimento";
  controls: string;
  accent: string;
};

export const experiments: Experiment[] = [
  {
    id: "snake",
    name: "Snake",
    description: "Guie a cobra, colete pontos e evite as bordas.",
    kind: "Jogo",
    controls: "Setas ou WASD",
    accent: "#9db69a",
  },
  {
    id: "tetris",
    name: "Tetris",
    description: "Encaixe as peças e complete linhas.",
    kind: "Jogo",
    controls: "Setas, X ou Espaço",
    accent: "#b4a1c8",
  },
  {
    id: "pong",
    name: "Pong",
    description: "Uma partida curta contra um oponente simples.",
    kind: "Jogo",
    controls: "W/S ou setas",
    accent: "#cb8b79",
  },
  {
    id: "breakout",
    name: "Breakout",
    description: "Rebata a bola e limpe os blocos.",
    kind: "Jogo",
    controls: "Setas, mouse ou toque",
    accent: "#c2a36f",
  },
  {
    id: "memory",
    name: "Memory",
    description: "Encontre os pares com o menor número de tentativas.",
    kind: "Jogo",
    controls: "Toque ou teclado",
    accent: "#899eaa",
  },
  {
    id: "typing",
    name: "Typing test",
    description: "Digite um trecho original e confira seu ritmo.",
    kind: "Experimento",
    controls: "Teclado",
    accent: "#9caeb0",
  },
  {
    id: "drawing",
    name: "Drawing canvas",
    description: "Um pequeno espaço para desenhar com mouse ou toque.",
    kind: "Experimento",
    controls: "Mouse ou toque",
    accent: "#bd91a9",
  },
];
