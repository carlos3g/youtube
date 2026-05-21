import React from "react";
import { Composition, Folder } from "remotion";
import { FPS, HEIGHT, WIDTH } from "./shared/constants";
import { FamousFailures } from "./videos/famous-failures/FamousFailures";
import { TOTAL_DURATION } from "./videos/famous-failures/data";

// Registro de todas as composições (vídeos) do canal.
// Cada novo vídeo deve ser adicionado aqui, dentro da pasta "Videos".
export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Videos">
      <Composition
        id="FamousFailures"
        component={FamousFailures}
        durationInFrames={TOTAL_DURATION}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </Folder>
  );
};
