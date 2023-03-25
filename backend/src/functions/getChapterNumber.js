/* Example inputs:
	Case 1: Spy x Family - Chapter 62.1
	Case 2: chapter-62.3
*/

export default function getChapterNumber(name) {
	const regex = new RegExp('(?:(.+) ?- ?)?(chapter.+)', 'i');
	const match = regex.exec(name);

	let returnValue = match[2]
		.replace('-', ' ')
		.split(' ')[1];

	return returnValue;
}

console.log(getChapterNumber('Spy x Family - Chapter 62.1'))
console.log(getChapterNumber('chapter-62.3'))