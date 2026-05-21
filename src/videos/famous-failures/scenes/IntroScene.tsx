import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { SiteCredit } from "../../../shared/components/SiteCredit";
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
    <>
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

      {/* Crédito do autor — camada própria, fora do push-in da câmera. */}
      <SiteCredit durationInFrames={durationInFrames} />
    </>
  );
};
