// import { useState, useEffect } from 'react';
// import fetchAPI from '../../functions/fetchAPI';

import Head from '../../../components/Head';
import MediaCard from '../../../components/MediaCard';
import HorizontalScrollContainer from '../../../components/HorizontalScrollContainer';

// import { ProfileContext } from '../../contexts/ProfileContext';

import styles from './Animes.module.css';

const data = [
	{
		title: 'Continue watching',
		type: 'video',
		media: [
			{
				_id: 'horimiya',
				episodeNumber: 8,
				imgUrl: 'https://gogocdn.net/cover/horimiya.png',
				title: 'Horimiya',
				subtitle: 'Episode 8',
			},
			{
				_id: 'kimetsu-no-yaiba',
				episodeNumber: 4,
				imgUrl: 'https://gogocdn.net/cover/kimetsu-no-yaiba.png',
				title: 'Kimetsu no Yaiba',
				subtitle: 'Episode 4',
			},
			{
				_id: 'kanojo-okarishimasu-2nd-season',
				episodeNumber: 1,
				imgUrl: 'https://gogocdn.net/cover/kanojo-okarishimasu-2nd-season.png',
				title: 'Kanojo, Okarishimasu 2nd Season',
				subtitle: 'Episode 1',
			},
		],
	},
	{
		title: 'Your favorites',
		type: 'folder',
		media: [
			{
				_id: 'mushoku-tensei-isekai-ittara-honki-dasu',
				imgUrl:
					'https://gogocdn.net/cover/mushoku-tensei-isekai-ittara-honki-dasu.png',
				title: 'Mushoku Tensei: Isekai Ittara Honki Dasu',
			},
			{
				_id: 'shingeki-no-kyojin',
				imgUrl: 'https://gogocdn.net/images/anime/Shingeki-no-Kyojin.jpg',
				title: 'Shingeki no Kyojin',
			},
			{
				_id: 'kaguya-sama-wa-kokurasetai-tensai-tachi-no-renai-zunousen',
				imgUrl:
					'https://gogocdn.net/cover/kaguya-sama-wa-kokurasetai-tensai-tachi-no-renai-zunousen.png',
				title: 'Kaguya-sama wa Kokurasetai: Tensai-tachi no Renai Zunousen',
			},
			{
				_id: 'horimiya',
				imgUrl: 'https://gogocdn.net/cover/horimiya.png',
				title: 'Horimiya',
			},
			{
				_id: 'death-note',
				imgUrl: 'https://gogocdn.net/cover/death-note.png',
				title: 'Death Note',
			},
			{
				_id: 'spy-x-family',
				imgUrl: 'https://gogocdn.net/cover/spy-x-family.png',
				title: 'Spy x Family',
			},
			{
				_id: 'vinland-saga',
				imgUrl: 'https://gogocdn.net/cover/vinland-saga.png',
				title: 'Vinland Saga',
			},
			{
				_id: 'kimetsu-no-yaiba',
				imgUrl: 'https://gogocdn.net/cover/kimetsu-no-yaiba.png',
				title: 'Kimetsu no Yaiba',
			},
			{
				_id: 'rezero-kara-hajimeru-isekai-seikatsu',
				imgUrl:
					'https://gogocdn.net/cover/rezero-kara-hajimeru-isekai-seikatsu.jpg',
				title: 'Re:Zero kara Hajimeru Isekai Seikatsu',
			},
			{
				_id: 'seishun-buta-yarou-wa-bunny-girl-senpai-no-yume-wo-minai',
				imgUrl:
					'https://gogocdn.net/cover/seishun-buta-yarou-wa-bunny-girl-senpai-no-yume-wo-minai.png',
				title: 'Seishun Buta Yarou wa Bunny Girl Senpai no Yume wo Minai',
			},
			{
				_id: 'violet-evergarden',
				imgUrl: 'https://gogocdn.net/cover/violet-evergarden.png',
				title: 'Violet Evergarden',
			},
		],
	},
];

export default function Animes() {
	return (
		<>
			<Head>
				<title>Choose an anime</title>
			</Head>

			<main style={{ marginTop: 30, padding: '0 10px' }}>
				{data.map((section, i) => (
					<HorizontalScrollContainer
						key={`Section_${i}`}
						title={<h1 className={styles.title}>{section.title}</h1>}
					>
						{section.media.map((media, j) => (
							<MediaCard
								key={`Card_${i}_${j}`}
								type={section.type}
								href={`/animes/${media._id}${
									section.type === 'video'
										? `/episode-${media.episodeNumber}`
										: ''
								}`}
								imgUrl={media.imgUrl}
								title={media.title}
								subtitle={media.subtitle}
							/>
						))}
					</HorizontalScrollContainer>
				))}
			</main>
		</>
	);
}
