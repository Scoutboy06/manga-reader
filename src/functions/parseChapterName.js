export default function parseChapterName(path) {
	if (!path) return '';
	const regex = /(chapter)[ -](\d+)[ -]?(\d+)?/gi;
	const match = regex.exec(path);
	return 'chapter ' + match[2] + (match[3] ? '.' + match[3] : '');
}