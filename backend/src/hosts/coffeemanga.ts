import { parse } from 'node-html-parser';
import type {
  Chapter,
  ChapterPageResult,
  ChaptersListResult,
  DetailsPageResult,
} from './host.js';
import getChapterNumber from '../lib/getChapterNumber.js';

export default class CoffeeManga {
  url = 'coffeemanga.io';

  static detailsPageUrl(name: string): string {
    return `https://coffeemanga.io/manga/${name}/`;
  }

  static chapterPageUrl(name: string, chapter: string): string {
    return `https://coffeemanga.io/manga/${name}/${chapter}/`;
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
      .querySelector('.summary__content p')
      ?.textContent?.trim();
    const otherNames = document
      .querySelector('.post-content > div:nth-child(4) > .summary-content')
      ?.textContent?.trim();
    const authors = document
      .querySelector('.post-content > div:nth-child(5) > .summary-content')
      ?.textContent?.trim();
    const artists = document
      .querySelector('.post-content > div:nth-child(6) > .summary-content')
      ?.textContent?.trim();
    const genres = document
      .querySelector('.post-content > div:nth-child(7) > .summary-content')
      ?.textContent?.trim()
      ?.split(', ');
    const released = document
      .querySelector('.post-status > div:nth-child(1) > .summary-content')
      ?.textContent?.trim();
    //   body > div.wrap > div > div.site-content > div > div.profile-manga.summary-layout-1 > div > div > div > div.tab-summary > div.summary_content_wrap > div > div.post-status > div:nth-child(2) > div.summary-content
    const airStatus = document
      .querySelector('.post-status > div:nth-child(2) > .summary-content')
      ?.textContent?.trim()
      ?.toLowerCase();

    if (airStatus !== 'ongoing' && airStatus !== 'completed') {
      throw new Error('Invalid airStatus');
    }

    const posterEl = document.querySelector('.summary_image img');
    const posterUrl =
      posterEl?.getAttribute('src') ||
      posterEl?.getAttribute('data-src') ||
      posterEl?.getAttribute('data-setsrc') ||
      posterEl?.getAttribute('srcset') ||
      posterEl?.getAttribute('setsrc');

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
    const url = this.detailsPageUrl(name) + 'ajax/chapters';
    const html = await fetch(url, { method: 'POST', redirect: 'follow' }).then(
      (res) => res.text()
    );
    const document = parse(html);

    const chapters: Chapter[] = [];
    const chapterEls = document.querySelectorAll('.wp-manga-chapter');

    for (const chapterEl of [...chapterEls]) {
      const chapterTitleEl = chapterEl.querySelector('a');
      const title = chapterTitleEl?.textContent?.trim();

      // Removing ghost chapters
      if (!title) continue;

      const chapterNumber = getChapterNumber(title);

      // Removing ghost chapters
      if (isNaN(chapterNumber)) continue;

      const url = chapterTitleEl?.getAttribute('href');
      if (!url) continue;

      chapters.push({ title, url });
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

    const imageEls = document.querySelectorAll('img.wp-manga-chapter-img');
    const imageUrls = [];
    const imgSrcRegex = /src="\s*(.+\.(?:jpg|jpeg|png|webp))"/;

    for (const imageEl of [...imageEls]) {
      const src = imageEl.outerHTML.match(imgSrcRegex)?.[1];

      if (!src) continue;

      imageUrls.push(src.trim());
    }

    return {
      url,
      imageUrls,
    };
  }
}
