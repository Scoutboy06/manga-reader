import { parse } from 'node-html-parser';
import type {
  Chapter,
  ChapterPageResult,
  ChaptersListResult,
  DetailsPageResult,
} from './host.js';
import getChapterNumber from '../lib/getChapterNumber.js';

export default class MangaRead {
  url = 'www.mangaread.org';

  static detailsPageUrl(name: string): string {
    return `https://www.mangaread.org/manga/${name}/`;
  }

  static chapterPageUrl(name: string, chapter: string): string {
    return `https://www.mangaread.org/manga/${name}/${chapter}/`;
  }

  static async scrapeDetailsPage(name: string): Promise<DetailsPageResult> {
    const url = this.detailsPageUrl(name);
    const html = await fetch(url, { redirect: 'follow' }).then((r) => r.text());
    const document = parse(html);

    const title = document.querySelector('.post-title h1')?.textContent?.trim();
    if (!title) {
      throw new Error('Title not found');
    }

    const description = document
      .querySelector('.summary__content')
      ?.textContent?.trim();
    const otherNames = document
      .querySelector('.post-content > div:nth-child(5) > .summary-content')
      ?.textContent?.trim();
    const authors = document
      .querySelector('.post-content > div:nth-child(6) > .summary-content')
      ?.textContent?.trim();
    const artists = document
      .querySelector('.post-content > div:nth-child(7) > .summary-content')
      ?.textContent?.trim();
    const genres = document
      .querySelector('.post-content > div:nth-child(8) > .summary-content')
      ?.textContent?.trim()
      ?.split(', ');
    const released = document
      .querySelector('.post-status > div:nth-child(1) .summary-content > a')
      ?.textContent?.trim();
    const airStatus = document
      .querySelector('.post-status .summary-content:not(:has(> a))')
      ?.textContent?.trim()
      ?.toLowerCase();

    if (airStatus !== 'ongoing' && airStatus !== 'completed') {
      throw new Error('Invalid airStatus');
    }

    const posterEl = document.querySelector('.summary_image img');
    const posterUrl =
      posterEl?.getAttribute('data-src') ||
      posterEl?.getAttribute('data-setsrc') ||
      posterEl?.getAttribute('srcset') ||
      posterEl?.getAttribute('setsrc') ||
      posterEl?.getAttribute('src');

    if (!posterUrl) {
      throw new Error('No poster found');
    }

    return {
      url,
      title,
      description,
      otherNames,
      authors,
      artists,
      genres,
      released,
      airStatus,
      posterUrl,
    };
  }

  static async scrapeChaptersList(name: string): Promise<ChaptersListResult> {
    const url = this.detailsPageUrl(name);
    const html = await fetch(url, { redirect: 'follow' }).then((res) =>
      res.text()
    );
    const document = parse(html);

    const chapters: Chapter[] = [];
    const chapterEls = document.querySelectorAll('.wp-manga-chapter');

    for (const chapterEl of [...chapterEls]) {
      const chapterTitleEl = chapterEl.querySelector('a');
      const chapterTitle = chapterTitleEl?.textContent?.trim();

      // Removing ghost chapters
      if (!chapterTitle) continue;

      const chapterNumber = getChapterNumber(chapterTitle);

      // Removing ghost chapters
      if (isNaN(chapterNumber)) continue;

      const url = chapterTitleEl?.getAttribute('href');
      if (!url) continue;

      chapters.push({ title: chapterTitle, url });
    }

    return {
      url,
      chapters,
    };
  }

  static async scrapeChapterPage(
    name: string,
    chapter: string
  ): Promise<ChapterPageResult> {
    const url = this.chapterPageUrl(name, chapter);
    const html = await fetch(url, { redirect: 'follow' }).then((r) => r.text());
    const document = parse(html);

    const imageEls = document.querySelectorAll('.reading-content img');
    const imageUrls = [];

    for (const imageEl of [...imageEls]) {
      const src =
        imageEl.getAttribute('data-src') ||
        imageEl.getAttribute('data-setsrc') ||
        imageEl.getAttribute('srcset') ||
        imageEl.getAttribute('setsrc') ||
        imageEl.getAttribute('src');

      if (!src) continue;

      imageUrls.push(src.trim());
    }

    return {
      url,
      imageUrls,
    };
  }
}
