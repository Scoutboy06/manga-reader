export default interface IHost {
	_id: string;
	name: string;
	detailsPage: {
		url: string;
		title: string;
		poster: string;
		otherNames: string;
		authors?: string;
		artists?: string;
		genres?: string;
		released?: string;
		airStatus: string;
		description: string;
		chapters: string;
	};
	chapterPage: {
		url: string;
		prevPage: string;
		nextPage: string;
		images: string;
	};
	search: {
		url: string;
		method: string;
		container: string;
		poster: string;
		title: string;
		latestChapter: string;
		latestUpdate: string;
		detailsPage: string;
	};
}
