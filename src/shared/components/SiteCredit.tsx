import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { COLORS } from "../constants";
import { fontFamily } from "../font";

type SiteCreditProps = {
  // Duração da cena onde o crédito aparece, em frames.
  durationInFrames: number;
};

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

// Crédito discreto do autor no rodapé. Entra subindo e sai descendo,
// em cinza apagado — é só um detalhe, não disputa a atenção.
export const SiteCredit: React.FC<SiteCreditProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  // Entrada: surge no começo da cena.
  const enter = interpolate(frame, [24, 44], [0, 1], {
    easing: EASE_OUT,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Saída: some perto do fim da cena.
  const exit = interpolate(
    frame,
    [durationInFrames - 26, durationInFrames - 6],
    [1, 0],
    {
      easing: EASE_OUT,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const progress = enter * exit;
  // Sobe para entrar (de +26px até a posição de repouso) e
  // desce para sair (de volta a +26px).
  const offsetY = interpolate(progress, [0, 1], [26, 0]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 104,
      }}
    >
      <span
        style={{
          fontFamily,
          fontSize: 26,
          fontWeight: 400,
          letterSpacing: 1.5,
          color: COLORS.muted,
          opacity: progress * 0.5,
          transform: `translateY(${offsetY}px)`,
        }}
      >
        https://carlos3g.dev
      </span>
    </AbsoluteFill>
  );
};
