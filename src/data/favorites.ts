import type { Favorite } from "@/types";

export const favorites: Favorite[] = [
  // Movies (tall posters, 2:3)
  {
    kind: "movie",
    title: "Django Unchained",
    creator: "Quentin Tarantino",
    year: "2012",
    note: "Unapologetic, stylish revenge cinema with unforgettable performances and razor-sharp dialogue.",
    cover:
      "https://res.cloudinary.com/cfqdlsg4/image/upload/v1793642186/django_fqiltb.webp",
  },
  {
    kind: "movie",
    title: "The Matrix",
    creator: "The Wachowskis",
    year: "1999",
    note: "Philosophical sci-fi and revolutionary visual style that redefined action filmmaking.",
    cover:
      "https://res.cloudinary.com/cfqdlsg4/image/upload/v1793642181/matrc_r6du7h.webp",
  },
  {
    kind: "movie",
    title: "Arrival",
    creator: "Denis Villeneuve",
    year: "2016",
    note: "A thoughtful, deeply emotional study of communication, memory, and non-linear time.",
    cover:
      "https://res.cloudinary.com/cfqdlsg4/image/upload/v1793642181/arrival_avmznq.webp",
  },
  {
    kind: "movie",
    title: "Shutter Island",
    creator: "Martin Scorsese",
    year: "2010",
    note: "A masterclass in psychological dread, atmosphere, and layered deception.",
    cover:
      "https://res.cloudinary.com/cfqdlsg4/image/upload/v1793642177/st_nnlkoo.webp",
  },
  {
    kind: "movie",
    title: "Interstellar",
    creator: "Christopher Nolan",
    year: "2014",
    note: "Epic cosmic scope anchored by pure emotional resonance and a soaring Hans Zimmer score.",
    cover:
      "https://res.cloudinary.com/cfqdlsg4/image/upload/v1793642177/inter_ffb1v5.webp",
  },
  {
    kind: "movie",
    title: "Kill Bill",
    creator: "Quentin Tarantino",
    year: "2003",
    note: "Kinetic homage to martial arts cinema, anime, and grindhouse with singular flair.",
    cover:
      "https://res.cloudinary.com/cfqdlsg4/image/upload/v1793642843/killb_wvtmfq.webp",
  },

  // Shows (2:3 tall poster ratio)
  {
    kind: "tv",
    title: "Invincible",
    creator: "Robert Kirkman",
    year: "2021",
    meta: "2 seasons",
    note: "Subversive, high-stakes superhero storytelling with brutal consequences and heart.",
    cover:
      "https://res.cloudinary.com/cfqdlsg4/image/upload/v1793642177/inv_ayqmub.webp",
  },
  {
    kind: "tv",
    title: "Chernobyl",
    creator: "Craig Mazin",
    year: "2019",
    meta: "Miniseries",
    note: "Gripping, harrowing dramatization of bureaucratic failure and human sacrifice.",
    cover:
      "https://res.cloudinary.com/cfqdlsg4/image/upload/v1793642178/chern_lo0qel.webp",
  },
  {
    kind: "tv",
    title: "The Office",
    creator: "Greg Daniels",
    year: "2005",
    meta: "9 seasons",
    note: "Comfort television at its finest, timeless humor and genuine character warmth.",
    cover:
      "https://res.cloudinary.com/cfqdlsg4/image/upload/v1793642179/off_wemrki.webp",
  },
  {
    kind: "tv",
    title: "Dark",
    creator: "Baran bo Odar & Jantje Friese",
    year: "2017",
    meta: "3 seasons",
    note: "Immaculately constructed time-travel puzzle box that never collapses under its ambition.",
    cover:
      "https://res.cloudinary.com/cfqdlsg4/image/upload/v1793642186/dark_fjsao9.webp",
  },

  // Anime (portrait tiles, 3:4)
  {
    kind: "anime",
    title: "Monster",
    creator: "Madhouse",
    year: "2004",
    meta: "74 eps",
    note: "A profound, morally complex psychological thriller with one of fiction's greatest villains.",
    cover:
      "https://res.cloudinary.com/cfqdlsg4/image/upload/v1793642178/peak_hrhx4x.webp",
  },
  {
    kind: "anime",
    title: "Attack on Titan",
    creator: "Wit Studio / MAPPA",
    year: "2013",
    meta: "89 eps",
    note: "A relentless narrative escalation exploring freedom, cycle of hatred, and devastation.",
    cover:
      "https://res.cloudinary.com/cfqdlsg4/image/upload/v1793642843/aot_v6kxiu.webp",
  },
  {
    kind: "anime",
    title: "Demon Slayer",
    creator: "ufotable",
    year: "2019",
    meta: "4 seasons",
    note: "Spectacular animation choreography paired with deeply earnest emotional stakes.",
    cover:
      "https://res.cloudinary.com/cfqdlsg4/image/upload/v1793642846/demon_eudtlg.webp",
  },
  {
    kind: "anime",
    title: "Naruto: Shippuden",
    creator: "Studio Pierrot",
    year: "2007",
    meta: "500 eps",
    note: "Formative journey of endurance, bonds, and philosophy that defined a generation.",
    cover:
      "https://res.cloudinary.com/cfqdlsg4/image/upload/v1793642843/naru_bsp6tf.webp",
  },
  {
    kind: "anime",
    title: "Neon Genesis Evangelion",
    creator: "Gainax / Hideaki Anno",
    year: "1995",
    meta: "26 eps",
    note: "Radical psychological deconstruction of mecha tropes, alienation, and identity.",
    cover:
      "https://res.cloudinary.com/cfqdlsg4/image/upload/v1793642843/nge_jqqcsf.webp",
  },

  // Music (square sleeves, 1:1)
  {
    kind: "music",
    title: "Currents",
    creator: "Tame Impala",
    year: "2015",
    note: "A lush, psychedelic synth-pop masterpiece of personal transition and meticulous sonic detail.",
    cover:
      "https://res.cloudinary.com/cfqdlsg4/image/upload/v1793643355/curr_estwg0.webp",
  },
  {
    kind: "music",
    title: "Swimming",
    creator: "Mac Miller",
    year: "2018",
    note: "Vulnerable, soulful hip-hop infused with jazz and funk, navigating grief, healing, and growth.",
    cover:
      "https://res.cloudinary.com/cfqdlsg4/image/upload/v1793643354/mac_hyx4to.webp",
  },
  {
    kind: "music",
    title: "In Rainbows",
    creator: "Radiohead",
    year: "2007",
    note: "Warm, hypnotic, and emotionally resonant art-rock where every texture and rhythm falls into place.",
    cover:
      "https://res.cloudinary.com/cfqdlsg4/image/upload/v1793643354/radio_m44ecv.webp",
  },
  {
    kind: "music",
    title: "The Suburbs",
    creator: "Arcade Fire",
    year: "2010",
    note: "An evocative indie-rock chronicle of youth, modern disillusionment, and nostalgia.",
    cover:
      "https://res.cloudinary.com/cfqdlsg4/image/upload/v1793643353/af_mb3nrm.webp",
  },
  {
    kind: "music",
    title: "The Slow Rush",
    creator: "Tame Impala",
    year: "2020",
    note: "Expansive groove-driven exploration of time, memory, and rhythm from start to finish.",
    cover:
      "https://res.cloudinary.com/cfqdlsg4/image/upload/v1793643354/tame_toaymu.webp",
  },
];

export const isFavoritesVisible = favorites.length > 0;

export const CATEGORY_CONFIG = [
  { kind: "movie" as const, id: "movies", label: "Movies" },
  { kind: "tv" as const, id: "tv", label: "TV shows" },
  { kind: "anime" as const, id: "anime", label: "Anime" },
  { kind: "music" as const, id: "music", label: "Music" },
] as const;
