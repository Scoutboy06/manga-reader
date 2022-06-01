/* Example inputs:
	Case 1: Spy x Family - Chapter 62.1
	Case 2: chapter-62.3
*/

export default function chapterNameToChapter(name) {
	const regex = new RegExp('(?:(.+) ?- ?)?(chapter.+)', 'i');
	const match = regex.exec(name);

	let returnValue = match[2];

	// Parse case 2
	if (match[2].match(/chapter-.+/i)) {
		returnValue = match[2]
			.replace('-', ' ')
			.replace('-', '.');
		returnValue = returnValue[0].toUpperCase() + returnValue.slice(1);
	}

	return returnValue;
}

console.log(chapterNameToChapter('Spy x Family - Chapter 62.1'))
console.log(chapterNameToChapter('chapter-62.3'))