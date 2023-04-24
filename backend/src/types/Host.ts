export default interface IHost {
	_id: string;
	name: string;
	detailsPage: {
		urlPattern: string;
		scrapePattern: string;
		title: string;
		poster: string;
		otherNames?: string;
		authors?: string;
		artists?: string;
		genres?: string;
		released?: string;
		airStatus?: string;
		description: string;
		chapters: string;
	};
	chapterPage: {
		urlPattern: string;
		scrapePattern: string;
		prevPage: string;
		nextPage: string;
		images: string;
		imageUrlPrepend: string;
	};
}
