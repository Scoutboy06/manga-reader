export default function updateEpisodes(oldEpisodesArr, newEpisodesArr) {
	const episodes = [];

	let i = 0;
	let j = 0;

	while (j < newEpisodesArr.length) {

		// If it's the same episode as before
		if (oldEpisodesArr[i]?.sourceUrlName === newEpisodesArr[j].sourceUrlName) {
			const episode = { ...oldEpisodesArr[i] };
			episode.number = newEpisodesArr[j].number;
			episode.urlName = `episode_${newEpisodesArr[j].number}`;
			episodes.push(episode);

			i++;
			j++;
		}

		// If it's a new episode
		else {
			episodes.push({
				number: j + 1,
				urlName: `episode-${j + 1}`,
				sourceUrlName: newEpisodesArr[j].sourceUrlName,
				isNew: true,
			});

			j++;
		}
	}

	return episodes;
}