import Head from 'next/head';
import Link from 'next/link';
import useSWR from 'swr';
import Manga from '@/models/Manga.model';
import connectDB from '@/lib/mongoose';
import HorizontalScrollContainer from '@/components/HorizontalScrollContainer';
import styles from './index.module.css';
import MangaCard from '@/components/MangaCard';
import DefaultLayout from '@/layouts/DefaultLayout';
import { GetStaticProps } from 'next';
import IManga from '@/types/Manga';
import { HydratedDocument } from 'mongoose';
import { UserManga } from '@/types/User';
import Image from 'next/image';

interface Props {
	featuredManga: HydratedDocument<IManga>;
	popularMangas: HydratedDocument<IManga>[];
	recentlyUpdated: HydratedDocument<IManga>[];
}

export default function Home({
	featuredManga,
	popularMangas,
	recentlyUpdated,
}: Props) {
	const { data: continueReading }: { data?: HydratedDocument<UserManga>[] } =
		useSWR(`/api/me/mangas?limit=8`);

	return (
		<>
			<Head>
				<title>Discover - Manga Reader</title>
			</Head>

			<DefaultLayout>
				<header className={styles.header}>
					<Image
						src={featuredManga.backdrop!}
						priority={true}
						width={1080}
						height={720}
						sizes='(max-width: 1080px) 100vw
											1080px'
						alt={featuredManga.title}
						className={styles.backdrop}
					/>

					<div className={styles.content}>
						<Image
							width={300}
							height={450}
							priority={true}
							src={featuredManga.poster}
							alt={featuredManga.title}
							className={styles.poster}
						/>

						<div className={styles.text}>
							<p className={styles.genres}>
								{featuredManga.genres?.split(', ')?.map(genre => (
									<span key={genre}>{genre}</span>
								))}
							</p>

							<Link
								href={`/mangas/${featuredManga.urlName}`}
								className={styles.title}
							>
								<h1>
									{featuredManga.title}
									<i className='icon'>open_in_new</i>
								</h1>
							</Link>

							<p className={styles.description}>{featuredManga.description}</p>
						</div>
					</div>
				</header>

				<section className={styles.section}>
					<HorizontalScrollContainer
						title={
							<>
								Popular Mangas
								<Link
									href='/mangas/popular'
									className='btn btn-secondary btn-sm'
									style={{ display: 'inline', marginLeft: '1rem' }}
								>
									See all
								</Link>
							</>
						}
						gap={16}
					>
						{popularMangas.map((manga, i) => (
							<MangaCard.Vertical
								key={manga._id.toString()}
								href={`/mangas/${manga.urlName}`}
								image={manga.poster}
								title={manga.title}
								imagePriority={i <= 3}
							/>
						))}
					</HorizontalScrollContainer>
				</section>

				{continueReading && continueReading?.length > 0 && (
					<section className={styles.section}>
						<HorizontalScrollContainer title='Continue Reading' gap={16}>
							{continueReading?.map(manga => (
								<MangaCard.Vertical
									key={manga._id.toString()}
									href={`/mangas/${manga.urlName}/${manga.currentChapter.urlName}`}
									title={manga.title}
									titleHref={`/mangas/${manga.urlName}`}
									image={manga.poster}
									subtitle={`Chapter ${manga.currentChapter.number}`}
								/>
							))}
						</HorizontalScrollContainer>
					</section>
				)}

				<section className={styles.section}>
					<h1 className={styles.title}>
						Recently Updated
						<Link
							href='/mangas/updated'
							className='btn btn-secondary btn-sm'
							style={{ display: 'inline', marginLeft: '1rem' }}
						>
							See all
						</Link>
					</h1>

					<div className={styles.horizontalCards}>
						{recentlyUpdated?.map(manga => (
							<MangaCard.Horizontal
								title={manga.title}
								urlName={manga.urlName}
								image={manga.poster}
								chapters={manga.chapters}
							/>
						))}
					</div>
				</section>
			</DefaultLayout>
		</>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	await connectDB();

	const [featuredManga, popularMangas, recentlyUpdated] = await Promise.all([
		await Manga.findOne({ title: 'Oshi no Ko' }, { chapters: 0 }),

		await Manga.find(
			{ popularIndex: { $exists: true } },
			{ title: 1, urlName: 1, poster: 1 },
			{ sort: { popularIndex: 1 } }
		),
		await Manga.find(
			{},
			{ chapters: { $slice: [0, 3] }, title: 1, urlName: 1, poster: 1 },
			{ limit: 12, sort: { latestChapterAt: -1 } }
		),
	]);

	const props: Props = {
		featuredManga: JSON.parse(JSON.stringify(featuredManga)),
		popularMangas: JSON.parse(JSON.stringify(popularMangas)),
		recentlyUpdated: JSON.parse(JSON.stringify(recentlyUpdated)),
	};

	return { props };
};
