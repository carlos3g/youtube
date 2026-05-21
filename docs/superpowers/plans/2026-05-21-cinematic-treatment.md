# Cinematic Treatment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar acabamento cinematográfico ao vídeo "Falhas famosas" (camada de filme, movimento de câmera, transições, abertura e encerramento) sem mudar conteúdo, estrutura ou duração.

**Architecture:** Um componente `FilmLayer` envolve o vídeo inteiro e desenha grão, vinheta, grade de cor e barras de letterbox (incluindo o "iris out" final). Um hook `useKenBurns` gera o movimento de câmera lento. As três cenas existentes (`IntroScene`, `QuoteScene`, `PersonScene`) recebem ajustes pontuais de movimento e transição. Sem dependências novas.

**Tech Stack:** Remotion 4.0.463, React 19, TypeScript. Spec: `docs/superpowers/specs/2026-05-21-cinematic-treatment-design.md`.

**Verificação:** o projeto não tem framework de testes — a verificação de cada tarefa é `yarn typecheck` mais renders de still (`yarn still`) inspecionados visualmente. Os stills caem em `out/` (ignorado pelo git).

---

## File Structure

| Arquivo | Responsabilidade |
| --- | --- |
| `src/shared/hooks/useKenBurns.ts` | **Novo.** Hook puro: devolve `{ scale, x, y }` do movimento de câmera em função do frame. |
| `src/shared/components/FilmLayer.tsx` | **Novo.** Camada de filme global: grão, vinheta, grade de cor, letterbox (entrada e fechamento). |
| `src/videos/famous-failures/FamousFailures.tsx` | **Modificar.** Envolver o conteúdo no `FilmLayer`. |
| `src/videos/famous-failures/scenes/PersonScene.tsx` | **Modificar.** Ken Burns na foto, deriva no texto da falha, escala nas transições. |
| `src/videos/famous-failures/scenes/IntroScene.tsx` | **Modificar.** Revelação do título em dois tempos + push-in + filete. |
| `src/videos/famous-failures/scenes/QuoteScene.tsx` | **Modificar.** Frase final em dois tempos + push-in. |

`src/shared/components/CenteredTitle.tsx` deixa de ser usado pela `IntroScene`, mas permanece no repositório como primitivo compartilhado para vídeos futuros — não faz parte deste escopo removê-lo.

---

## Task 1: useKenBurns hook

**Files:**
- Create: `src/shared/hooks/useKenBurns.ts`

- [ ] **Step 1: Criar o hook**

Criar `src/shared/hooks/useKenBurns.ts` com o conteúdo exato:

```ts
import { interpolate, useCurrentFrame } from "remotion";

type KenBurnsOptions = {
  // Duração da cena, em frames — o movimento se distribui por toda ela.
  durationInFrames: number;
  // Escala inicial e final do "zoom" lento.
  fromScale?: number;
  toScale?: number;
  // Deriva total, em pixels, ao longo da cena.
  driftX?: number;
  driftY?: number;
};

// Movimento de câmera lento (efeito Ken Burns). Devolve escala e deriva
// em função do frame atual, para serem combinadas com outras
// transformações da cena.
export const useKenBurns = ({
  durationInFrames,
  fromScale = 1,
  toScale = 1.05,
  driftX = 0,
  driftY = 0,
}: KenBurnsOptions): { scale: number; x: number; y: number } => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return {
    scale: interpolate(progress, [0, 1], [fromScale, toScale]),
    x: interpolate(progress, [0, 1], [0, driftX]),
    y: interpolate(progress, [0, 1], [0, driftY]),
  };
};
```

- [ ] **Step 2: Rodar o typecheck**

Run: `yarn typecheck`
Expected: termina sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/shared/hooks/useKenBurns.ts
git commit -m "$(cat <<'EOF'
Add useKenBurns camera-motion hook

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: FilmLayer component

**Files:**
- Create: `src/shared/components/FilmLayer.tsx`
- Modify: `src/videos/famous-failures/FamousFailures.tsx`

- [ ] **Step 1: Criar o FilmLayer**

Criar `src/shared/components/FilmLayer.tsx` com o conteúdo exato:

```tsx
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { HEIGHT, WIDTH } from "../constants";

// Altura de cada barra de letterbox no corpo do vídeo (px, em 1080p).
const BAR_HEIGHT = 64;
// Frames da entrada das barras na abertura.
const BARS_IN = 16;
// Frames do fechamento das barras ("iris out") no fim.
const BARS_CLOSE = 30;

type FilmLayerProps = {
  children: React.ReactNode;
  // Duração total do vídeo — usada para fechar as barras no fim.
  totalDuration: number;
};

// Camada de filme aplicada sobre o vídeo inteiro: grade de cor, vinheta,
// grão e barras de letterbox (entram na abertura, fecham no encerramento).
export const FilmLayer: React.FC<FilmLayerProps> = ({
  children,
  totalDuration,
}) => {
  const frame = useCurrentFrame();

  // Altura das barras: entram na abertura, ficam fixas e fecham no fim.
  const barHeight = interpolate(
    frame,
    [0, BARS_IN, totalDuration - BARS_CLOSE, totalDuration],
    [0, BAR_HEIGHT, BAR_HEIGHT, HEIGHT / 2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Grão: a semente do ruído muda a cada frame para cintilar.
  const grainSeed = frame % 8;

  const bar: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    height: barHeight,
    background: "#000",
  };

  return (
    <AbsoluteFill>
      {children}

      {/* Grade de cor: leve esfriada nas sombras. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 42%, rgba(40,58,92,0.12) 0%, rgba(4,6,12,0.30) 100%)",
          mixBlendMode: "soft-light",
          pointerEvents: "none",
        }}
      />

      {/* Vinheta. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 46%, rgba(0,0,0,0.62) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Grão de filme. */}
      <AbsoluteFill
        style={{
          opacity: 0.07,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      >
        <svg width={WIDTH} height={HEIGHT}>
          <filter id="film-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves={2}
              seed={grainSeed}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width={WIDTH} height={HEIGHT} filter="url(#film-grain)" />
        </svg>
      </AbsoluteFill>

      {/* Letterbox. */}
      <div style={{ ...bar, top: 0 }} />
      <div style={{ ...bar, bottom: 0 }} />
    </AbsoluteFill>
  );
};
```

- [ ] **Step 2: Envolver o vídeo no FilmLayer**

Substituir o conteúdo inteiro de `src/videos/famous-failures/FamousFailures.tsx` por:

```tsx
import React from "react";
import { Audio, interpolate, Sequence, staticFile } from "remotion";
import { Background } from "../../shared/components/Background";
import { FilmLayer } from "../../shared/components/FilmLayer";
import { FPS } from "../../shared/constants";
import {
  FAILURES,
  INTRO_DURATION,
  PERSON_DURATION,
  QUOTE_DURATION,
  TOTAL_DURATION,
} from "./data";
import { IntroScene } from "./scenes/IntroScene";
import { PersonScene } from "./scenes/PersonScene";
import { QuoteScene } from "./scenes/QuoteScene";

// Vídeo: "Falhas famosas"
// Recriação (sem narração) do vídeo "Famous Failures", do canal RubixSpark.
// Estrutura: abertura -> 11 pessoas (falha -> nome) -> frase final.
// Tudo é envolvido pela camada de filme (grão, vinheta, letterbox).
export const FamousFailures: React.FC = () => {
  const peopleStart = INTRO_DURATION;
  const quoteStart = peopleStart + FAILURES.length * PERSON_DURATION;

  return (
    <FilmLayer totalDuration={TOTAL_DURATION}>
      <Background>
        {/* Trilha de fundo: fade-in na abertura e fade-out no fim. */}
        <Audio
          src={staticFile("famous-failures/music.mp3")}
          volume={(f) =>
            interpolate(f, [0, 1.5 * FPS], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }) *
            interpolate(
              f,
              [TOTAL_DURATION - 2.5 * FPS, TOTAL_DURATION],
              [1, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            ) *
            0.55
          }
        />

        <Sequence durationInFrames={INTRO_DURATION}>
          <IntroScene durationInFrames={INTRO_DURATION} />
        </Sequence>

        {FAILURES.map((entry, index) => (
          <Sequence
            key={entry.name}
            from={peopleStart + index * PERSON_DURATION}
            durationInFrames={PERSON_DURATION}
          >
            <PersonScene
              name={entry.name}
              failure={entry.failure}
              photo={entry.photo}
              facts={entry.facts}
              durationInFrames={PERSON_DURATION}
            />
          </Sequence>
        ))}

        <Sequence from={quoteStart} durationInFrames={QUOTE_DURATION}>
          <QuoteScene durationInFrames={QUOTE_DURATION} />
        </Sequence>
      </Background>
    </FilmLayer>
  );
};
```

- [ ] **Step 3: Rodar o typecheck**

Run: `yarn typecheck`
Expected: termina sem erros.

- [ ] **Step 4: Render de still para conferir a camada de filme**

Run: `yarn still FamousFailures out/check-film-intro.png --frame=45`
Run: `yarn still FamousFailures out/check-film-person.png --frame=380`
Expected: ambos os arquivos são criados.
Abrir os dois PNGs e confirmar: barras pretas finas em cima e embaixo, vinheta escurecendo os cantos e uma textura de grão muito sutil sobre a imagem. Nada deve estar lavado nem com ruído gritante.

- [ ] **Step 5: Commit**

```bash
git add src/shared/components/FilmLayer.tsx src/videos/famous-failures/FamousFailures.tsx
git commit -m "$(cat <<'EOF'
Add cinematic film layer over the whole video

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Camera motion and transitions in PersonScene

**Files:**
- Modify: `src/videos/famous-failures/scenes/PersonScene.tsx`

- [ ] **Step 1: Reescrever a PersonScene**

Substituir o conteúdo inteiro de `src/videos/famous-failures/scenes/PersonScene.tsx` por:

```tsx
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../../../shared/constants";
import { fontFamily } from "../../../shared/font";
import { useKenBurns } from "../../../shared/hooks/useKenBurns";
import type { Fact as FactType } from "../data";
import { Fact } from "./Fact";

type PersonSceneProps = {
  name: string;
  failure: string;
  photo: string;
  facts: FactType[];
  durationInFrames: number;
};

// Cena de uma pessoa: mostra a falha; depois a falha sobe e dá lugar
// à foto (sem fundo), ao nome e às conquistas nas laterais.
export const PersonScene: React.FC<PersonSceneProps> = ({
  name,
  failure,
  photo,
  facts,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Movimento de câmera lento aplicado à foto ao longo de toda a cena.
  const ken = useKenBurns({
    durationInFrames,
    fromScale: 1,
    toScale: 1.05,
    driftY: -20,
  });

  // Entrada do texto da falha.
  const enter = interpolate(frame, [0, fps], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Revelação, por volta dos 7,2 s.
  const revealAt = Math.round(7.2 * fps);
  const reveal = interpolate(frame, [revealAt, revealAt + fps], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pop = interpolate(frame, [revealAt, revealAt + 32], [0, 1], {
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Entrada escalonada de cada conquista.
  const factProgress = (i: number) =>
    interpolate(
      frame,
      [revealAt + 10 + i * 5, revealAt + 10 + i * 5 + 24],
      [0, 1],
      {
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    );

  // Deriva lenta do texto da falha enquanto ele está em cena.
  const failureDrift = interpolate(frame, [0, revealAt], [0, -18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Saída da cena inteira (opacidade).
  const exit = interpolate(
    frame,
    [durationInFrames - 22, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Transição: a cena entra avançando de leve e sai recuando de leve.
  const enterScale = interpolate(frame, [0, fps], [1.03, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitScale = interpolate(
    frame,
    [durationInFrames - 22, durationInFrames],
    [1, 0.98],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const left = facts.slice(0, 2);
  const right = facts.slice(2, 4);

  const sideColumn: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: 360,
    height: 430,
  };

  return (
    <>
      {/* Efeito sonoro disparado na revelação. */}
      <Sequence from={revealAt} layout="none">
        <Audio src={staticFile("sfx/whoosh.wav")} volume={0.6} />
      </Sequence>

      <AbsoluteFill
        style={{
          opacity: exit,
          transform: `scale(${enterScale * exitScale})`,
        }}
      >
        {/* Falha — centralizada; ao revelar, encolhe e sobe. */}
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 200px",
            opacity: enter * interpolate(reveal, [0, 1], [1, 0.5]),
            transform: `translateY(${interpolate(
              reveal,
              [0, 1],
              [0, -340],
            )}px) scale(${interpolate(reveal, [0, 1], [1, 0.62])})`,
          }}
        >
          <p
            style={{
              fontFamily,
              fontSize: 58,
              fontWeight: 400,
              lineHeight: 1.4,
              color: COLORS.text,
              textAlign: "center",
              margin: 0,
              maxWidth: 1400,
              transform: `translateY(${
                interpolate(enter, [0, 1], [30, 0]) + failureDrift
              }px)`,
            }}
          >
            {failure}
          </p>
        </AbsoluteFill>

        {/* Foto + conquistas + nome — aparecem na revelação. */}
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 130,
            opacity: reveal,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
            {/* Conquistas à esquerda */}
            <div style={sideColumn}>
              {left.map((fact, i) => (
                <Fact
                  key={fact.label}
                  icon={fact.icon}
                  label={fact.label}
                  progress={factProgress(i)}
                  fromLeft
                />
              ))}
            </div>

            {/* Foto */}
            <Img
              src={staticFile(photo)}
              style={{
                maxHeight: 560,
                maxWidth: 600,
                objectFit: "contain",
                filter:
                  "grayscale(1) contrast(1.1) brightness(1.07) drop-shadow(0 22px 44px rgba(0,0,0,0.6))",
                WebkitMaskImage:
                  "linear-gradient(to bottom, #000 70%, transparent 100%)",
                maskImage:
                  "linear-gradient(to bottom, #000 70%, transparent 100%)",
                transform: `translateY(${
                  interpolate(pop, [0, 1], [36, 0]) + ken.y
                }px) scale(${interpolate(pop, [0, 1], [0.94, 1]) * ken.scale})`,
              }}
            />

            {/* Conquistas à direita */}
            <div style={{ ...sideColumn, alignItems: "flex-start" }}>
              {right.map((fact, i) => (
                <Fact
                  key={fact.label}
                  icon={fact.icon}
                  label={fact.label}
                  progress={factProgress(i + 2)}
                  fromLeft={false}
                />
              ))}
            </div>
          </div>

          {/* Nome revelado */}
          <div
            style={{
              fontFamily,
              fontSize: 90,
              fontWeight: 900,
              letterSpacing: -1,
              color: COLORS.text,
              textAlign: "center",
              marginTop: -56,
              transform: `translateY(${interpolate(pop, [0, 1], [20, 0])}px)`,
            }}
          >
            {name}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </>
  );
};
```

Mudanças em relação ao arquivo atual: importa e usa `useKenBurns` (escala/deriva da foto), adiciona `failureDrift` (deriva do texto da falha), adiciona `enterScale`/`exitScale` e os aplica como `transform: scale(...)` no `AbsoluteFill` externo.

- [ ] **Step 2: Rodar o typecheck**

Run: `yarn typecheck`
Expected: termina sem erros.

- [ ] **Step 3: Render de still para conferir o movimento**

Run: `yarn still FamousFailures out/check-person-reveal.png --frame=380`
Run: `yarn still FamousFailures out/check-person-late.png --frame=495`
Run: `yarn still FamousFailures out/check-transition.png --frame=505`
Expected: os três arquivos são criados.
Abrir e confirmar: no frame 380 a revelação (foto + nome + conquistas) está completa; no frame 495 a foto está visivelmente um pouco maior (Ken Burns); no frame 505 a cena está levemente menor e esmaecida (transição de saída). Sem cortes nem texto vazando das bordas.

- [ ] **Step 4: Commit**

```bash
git add src/videos/famous-failures/scenes/PersonScene.tsx
git commit -m "$(cat <<'EOF'
Add camera motion and scaled transitions to person scenes

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Recreate the intro

**Files:**
- Modify: `src/videos/famous-failures/scenes/IntroScene.tsx`

- [ ] **Step 1: Reescrever a IntroScene**

Substituir o conteúdo inteiro de `src/videos/famous-failures/scenes/IntroScene.tsx` por:

```tsx
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../../../shared/constants";
import { fontFamily } from "../../../shared/font";

type IntroSceneProps = {
  durationInFrames: number;
};

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

// Abertura do vídeo: o título "Falhas famosas" é revelado em dois tempos,
// com push-in lento de câmera e um filete que se desenha.
export const IntroScene: React.FC<IntroSceneProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  // Revelação de cada palavra (fade + subida).
  const word = (start: number) =>
    interpolate(frame, [start, start + 20], [0, 1], {
      easing: EASE_OUT,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const w1 = word(8);
  const w2 = word(22);

  // Filete vermelho que se desenha.
  const rule = interpolate(frame, [30, 50], [0, 1], {
    easing: EASE_OUT,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Push-in lento da "câmera".
  const pushIn = interpolate(frame, [0, 78], [1.06, 1], {
    easing: Easing.out(Easing.ease),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Saída no fim da cena (fade + leve recuo).
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const exitScale = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0.98],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const wordStyle: React.CSSProperties = {
    fontFamily,
    fontSize: 138,
    fontWeight: 900,
    letterSpacing: -2,
    lineHeight: 1,
    color: COLORS.text,
    textAlign: "center",
    margin: 0,
  };

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
        transform: `scale(${pushIn * exitScale})`,
      }}
    >
      <h1
        style={{
          ...wordStyle,
          opacity: w1,
          transform: `translateY(${interpolate(w1, [0, 1], [28, 0])}px)`,
        }}
      >
        Falhas
      </h1>
      <h1
        style={{
          ...wordStyle,
          opacity: w2,
          transform: `translateY(${interpolate(w2, [0, 1], [28, 0])}px)`,
        }}
      >
        famosas
      </h1>
      <div
        style={{
          width: 84,
          height: 3,
          marginTop: 30,
          borderRadius: 2,
          background: COLORS.accent,
          opacity: rule,
          transform: `scaleX(${rule})`,
        }}
      />
    </AbsoluteFill>
  );
};
```

Observação: a `IntroScene` deixa de importar/usar `CenteredTitle`. O arquivo `CenteredTitle.tsx` permanece no repositório.

- [ ] **Step 2: Rodar o typecheck**

Run: `yarn typecheck`
Expected: termina sem erros.

- [ ] **Step 3: Render de still da abertura**

Run: `yarn still FamousFailures out/check-intro.png --frame=55`
Expected: o arquivo é criado.
Abrir e confirmar: as duas palavras "Falhas" e "famosas" empilhadas e visíveis, o filete vermelho desenhado abaixo, dentro das barras de letterbox, sem cortes.

- [ ] **Step 4: Commit**

```bash
git add src/videos/famous-failures/scenes/IntroScene.tsx
git commit -m "$(cat <<'EOF'
Recreate the intro with a cinematic title reveal

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Recreate the ending

**Files:**
- Modify: `src/videos/famous-failures/scenes/QuoteScene.tsx`

- [ ] **Step 1: Reescrever a QuoteScene**

Substituir o conteúdo inteiro de `src/videos/famous-failures/scenes/QuoteScene.tsx` por:

```tsx
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../../../shared/constants";
import { fontFamily } from "../../../shared/font";
import { ENDING_QUOTE } from "../data";

type QuoteSceneProps = {
  durationInFrames: number;
};

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

// Cena final: a frase de efeito que fecha o vídeo, revelada em dois
// tempos com push-in lento. O fechamento das barras de letterbox
// ("iris out") é feito pelo FilmLayer.
export const QuoteScene: React.FC<QuoteSceneProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  // A frase é dividida em duas partes pela vírgula, para revelar em dois tempos.
  const [partA, partB] = ENDING_QUOTE.split(", ");

  const reveal = (start: number, end: number) =>
    interpolate(frame, [start, end], [0, 1], {
      easing: EASE_OUT,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const rule = reveal(0, 18);
  const lineA = reveal(10, 38);
  const lineB = reveal(34, 64);

  // Push-in lento da "câmera".
  const pushIn = interpolate(frame, [0, 140], [1.05, 1], {
    easing: Easing.out(Easing.ease),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const exit = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const lineStyle: React.CSSProperties = {
    fontFamily,
    fontStyle: "italic",
    fontSize: 84,
    fontWeight: 400,
    lineHeight: 1.32,
    color: COLORS.text,
    textAlign: "center",
    margin: 0,
    maxWidth: 1500,
  };

  return (
    <AbsoluteFill
      style={{
        opacity: exit,
        justifyContent: "center",
        alignItems: "center",
        padding: "0 220px",
        transform: `scale(${pushIn})`,
      }}
    >
      {/* Filete decorativo */}
      <div
        style={{
          width: 70,
          height: 3,
          marginBottom: 56,
          borderRadius: 2,
          background: COLORS.accent,
          opacity: rule,
          transform: `scaleX(${rule})`,
        }}
      />

      {/* Frase final, revelada em dois tempos */}
      <p
        style={{
          ...lineStyle,
          opacity: lineA,
          transform: `translateY(${interpolate(lineA, [0, 1], [28, 0])}px)`,
        }}
      >
        {`“${partA},`}
      </p>
      <p
        style={{
          ...lineStyle,
          opacity: lineB,
          transform: `translateY(${interpolate(lineB, [0, 1], [28, 0])}px)`,
        }}
      >
        {`${partB}”`}
      </p>
    </AbsoluteFill>
  );
};
```

Observação: `ENDING_QUOTE` contém exatamente uma vírgula seguida de espaço, então `split(", ")` devolve as duas partes da frase.

- [ ] **Step 2: Rodar o typecheck**

Run: `yarn typecheck`
Expected: termina sem erros.

- [ ] **Step 3: Render de still do encerramento**

Run: `yarn still FamousFailures out/check-ending.png --frame=4790`
Run: `yarn still FamousFailures out/check-irisout.png --frame=5032`
Expected: os dois arquivos são criados.
Abrir e confirmar: no frame 4790 as duas linhas da frase estão visíveis com o filete acima; no frame 5032 as barras de letterbox estão bem mais grossas, quase fechando a tela (efeito "iris out").

- [ ] **Step 4: Commit**

```bash
git add src/videos/famous-failures/scenes/QuoteScene.tsx
git commit -m "$(cat <<'EOF'
Recreate the ending with a two-tempo quote reveal

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Full render and verification

**Files:** nenhum arquivo de código alterado.

- [ ] **Step 1: Typecheck final**

Run: `yarn typecheck`
Expected: termina sem erros.

- [ ] **Step 2: Render completo do vídeo**

Run: `yarn render FamousFailures out/falhas-famosas.mp4`
Expected: o render conclui sem erros e gera `out/falhas-famosas.mp4` com 5040 frames (2:48).

- [ ] **Step 3: Conferir que nenhum mp4 entrou no git**

Run: `git status --short`
Expected: `out/` e `*.mp4` não aparecem (estão no `.gitignore`). Nenhum arquivo `.mp4` deve estar para commit.

- [ ] **Step 4: Assistir ao vídeo renderizado**

Abrir `out/falhas-famosas.mp4` e confirmar o conjunto:
- Abertura: título em dois tempos, push-in, barras entrando.
- 11 pessoas: revelações com Ken Burns na foto e transições suaves entre cenas.
- Encerramento: frase em dois tempos e barras fechando no fim.
- A camada de filme (grão/vinheta) é perceptível como textura, não como distração.

- [ ] **Step 5: Push para a main**

```bash
git push origin main
```

---

## Self-Review

**Spec coverage:**
- Peça 1 (camada de filme) → Task 2. Fechamento das barras no encerramento → Task 2 (lógica de `barHeight`).
- Peça 2 (movimento de câmera) → Task 1 (hook) + Task 3 (uso na foto e no texto).
- Peça 3 (transições com escala) → Task 3 (`enterScale`/`exitScale`).
- Peça 4 (abertura) → Task 4.
- Peça 5 (encerramento) → Task 5.
- Critério "duração 5040 frames" → Task 6, Step 2.
- Critério "nenhum mp4 versionado" → Task 6, Step 3.

**Placeholder scan:** sem TBD/TODO; todo passo de código mostra o código completo.

**Type consistency:** `useKenBurns` devolve `{ scale, x, y }` (Task 1) e é consumido como `ken.scale`/`ken.y` na Task 3. `FilmLayer` recebe `children` e `totalDuration` (Task 2) e é usado com esses dois props na Task 2, Step 2. Sem divergências.
