import React from "react";
import type { LucideIcon } from "lucide-react";
import { COLORS } from "../../../shared/constants";
import { fontFamily } from "../../../shared/font";

type FactProps = {
  icon: LucideIcon;
  label: string;
  // Progresso da entrada (0 a 1).
  progress: number;
  // Lado em que o item aparece — define a direção do deslize.
  fromLeft: boolean;
};

// Conquista mostrada ao lado da foto: ícone + rótulo curto.
export const Fact: React.FC<FactProps> = ({
  icon: Icon,
  label,
  progress,
  fromLeft,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        opacity: progress,
        transform: `translateX(${(1 - progress) * (fromLeft ? -28 : 28)}px)`,
      }}
    >
      <Icon
        size={40}
        color={COLORS.accent}
        strokeWidth={1.75}
        style={{ flexShrink: 0 }}
      />
      <span
        style={{
          fontFamily,
          fontSize: 30,
          fontWeight: 500,
          lineHeight: 1.25,
          color: COLORS.muted,
          maxWidth: 300,
        }}
      >
        {label}
      </span>
    </div>
  );
};
