// src/components/tasks/photo_detective/photoDetective.types.ts

export type ClueSource =
  | 'photo'
  | 'image_search'
  | 'nick_search'
  | 'geo';

export interface Clue {
  id: string;
  text: string;
  source: ClueSource;
  icon?: string;
  category?: string;
}

export interface Hotspot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  label: string;
  hint: string;
  clueId: string;
  clueText: string;
}

export interface SearchResult {
  id: string;
  platform: string;
  platformIcon: string;
  url: string;
  date: string;
  caption: string;
  likes: number;
  comments: number;
  clueId?: string;
  clueText?: string;
  isClue?: boolean;
}

export interface NickSearchResult {
  id: string;
  platform: string;
  platformIcon: string;
  avatar: string;
  name: string;
  handle: string;
  bio: string;
  extra?: string | null;
  clueId?: string;
  clueText?: string;
  isClue?: boolean;
}

export interface GeoResults {
  coords: string;
  city: string;
  district: string;
  landmarks: string[];
}

export interface DossierSlot {
  id: string;
  label: string;
  icon: string;
  acceptedClues: string[];
}

export interface PhotoDetectiveContent {
  storyTitle: string;
  intro: string;
  imagePath: string;

  hotspots: Hotspot[];

  nickname: string;

  imageSearchResults: SearchResult[];
  nickSearchResults: NickSearchResult[];
  geoResults: GeoResults;

  finalQuestion: string;
  finalPlaceholder: string;
  explainer?: string;
}