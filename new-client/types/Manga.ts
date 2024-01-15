export interface Chapter {
  number: number;
  urlName: string;
  sourceUrlName: string;
  dateAdded: Date | string;
}

export default interface Manga {
  _id: string;
  urlName: string;
  title: string;
  description: string;
  sourceUrlName: string;

  airStatus?: 'ongoing' | 'completed';
  otherNames?: string;
  authors?: string;
  artists?: string;
  genres?: string;
  released?: string;

  poster: string;
  backdrop?: string;

  featuredIndex?: number;
  popularIndex?: number;
  top100Index?: number;

  chapters: Chapter[];
}

export interface UserManga {
  _id: string;
  title: string;
  urlName: string;
  isFavorite: boolean;
  notificationsOn: boolean;
  readStatus: 'reading' | 'finished';
  lastRead: Date;
  currentChapter: Chapter;
  poster: string;
}
