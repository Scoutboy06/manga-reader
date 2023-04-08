export default function parseUrlName(title: string) {
	return encodeURI(
		title
			.toLowerCase()
			.replaceAll(/[^ a-z0-9-._~:[\]@!$'()*+%=]/g, '')
			.replaceAll(/ +/g, '-')
	);
}
