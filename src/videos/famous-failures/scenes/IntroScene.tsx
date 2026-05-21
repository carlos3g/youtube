import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CenteredTitle } from "../../../shared/components/CenteredTitle";

type IntroSceneProps = {
  durationInFrames: number;
};

// Abertura do vídeo: o título "Falhas famosas" entra e some no fim da cena.
export const IntroScene: React.FC<IntroSceneProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <CenteredTitle text="Falhas famosas" />
    </AbsoluteFill>
  );
};
