import { interpolate, useCurrentFrame } from "remotion";

type KenBurnsOptions = {
  // Duração da cena, em frames — o movimento se distribui por toda ela.
  durationInFrames: number;
  // Escala inicial e final do "zoom" lento.
  fromScale?: number;
  toScale?: number;
  // Deriva total, em pixels, ao longo da cena.
  driftX?: number;
  driftY?: number;
};

// Movimento de câmera lento (efeito Ken Burns). Devolve escala e deriva
// em função do frame atual, para serem combinadas com outras
// transformações da cena.
export const useKenBurns = ({
  durationInFrames,
  fromScale = 1,
  toScale = 1.05,
  driftX = 0,
  driftY = 0,
}: KenBurnsOptions): { scale: number; x: number; y: number } => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return {
    scale: interpolate(progress, [0, 1], [fromScale, toScale]),
    x: interpolate(progress, [0, 1], [0, driftX]),
    y: interpolate(progress, [0, 1], [0, driftY]),
  };
};
