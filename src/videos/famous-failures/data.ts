import {
  Atom,
  Award,
  Banknote,
  BookOpen,
  Brain,
  Building2,
  CalendarDays,
  Castle,
  Disc3,
  Feather,
  Film,
  Globe,
  Landmark,
  Lightbulb,
  Medal,
  Mic,
  Music,
  Rocket,
  ScrollText,
  Smartphone,
  Sparkles,
  Star,
  Trophy,
  Tv,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FPS } from "../../shared/constants";

// Conteúdo do vídeo "Falhas famosas".
// Recriação (sem narração) do vídeo "Famous Failures", do canal RubixSpark.
// Cada pessoa é apresentada pela sua falha e, depois, revelada pelo nome,
// pela foto (sem fundo) e por 4 conquistas mostradas nas laterais.

export type Fact = {
  icon: LucideIcon;
  label: string;
};

export type Failure = {
  name: string;
  failure: string;
  // Caminho da foto sem fundo, relativo a public/ (ver staticFile).
  photo: string;
  // 4 conquistas: as 2 primeiras vão à esquerda, as 2 últimas à direita.
  facts: Fact[];
};

export const FAILURES: Failure[] = [
  {
    name: "Michael Jordan",
    failure:
      "Cortado do time de basquete do ensino médio, ele foi para casa, se trancou no quarto e chorou.",
    photo: "famous-failures/people/michael-jordan.png",
    facts: [
      { icon: Trophy, label: "6× campeão da NBA" },
      { icon: Star, label: "5× MVP da temporada" },
      { icon: Award, label: "14× All-Star da NBA" },
      { icon: Medal, label: "2× ouro olímpico" },
    ],
  },
  {
    name: "Albert Einstein",
    failure:
      "Só falou perto dos 4 anos de idade. Seus professores diziam que ele “nunca seria grande coisa”.",
    photo: "famous-failures/people/albert-einstein.png",
    facts: [
      { icon: Atom, label: "Criou a teoria da relatividade" },
      { icon: Sparkles, label: "Formulou E = mc²" },
      { icon: Award, label: "Nobel de Física em 1921" },
      { icon: Brain, label: "Gênio do século XX" },
    ],
  },
  {
    name: "Oprah Winfrey",
    failure:
      "Foi rebaixada do cargo de âncora de telejornal porque “não tinha perfil para a televisão”.",
    photo: "famous-failures/people/oprah-winfrey.png",
    facts: [
      { icon: Tv, label: "Maior talk show da TV" },
      { icon: CalendarDays, label: "25 anos no ar" },
      { icon: Banknote, label: "1ª bilionária negra" },
      { icon: Star, label: "Ícone da televisão" },
    ],
  },
  {
    name: "Walt Disney",
    failure:
      "Demitido de um jornal por “falta de imaginação” e por “não ter ideias originais”.",
    photo: "famous-failures/people/walt-disney.png",
    facts: [
      { icon: Film, label: "Fundou os estúdios Disney" },
      { icon: Award, label: "Recordista de Oscars: 22" },
      { icon: Castle, label: "Criou a Disneylândia" },
      { icon: Sparkles, label: "Pioneiro da animação" },
    ],
  },
  {
    name: "Lionel Messi",
    failure:
      "Aos 11 anos, foi cortado do time após ser diagnosticado com uma deficiência de hormônio do crescimento.",
    photo: "famous-failures/people/lionel-messi.png",
    facts: [
      { icon: Trophy, label: "Campeão da Copa do Mundo" },
      { icon: Award, label: "8× Bola de Ouro" },
      { icon: Star, label: "Maior artilheiro do Barcelona" },
      { icon: Medal, label: "Recordista de títulos" },
    ],
  },
  {
    name: "Steve Jobs",
    failure:
      "Aos 30 anos, ficou devastado e deprimido depois de ser demitido, sem cerimônia, da empresa que ele mesmo fundou.",
    photo: "famous-failures/people/steve-jobs.png",
    facts: [
      { icon: Smartphone, label: "Lançou o iPhone" },
      { icon: Lightbulb, label: "Co-fundou a Apple" },
      { icon: Building2, label: "Empresa mais valiosa do mundo" },
      { icon: Rocket, label: "Revolucionou a tecnologia" },
    ],
  },
  {
    name: "Eminem",
    failure:
      "Largou o ensino médio. Suas batalhas com as drogas e a pobreza culminaram em uma tentativa de suicídio.",
    photo: "famous-failures/people/eminem.png",
    facts: [
      { icon: Mic, label: "Maior nome do rap" },
      { icon: Disc3, label: "220 milhões de discos vendidos" },
      { icon: Award, label: "15 prêmios Grammy" },
      { icon: Trophy, label: "Oscar de melhor canção" },
    ],
  },
  {
    name: "Thomas Edison",
    failure:
      "Um professor disse que ele era “burro demais para aprender qualquer coisa”.",
    photo: "famous-failures/people/thomas-edison.png",
    facts: [
      { icon: Lightbulb, label: "Inventou a lâmpada elétrica" },
      { icon: Disc3, label: "Inventou o fonógrafo" },
      { icon: Film, label: "Criou a câmera de cinema" },
      { icon: ScrollText, label: "1.093 patentes" },
    ],
  },
  {
    name: "The Beatles",
    failure:
      "Rejeitados pela gravadora Decca: “não gostamos do som deles, eles não têm futuro no show business”.",
    photo: "famous-failures/people/the-beatles.png",
    facts: [
      { icon: Music, label: "Banda mais influente da história" },
      { icon: Disc3, label: "600 milhões de discos vendidos" },
      { icon: Star, label: "20 hits nº 1 nos EUA" },
      { icon: Globe, label: "Fenômeno cultural mundial" },
    ],
  },
  {
    name: "Dr. Seuss",
    failure: "Seu primeiro livro foi rejeitado por 27 editoras.",
    photo: "famous-failures/people/dr-seuss.png",
    facts: [
      { icon: BookOpen, label: "Mais de 60 livros infantis" },
      { icon: Globe, label: "650 milhões de livros vendidos" },
      { icon: Feather, label: "Autor de O Gato do Chapéu" },
      { icon: Star, label: "Clássico da literatura infantil" },
    ],
  },
  {
    name: "Abraham Lincoln",
    failure:
      "Sua noiva morreu. Ele faliu nos negócios, teve um colapso nervoso e foi derrotado em 8 eleições.",
    photo: "famous-failures/people/abraham-lincoln.png",
    facts: [
      { icon: Landmark, label: "16º presidente dos EUA" },
      { icon: Users, label: "Aboliu a escravidão" },
      { icon: ScrollText, label: "Discurso de Gettysburg" },
      { icon: Star, label: "Manteve os EUA unidos" },
    ],
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
