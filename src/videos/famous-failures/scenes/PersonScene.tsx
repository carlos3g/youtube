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

  // Saída da cena inteira.
  const exit = interpolate(
    frame,
    [durationInFrames - 22, durationInFrames],
    [1, 0],
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

      <AbsoluteFill style={{ opacity: exit }}>
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
              transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
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
                transform: `translateY(${interpolate(
                  pop,
                  [0, 1],
                  [36, 0],
                )}px) scale(${interpolate(pop, [0, 1], [0.94, 1])})`,
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
