import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../../../shared/constants";
import { fontFamily } from "../../../shared/font";
import { ENDING_QUOTE } from "../data";

type QuoteSceneProps = {
  durationInFrames: number;
};

// Cena final: a frase de efeito que fecha o vídeo.
export const QuoteScene: React.FC<QuoteSceneProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = interpolate(frame, [0, 1.2 * fps], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        opacity: exit,
        justifyContent: "center",
        alignItems: "center",
        padding: "0 220px",
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
          opacity: enter,
          transform: `scaleX(${enter})`,
        }}
      />

      {/* Frase final */}
      <p
        style={{
          fontFamily,
          fontStyle: "italic",
          fontSize: 84,
          fontWeight: 400,
          lineHeight: 1.32,
          color: COLORS.text,
          textAlign: "center",
          margin: 0,
          maxWidth: 1500,
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
        }}
      >
        {`“${ENDING_QUOTE}”`}
      </p>
    </AbsoluteFill>
  );
};
