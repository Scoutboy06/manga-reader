export default function chapterNameToChapter(name) {
	const regex = new RegExp('(.+) ?- ?(chapter.+)', 'gi');
	const match = regex.exec(name);
	return match[2];
}