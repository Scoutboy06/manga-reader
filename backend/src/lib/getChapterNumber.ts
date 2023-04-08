/* Example inputs:
	Case 1: Spy x Family - Chapter 62.1
	Case 2: chapter-62.3
*/

export default function getChapterNumber(name: string) {
	const regex = new RegExp('(?:(.+) ?- ?)?(chapter.+)', 'i');
	const match = regex.exec(name);
	const chapterNumber = match[2].replace('-', ' ').split(' ')[1];

	return Number(chapterNumber);
}

// console.log(getChapterNumber('Spy x Family - Chapter 62.1'));
// console.log(getChapterNumber('chapter-62.3'));
