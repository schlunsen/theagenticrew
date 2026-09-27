// The chapter films. films.json is written by video/tools/publish.py; this file only types and formats it.
import raw from './films.json';

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
