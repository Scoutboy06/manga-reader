export default function parseUrlName(title) {
	return encodeURI(title.toLowerCase().replaceAll(/[^ a-z0-9-._~:\[\]@!$'()*+%=]/g, '').replaceAll(/ +/g, '-'))
}