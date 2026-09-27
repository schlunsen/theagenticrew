// The chapter films. films*.json are written by video/tools/publish.py (--book main|crew|handson);
// this file only types and formats them.
import raw from './films.json';
import rawCrew from './films-crew.json';
import rawHandson from './films-handson.json';

export interface Film {
  id: string;          // "01".."19", "A", "B" — matches the chapter numbers in chapters.ts
  order: number;
  slug: string;
  title: string;
  next: string;
  part: string;
  partTitle: string;
  duration: number;    // seconds
  video: string;
  poster: string;
  captions: string;
  sizeMB: number;
  transcript: string[];
}

export const films: Film[] = raw as Film[];
export const TOTAL_FILMS = 21;
export const YOUTUBE_URL = 'https://www.youtube.com/@theagenticcrew';

export const filmById = (id: string) => films.find((f) => f.id === id);
export const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
export const isoDuration = (s: number) => `PT${Math.floor(s / 60)}M${Math.round(s % 60)}S`;
export const label = (f: Film) => (/^\d+$/.test(f.id) ? `Chapter ${Number(f.id)}` : `Appendix ${f.id}`);

// ── All three series, for /watch ──
// Each series has its own look (the class goes next to .home), its own URL prefix and its own labels.
export interface Series {
  key: 'main' | 'crew' | 'handson';
  name: string;          // shown as the section title
  tagline: string;
  theme: string;         // '' | 'crew-theme' | 'handson-theme'
  base: string;          // film pages live at `${base}/${slug}`
  read: string;          // where to get the book
  films: Film[];
  label: (f: Film) => string;
  blurb: string;
}
export const crewFilms: Film[] = rawCrew as Film[];
export const handsonFilms: Film[] = rawHandson as Film[];
export const SERIES: Series[] = [
  { key: 'main', name: 'The Agentic Crew', tagline: 'Engineering in the age of AI agents', theme: '', base: '/watch',
    read: '/#download', films, label, blurb: 'One riso-printed film per chapter of the main book, for engineers.' },
  { key: 'crew', name: "Crew Member's Guide", tagline: "For people who don't write code", theme: 'crew-theme', base: '/watch/crew',
    read: '/books/crew-guide#download', films: crewFilms, label: (f) => `Chapter ${Number(f.id)}`,
    blurb: 'Hand-painted watercolour films for the non-programmers on the crew. More chapters on the way.' },
  { key: 'handson', name: 'Hands-On Guide', tagline: 'Learn by doing', theme: 'handson-theme', base: '/watch/hands-on',
    read: '/books/hands-on#download', films: handsonFilms, label: (f) => (Number(f.id) === 0 ? 'Overview' : `Exercise ${Number(f.id)}`),
    blurb: 'Blueprint watercolour films: the whole guide, then one per exercise.' },
];
export const seriesOf = (key: Series['key']) => SERIES.find((s) => s.key === key)!;
