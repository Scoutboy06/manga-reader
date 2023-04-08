type MatchValueWithSchema = {
	source: string;
	schema: string;
	key: string;
};

export default function matchValueWithSchema({
	source,
	schema,
	key,
}: MatchValueWithSchema) {
	const regex = new RegExp(schema.replace(key, '(.+?)'));
	return regex.exec(source)?.[1];
}

// console.log(
// 	matchValueWithSchema({
// 		source: 'https://www.mangaread.org/manga/fullmetal-alchemist/',
// 		schema: 'https://www.mangaread.org/manga/%name/',
// 		key: '%name',
// 	})
// );

// console.log(
// 	matchValueWithSchema({
// 		source: 'https://www.mangaread.org/manga/one-punch-man/chapter-235.6/',
// 		schema: 'https://www.mangaread.org/manga/%name/',
// 		key: '%name',
// 	})
// );
