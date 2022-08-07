// import { useState, useEffect, useContext } from 'react';
// import fetchAPI from '../../functions/fetchAPI';

import Head from '../../../components/Head';
import MediaCard from '../../../components/MediaCard';
import HorizontalScrollContainer from '../../../components/HorizontalScrollContainer';

// import { ProfileContext } from '../../contexts/ProfileContext';

import styles from './Animes.module.css';

const data = [
	{
		title: 'Continue watching',
		media: [
			{
				type: 'video',
				urlName: 'vinland-saga',
				imgUrl:
					'http://192.168.0.10:8096/Items/a6f6552b0edce26a884791819c1fcbc5/Images/Backdrop?fillHeight=252&fillWidth=448&quality=96&tag=f6749854144fa5db41b1ac936562538d',
				title: 'Vinland Saga',
				subtitle: 'Episode 22',
			},
			{
				type: 'video',
				urlName: 'attack-on-titan',
				imgUrl:
					'http://192.168.0.10:8096/Items/fc2f886723745940cc9e11a9926048bb/Images/Backdrop?fillHeight=252&fillWidth=448&quality=96&tag=89dc508a15d56b8db91755130748a7ce',
				title: 'Attack on Titan',
				subtitle: 'Episode 12',
			},
		],
	},
	{
		title: 'Your favourites',
		media: [
			{
				type: 'folder',
				urlName: 'mushoku-tensei-isekai-ittara-honki-dasu',
				imgUrl:
					'https://gogocdn.net/cover/mushoku-tensei-isekai-ittara-honki-dasu.png',
				title: 'Mushoku Tensei: Isekai Ittara Honki Dasu',
			},
			{
				type: 'folder',
				urlName: 'vinland-saga',
				imgUrl:
					'http://192.168.0.10:8096/Items/a6f6552b0edce26a884791819c1fcbc5/Images/Primary?fillHeight=446&fillWidth=298&quality=96&tag=a422f65783c1a4a33486d198b4357f03',
				title: 'Vinland Saga',
			},
			{
				type: 'folder',
				urlName: 'horimiya',
				imgUrl:
					'http://192.168.0.10:8096/Items/cf87d9f8f441020b5adb413a2e48436a/Images/Primary?fillHeight=411&fillWidth=274&quality=96&tag=963150a595208ee300bb56f0afb9057d',
				title: 'Horimiya',
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
								type={media.type}
								href={[
									media.type === 'folder'
										? '/animes'
										: media.type === 'video'
										? '/watch'
										: '/',
									media.urlName.startsWith('/') ? '' : '/',
									media.urlName,
								].join('')}
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
