export default function getChapterNumber(name: string) {
	const regex = new RegExp('(chapter.+?(\\d+.?\\d*)+?)', 'i');
	const match = regex.exec(name);
	const chapterNumber = match[1].replaceAll('-', ' ').split(/ +/)[1];

	return Number(chapterNumber);
}

// console.log(getChapterNumber('Spy x Family - Chapter 62.1'));
// console.log(getChapterNumber('chapter-62.3'));
// console.log(getChapterNumber('Chapter  58 Chapter 48'));
