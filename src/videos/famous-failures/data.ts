import { FPS } from "../../shared/constants";

// Conteúdo do vídeo "Falhas famosas".
// Recriação (sem áudio) do vídeo "Famous Failures", do canal RubixSpark.
// Cada pessoa é apresentada primeiro pela sua falha e, depois, revelada
// pelo nome e por uma foto (sem fundo) ao lado.

export type Failure = {
  name: string;
  failure: string;
  // Caminho da foto sem fundo, relativo a public/ (ver staticFile).
  photo: string;
};

export const FAILURES: Failure[] = [
  {
    name: "Michael Jordan",
    failure:
      "Cortado do time de basquete do ensino médio, ele foi para casa, se trancou no quarto e chorou.",
    photo: "famous-failures/people/michael-jordan.png",
  },
  {
    name: "Albert Einstein",
    failure:
      "Só falou perto dos 4 anos de idade. Seus professores diziam que ele “nunca seria grande coisa”.",
    photo: "famous-failures/people/albert-einstein.png",
  },
  {
    name: "Oprah Winfrey",
    failure:
      "Foi rebaixada do cargo de âncora de telejornal porque “não tinha perfil para a televisão”.",
    photo: "famous-failures/people/oprah-winfrey.png",
  },
  {
    name: "Walt Disney",
    failure:
      "Demitido de um jornal por “falta de imaginação” e por “não ter ideias originais”.",
    photo: "famous-failures/people/walt-disney.png",
  },
  {
    name: "Lionel Messi",
    failure:
      "Aos 11 anos, foi cortado do time após ser diagnosticado com uma deficiência de hormônio do crescimento.",
    photo: "famous-failures/people/lionel-messi.png",
  },
  {
    name: "Steve Jobs",
    failure:
      "Aos 30 anos, ficou devastado e deprimido depois de ser demitido, sem cerimônia, da empresa que ele mesmo fundou.",
    photo: "famous-failures/people/steve-jobs.png",
  },
  {
    name: "Eminem",
    failure:
      "Largou o ensino médio. Suas batalhas com as drogas e a pobreza culminaram em uma tentativa de suicídio.",
    photo: "famous-failures/people/eminem.png",
  },
  {
    name: "Thomas Edison",
    failure:
      "Um professor disse que ele era “burro demais para aprender qualquer coisa”.",
    photo: "famous-failures/people/thomas-edison.png",
  },
  {
    name: "The Beatles",
    failure:
      "Rejeitados pela gravadora Decca: “não gostamos do som deles, eles não têm futuro no show business”.",
    photo: "famous-failures/people/the-beatles.png",
  },
  {
    name: "Dr. Seuss",
    failure: "Seu primeiro livro foi rejeitado por 27 editoras.",
    photo: "famous-failures/people/dr-seuss.png",
  },
  {
    name: "Abraham Lincoln",
    failure:
      "Sua noiva morreu. Ele faliu nos negócios, teve um colapso nervoso e foi derrotado em 8 eleições.",
    photo: "famous-failures/people/abraham-lincoln.png",
  },
];

export const ENDING_QUOTE =
  "Se você nunca falhou, é porque nunca tentou nada novo.";

// Durações de cada cena, em frames.
export const INTRO_DURATION = 3 * FPS;
export const PERSON_DURATION = 14 * FPS;
export const QUOTE_DURATION = 11 * FPS;

// Duração total do vídeo.
export const TOTAL_DURATION =
  INTRO_DURATION + FAILURES.length * PERSON_DURATION + QUOTE_DURATION;
