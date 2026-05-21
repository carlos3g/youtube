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
        {`"${partA},`}
      </p>
      <p
        style={{
          ...lineStyle,
          opacity: lineB,
          transform: `translateY(${interpolate(lineB, [0, 1], [28, 0])}px)`,
        }}
      >
        {`${partB}"`}
      </p>
    </AbsoluteFill>
  );
};
