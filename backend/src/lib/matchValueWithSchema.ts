export default function matchValueWithSchema({
	value,
	schema,
}: {
	value: string;
	schema: string;
}) {
	const matches = new Map<string, string>();

	const keys = [];
	for (const match of schema.matchAll(/%(.+?)%/gi)) {
		keys.push(match[1]);
	}

	const regex = new RegExp(schema.replaceAll(/%(.+?)%/gi, '(.+?)'), 'gi');
	const exec = regex.exec(value);
	if (!exec) return null;

	let i = 0;
	for (const match of exec.slice(1)) {
		matches.set(keys[i], match);
		i++;
	}

	return matches;
}

// console.log(
// 	matchValueWithSchema({
// 		value: 'https://www.mangaread.org/manga/fullmetal-alchemist/',
// 		schema: 'https://www.mangaread.org/manga/%name%/',
// 	})
// );

// console.log(
// 	matchValueWithSchema({
// 		value: 'https://www.mangaread.org/manga/one-punch-man/chapter-235.6/',
// 		schema: 'https://www.mangaread.org/manga/%name%/%chapter%/',
// 	})
// );
