import { loadFont } from "@remotion/google-fonts/Fraunces";

// Fraunces — fonte serifada editorial usada em todos os vídeos do canal.
// O Remotion aguarda o carregamento automaticamente antes de renderizar.
export const { fontFamily } = loadFont("normal", {
  weights: ["400", "900"],
  subsets: ["latin"],
});

// Itálico — usado na frase final.
loadFont("italic", {
  weights: ["400"],
  subsets: ["latin"],
});
