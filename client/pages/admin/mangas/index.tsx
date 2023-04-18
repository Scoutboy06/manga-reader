import Head from 'next/head';
import styles from './mangas.module.css';
import AdminLayout from '@/layouts/AdminLayout';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/api/auth/[...nextauth]';
import Manga from '@/models/Manga.model';
import IUser from '@/types/User';
import IManga from '@/types/Manga';
import connectDB from '@/lib/mongoose';
import ReorderableList from '@/components/ReorderableList';
import { useEffect, useState } from 'react';
import axios from 'axios';

type PageProps = {
	totalMangaCount: number;
	ongoingMangaCount: number;
	finishedMangaCount: number;
	totalChapterCount: number;
	featuredMangas: IManga[];
	popularMangas: IManga[];
};

export default function Mangas({
	totalMangaCount,
	ongoingMangaCount,
	finishedMangaCount,
	totalChapterCount,
	featuredMangas,
	popularMangas,
}: PageProps) {
	const [featured, setFeatured] = useState(
		featuredMangas.map(({ _id, title }) => ({ _id, title }))
	);
	const [popular, setPopular] = useState(
		popularMangas.map(({ _id, title }) => ({ _id, title }))
	);

	const addFeatured = async () => {
		const urlName = prompt('Manga URL name:');
		try {
			const { data: manga } = await axios.get(`/api/mangas/${urlName}`);

			setFeatured([...featured, { _id: manga._id, title: manga.title }]);
		} catch (err) {
			console.error(err);
			window.alert(err.message);
		}
	};

	const addPopular = async () => {
		const urlName = prompt('Manga URL name:');
		try {
			const { data: manga } = await axios.get(`/api/mangas/${urlName}`);
			setPopular([...popular, { _id: manga._id, title: manga.title }]);
		} catch (err) {
			console.error(err);
			window.alert(err.message);
		}
	};

	const saveFeatured = async () => {
		try {
			const ids = featured.map(manga => manga._id);
			console.log(ids);

			const res = await axios.put('/api/mangas/featured', ids);
			if (res.statusText === 'OK') {
				window.alert(res.data.message || 'Success');
			}
		} catch (err) {
			console.error(err);
			window.alert(err.message);
		}
	};

	const savePopular = async () => {
		try {
			const ids = popular.map(manga => manga._id);
			const res = await axios.put('/api/mangas/popular', ids);
			if (res.statusText === 'OK') {
				window.alert(res.data.message || 'Success');
			}
		} catch (err) {
			console.error(err);
			window.alert(err.message);
		}
	};

	return (
		<>
			<Head>
				<title>Settings - Mangas</title>
			</Head>

			<AdminLayout
				top={
					<>
						<h1>Mangas</h1>
						<Link
							href='/admin/mangas/new'
							className='btn btn-primary icon-left'
						>
							<i className='icon'>add</i>
							Create new
						</Link>
					</>
				}
			>
				<main className={styles.main}>
					<div className={styles.infoCard}>
						<h1>{totalMangaCount}</h1>
						<p>Total mangas</p>
					</div>

					<div className={styles.infoCard}>
						<h1>{ongoingMangaCount}</h1>
						<p>Ongonig mangas</p>
					</div>

					<div className={styles.infoCard}>
						<h1>{finishedMangaCount}</h1>
						<p>Finished mangas</p>
					</div>

					<div className={styles.infoCard}>
						<h1>{totalChapterCount}</h1>
						<p>Total chapters</p>
					</div>

					<div className={styles.listContainer}>
						<h2>Featured mangas</h2>

						<ReorderableList
							className={styles.list}
							items={featured}
							remove={_id =>
								setFeatured(featured.filter(item => item._id !== _id))
							}
							swap={(a, b) => {
								const obj = JSON.parse(JSON.stringify(featured));
								let copy = obj[a];
								obj[a] = obj[b];
								obj[b] = copy;

								setFeatured(obj);
							}}
						/>

						<div className={styles.actionBtns}>
							<button className='btn btn-sm add' onClick={addFeatured}>
								<i className='icon'>add</i>
							</button>
							<button
								className='btn btn-sm btn-primary submit'
								onClick={saveFeatured}
							>
								Submit
							</button>
						</div>
					</div>

					<div className={styles.listContainer}>
						<h2>Popular mangas</h2>

						<ReorderableList
							className={styles.list}
							items={popular}
							remove={_id =>
								setPopular(popular.filter(item => item._id !== _id))
							}
							swap={(a, b) => {
								const obj = JSON.parse(JSON.stringify(popular));
								let copy = obj[a];
								obj[a] = obj[b];
								obj[b] = copy;

								setPopular(obj);
							}}
						/>

						<div className={styles.actionBtns}>
							<button className='btn btn-sm add' onClick={addPopular}>
								<i className='icon'>add</i>
							</button>
							<button
								className='btn btn-sm btn-primary submit'
								onClick={savePopular}
							>
								Submit
							</button>
						</div>
					</div>
				</main>
			</AdminLayout>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async context => {
	await connectDB();
	const session = await getServerSession(context.req, context.res, authOptions);

	if (!session?.user?.isAdmin) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	const [details, ongoingMangaCount, featuredMangas, popularMangas] =
		await Promise.all([
			Manga.aggregate([
				{
					$group: {
						_id: 1,
						totalMangaCount: {
							$count: {},
						},
						totalChapterCount: {
							$sum: { $size: '$chapters' },
						},
					},
				},
			]),
			Manga.countDocuments({ airStatus: 'ongoing' }),
			Manga.find(
				{ featuredIndex: { $exists: true } },
				{ title: 1 },
				{ sort: { featuredIndex: 1 } }
			),
			Manga.find(
				{ popularIndex: { $exists: true } },
				{ title: 1 },
				{ sort: { popularIndex: 1 } }
			),
		]);

	const { totalMangaCount, totalChapterCount } = details[0];
	const finishedMangaCount = totalMangaCount - ongoingMangaCount;

	const props: PageProps = {
		totalMangaCount,
		ongoingMangaCount,
		finishedMangaCount,
		totalChapterCount,
		featuredMangas: JSON.parse(JSON.stringify(featuredMangas)),
		popularMangas: JSON.parse(JSON.stringify(popularMangas)),
	};

	return { props };
};
