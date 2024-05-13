export type Chapter = { title: string; url: string };

export interface DetailsPageResult {
  url: string;
  title: string;
  description?: string;
  otherNames?: string;
  authors?: string;
  artists?: string;
  genres?: string[];
  released?: string;
  airStatus?: 'ongoing' | 'completed';
  posterUrl: string;
}

export interface ChaptersListResult {
  url: string;
  chapters: Chapter[];
}

export interface ChapterPageResult {
  url: string;
  imageUrls: string[];
}
