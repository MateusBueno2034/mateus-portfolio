# Mateus Bueno — Portfólio

Portfólio pessoal de Mateus Henrique Bueno de Carvalho, estudante de Engenharia de Software e desenvolvedor front-end. O projeto apresenta trajetória, tecnologias, projetos, cursos e experimentos interativos em uma interface responsiva.

**Portfólio online:** <https://mateusbueno2034.github.io/mateus-portfolio/>

## Tecnologias

- React 18 e TypeScript
- Vite e Tailwind CSS
- Motion e GSAP
- Three.js, React Three Fiber e Drei
- Lucide React
- Web Audio API

## Funcionalidades

- Intro interativa com interação de pressionar e segurar.
- Cenas 3D compartilhadas entre as seções, com composições específicas para trajetória, tecnologias, projetos, Lab e cursos.
- Temas graphite e soft, cursor personalizado e iluminação atmosférica.
- Sistema de áudio procedural com controle pelo visitante.
- Interactive Lab com Snake, Tetris, Pong, Breakout, Memory, Typing Test e Drawing Canvas.
- Sistema de conquistas e navegação responsiva.
- Respeito a `prefers-reduced-motion` e fallback para ambientes sem WebGL.

## Seções

- **Sobre:** apresentação e trajetória de formação.
- **Tecnologias:** rede visual das tecnologias utilizadas.
- **Projetos:** Finora, SpeakUp, MesaFlow e SmokeHouse.
- **Interactive Lab:** sete jogos e experimentos executados em modal.
- **Cursos:** cursos e trilhas de formação contínua.
- **Contato:** links para comunicação e redes profissionais.

## Projetos

- **Finora:** gerenciador financeiro pessoal local-first com React, TypeScript, Tailwind CSS, Vite e LocalStorage.
- **SpeakUp:** plataforma para registro e acompanhamento de ocorrências urbanas.
- **MesaFlow:** MVP de uma plataforma SaaS para gestão de restaurantes e estabelecimentos alimentícios.
- **SmokeHouse:** landing page responsiva para uma hamburgueria artesanal fictícia.

## Desenvolvimento local

Requisitos: Node.js e npm.

```bash
npm install
npm run dev
```

O comando `npm run dev` inicia o servidor local. Para validar a aplicação em produção:

```bash
npm run typecheck
npm run build
```

## Scripts

- `npm run dev` — inicia o servidor de desenvolvimento.
- `npm run typecheck` — executa a verificação de tipos TypeScript.
- `npm run build` — gera a versão de produção.
- `npm run deploy` — publica o diretório `dist` no GitHub Pages.

## Estrutura

- `src/app` — composição principal da aplicação.
- `src/components` — seções, navegação, cenas 3D e Interactive Lab.
- `src/lib` — áudio, temas, conquistas, dados e utilitários.
- `src/styles` — estilos globais e temas.
- `public` — recursos públicos usados pelo portfólio.
