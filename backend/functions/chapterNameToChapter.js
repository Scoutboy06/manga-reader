export default function chapterNameToChapter(name) {
	const regex = new RegExp('(.+) ?- ?(chapter.+)', 'gi');
	const match = regex.exec(name);
	console.log(match);
	return match[2];
}