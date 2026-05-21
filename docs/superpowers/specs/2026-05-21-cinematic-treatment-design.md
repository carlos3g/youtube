# Design — Tratamento cinematográfico do "Falhas famosas"

**Data:** 2026-05-21
**Status:** Aprovado
**Vídeo:** `src/videos/famous-failures/`

## Contexto

O vídeo "Falhas famosas" já está completo: abertura, 11 pessoas (falha → revelação
com foto, nome e 4 conquistas) e frase final. Funciona, mas tem cara de "app", não
de filme. Esta rodada dá um acabamento cinematográfico ao que já existe.

## Objetivo

Tornar o vídeo cinematográfico **sem mudar seu conteúdo nem sua estrutura**. É um
tratamento visual, não uma nova versão do vídeo.

## Escopo

**Dentro:**
- Camada de filme global (grão, vinheta, letterbox, grade de cor sutil).
- Movimento de câmera (Ken Burns) nas fotos e no texto da falha.
- Transições entre cenas com escala.
- Abertura e encerramento recriados (tratamento, mesma duração).

**Fora:**
- Nenhuma pessoa, falha, conquista ou frase nova.
- Nenhuma mudança de duração — total continua 2:48 (5040 frames).
- Nenhuma dependência nova (tudo com `interpolate` e SVG).
- Sem recoreografar a revelação nem adicionar cartões de capítulo.

## Direção visual

**A · Frio noturno** — refina a identidade atual: fundo azul-escuro de madrugada,
acento vermelho (`COLORS.accent`). O tratamento é puro acabamento; nenhuma decisão
de cor é reaberta.

## As cinco peças

### 1. Camada de filme (global)

Um componente novo `FilmLayer` que envolve o vídeo inteiro. Ordem das camadas, de
baixo para cima: conteúdo do vídeo → grade de cor → vinheta → grão → letterbox.

- **Grão:** ruído via SVG `feTurbulence`, com `seed` variando por frame para
  cintilar. Opacidade ~6%, `mix-blend-mode: overlay`. Textura sutil, nunca ruído
  perceptível.
- **Vinheta:** `radial-gradient` transparente no centro → escuro nos cantos.
  Reforça o foco no centro do quadro.
- **Letterbox:** barras pretas em cima e embaixo, ~6% da altura cada (~64px em
  1080p). A altura é função do frame:
  - Abertura: deslizam para dentro nos primeiros ~15 frames.
  - Corpo do vídeo: permanecem fixas.
  - Encerramento: crescem até cobrir a tela (ver peça 5).
- **Grade de cor:** sombras levemente levantadas + contraste suave, mantendo o
  azul-noturno. Aplicada como overlay sutil.

### 2. Movimento de câmera (Ken Burns)

Um hook utilitário `useKenBurns` que devolve um `transform` (escala + deriva) em
função do frame atual e da duração da cena.

- **Foto de cada pessoa:** escala lenta de 1.0 → ~1.05 ao longo da cena, com leve
  deriva vertical.
- **Texto da falha:** além da entrada já existente, uma deriva mínima enquanto
  está na tela, para não parecer congelado.
- Regra: o movimento é sempre lento e contínuo — deve ser sentido, não notado.

### 3. Transições entre cenas

O fade de opacidade puro ganha **escala**: cada cena entra de um leve avanço
(scale 1.03 → 1.0) e sai recuando de leve (scale 1.0 → 0.98), cruzando pelo fundo
contínuo. Passagem com intenção, sem tempo morto. As `<Sequence>` continuam
adjacentes (sem sobreposição) — a deriva de escala é aplicada nas animações de
entrada/saída já existentes em cada cena.

### 4. Abertura

Mesmo título "Falhas famosas", com entrada cinematográfica, nos mesmos 3 segundos:

1. As barras de letterbox deslizam para dentro (peça 1).
2. "Falhas" sobe e aparece.
3. Batida curta.
4. "famosas" sobe e aparece.
5. O filete vermelho se desenha (scaleX 0 → 1).
6. Todo o título dá um *push-in* lento (scale ~1.08 → 1.0).

### 5. Encerramento

A frase final ganha o mesmo tratamento, nos mesmos 11 segundos:

- Entra em dois tempos, com *push-in* lento.
- No fim, as barras de letterbox **fecham** (crescem até o preto) — um "iris out"
  de fim de filme, com o grão persistindo no escuro.

## Arquitetura

| Arquivo | Mudança |
| --- | --- |
| `src/shared/components/FilmLayer.tsx` | **Novo.** Grão + vinheta + letterbox + grade. Recebe `children` e `totalDuration`. |
| `src/shared/hooks/useKenBurns.ts` | **Novo.** Hook que devolve `transform` de escala/deriva em função do frame. |
| `src/videos/famous-failures/FamousFailures.tsx` | Envolver o conteúdo no `FilmLayer`. |
| `src/videos/famous-failures/scenes/IntroScene.tsx` | Revelação do título em dois tempos + push-in + filete. |
| `src/videos/famous-failures/scenes/QuoteScene.tsx` | Entrada em dois tempos + push-in (o fechamento das barras vem do `FilmLayer`). |
| `src/videos/famous-failures/scenes/PersonScene.tsx` | Ken Burns na foto e no texto; escala nas animações de entrada/saída. |

Sem dependências novas. O grão usa SVG inline; o resto usa `interpolate`/`Easing`.

## Critérios de sucesso

- `yarn typecheck` passa.
- Renders de still (abertura, uma revelação, encerramento) mostram grão, vinheta e
  letterbox aplicados, sem artefatos.
- Duração total continua 5040 frames (2:48).
- O movimento é perceptível como "vida", não como distração.
- O vídeo continua reconhecível como o mesmo "Falhas famosas" — é acabamento.

## Decisões registradas

- **Clima de cor:** A · Frio noturno (continuidade com o vídeo atual).
- **Transições:** cross-dissolve com escala (não dip-to-black) — mantém o ritmo.
- **Sem conteúdo novo:** intro/encerramento são tratamento do que já existe.
