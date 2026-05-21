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
