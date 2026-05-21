import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../constants";
import { fontFamily } from "../font";

type CenteredTitleProps = {
  text: string;
};

// Título centralizado com fade-in suave. Transparente — use dentro de <Background>.
export const CenteredTitle: React.FC<CenteredTitleProps> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Aparição suave: o título surge com fade-in e um leve deslize para cima.
  const progress = interpolate(frame, [0, fps], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <h1
        style={{
          fontFamily,
          fontSize: 138,
          fontWeight: 900,
          letterSpacing: -1,
          color: COLORS.text,
          textAlign: "center",
          margin: 0,
          padding: "0 120px",
          opacity: progress,
          transform: `translateY(${interpolate(progress, [0, 1], [40, 0])}px)`,
        }}
      >
        {text}
      </h1>
    </AbsoluteFill>
  );
};
