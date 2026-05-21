import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../../../shared/constants";
import { fontFamily } from "../../../shared/font";

type PersonSceneProps = {
  name: string;
  failure: string;
  durationInFrames: number;
};

// Cena de uma pessoa: primeiro mostra a falha, depois revela o nome.
export const PersonScene: React.FC<PersonSceneProps> = ({
  name,
  failure,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrada do texto da falha.
  const enter = interpolate(frame, [0, fps], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Revelação do nome, por volta dos 7,2 s.
  const revealAt = Math.round(7.2 * fps);
  const reveal = interpolate(frame, [revealAt, revealAt + fps], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pop = interpolate(frame, [revealAt, revealAt + 30], [0, 1], {
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Saída da cena inteira.
  const exit = interpolate(
    frame,
    [durationInFrames - 22, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <>
      {/* Efeito sonoro disparado na revelação do nome. */}
      <Sequence from={revealAt} layout="none">
        <Audio src={staticFile("sfx/whoosh.wav")} volume={0.6} />
      </Sequence>

      <AbsoluteFill
        style={{
          opacity: exit,
          justifyContent: "center",
          alignItems: "center",
          padding: "0 200px",
        }}
      >
        {/* Texto da falha */}
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
            opacity: enter * (1 - reveal * 0.5),
            transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
          }}
        >
          {failure}
        </p>

        {/* Divisor que cresce na revelação */}
        <div
          style={{
            width: 90,
            height: 4,
            marginTop: 56,
            marginBottom: 46,
            borderRadius: 2,
            background: COLORS.accent,
            opacity: reveal,
            transform: `scaleX(${reveal})`,
          }}
        />

        {/* Nome revelado */}
        <div
          style={{
            fontFamily,
            fontSize: 120,
            fontWeight: 900,
            letterSpacing: -1,
            color: COLORS.text,
            textAlign: "center",
            opacity: reveal,
            transform: `translateY(${interpolate(pop, [0, 1], [26, 0])}px) scale(${interpolate(
              pop,
              [0, 1],
              [0.92, 1],
            )})`,
          }}
        >
          {name}
        </div>
      </AbsoluteFill>
    </>
  );
};
