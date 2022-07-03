export default function getChapterNumber(path) {
	if (!path) return '';
	const regex = /(?:chapter)[ -](\d+)[ -]?(\d+)?/gi;
	const match = regex.exec(path);
	return match[1] + (match[2] ? '.' + match[2] : '');
}