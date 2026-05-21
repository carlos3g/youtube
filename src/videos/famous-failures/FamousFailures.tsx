import React from "react";
import { Audio, interpolate, Sequence, staticFile } from "remotion";
import { Background } from "../../shared/components/Background";
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
export const FamousFailures: React.FC = () => {
  const peopleStart = INTRO_DURATION;
  const quoteStart = peopleStart + FAILURES.length * PERSON_DURATION;

  return (
    <Background>
      {/* Trilha de fundo: fade-in na abertura e fade-out no fim. */}
      <Audio
        src={staticFile("famous-failures/music.mp3")}
        volume={(f) =>
          interpolate(f, [0, 1.5 * FPS], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }) *
          interpolate(f, [TOTAL_DURATION - 2.5 * FPS, TOTAL_DURATION], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }) *
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
            durationInFrames={PERSON_DURATION}
          />
        </Sequence>
      ))}

      <Sequence from={quoteStart} durationInFrames={QUOTE_DURATION}>
        <QuoteScene durationInFrames={QUOTE_DURATION} />
      </Sequence>
    </Background>
  );
};
