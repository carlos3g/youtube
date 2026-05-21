import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../constants";

type BackgroundProps = {
  children?: React.ReactNode;
};

// Fundo padrão dos vídeos do canal: gradiente radial escuro.
export const Background: React.FC<BackgroundProps> = ({ children }) => {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 38%, ${COLORS.backgroundGradient} 0%, ${COLORS.background} 70%)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
