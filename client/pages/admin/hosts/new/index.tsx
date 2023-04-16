import styles from './NewHost.module.css';
import AdminLayout from '@/layouts/AdminLayout';
import { authOptions } from '@/api/auth/[...nextauth]';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useForm } from 'react-hook-form';
import Head from 'next/head';
import Host from '@/models/Host.model';
import axios from 'axios';

export default function NewHost() {
	const { register, handleSubmit } = useForm({
		defaultValues: {
			name: '',
			detailsPage: {
				urlPattern: 'https://www.mangaread.org/manga/%name%/',
				title: '.post-title h1',
				poster: '.summary_image img',
				otherNames: '.post-content > div:nth-child(5) > .summary-content',
				authors: '.post-content > div:nth-child(6) > .summary-content',
				artists: '.post-content > div:nth-child(7) > .summary-content',
				genres: '.post-content > div:nth-child(8) > .summary-content',
				released: '.post-status > div:nth-child(1) .summary-content > a',
				airStatus: '.post-status > :nth-child(2) > .summary-content',
				description: '.summary__content',
				chapters: '.wp-manga-chapter',
			},
			chapterPage: {
				urlPattern: 'https://www.mangaread.org/manga/%name%/%chapter%/',
				prevPage: '.prev_page',
				nextPage: '.next_page',
				images: '.reading-content img',
			},
			search: {
				urlPattern: 'https://www.mangaread.org/?s=%query%&post_type=wp-manga',
				method: 'POST',
				container: '.c-tabs-item__content',
				poster: '.c-image-hover img',
				title: '.post-title a',
				latestChapter: '.chapter a',
				latestUpdate: '.post-on span',
				detailsPage: '.post-title a',
			},
		},
	});

	const submit = async fields => {
		try {
			const res = await axios.post('/api/hosts', fields);
			console.log(res);
			window.alert(res.statusText);
		} catch (err) {
			window.alert(err.message);
			console.error(err);
		}
	};

	return (
		<>
			<Head>
				<title>Settings - New Manga</title>
			</Head>

			<AdminLayout top={<h1>Create New Host</h1>}>
				<form onSubmit={handleSubmit(submit)} className={styles.container}>
					<section className={styles.section}>
						<h2>Name</h2>

						<div className='formGroup'>
							<label htmlFor='name'>Host name:</label>
							<input
								{...register('name', { required: true })}
								name='name'
								id='name'
								type='text'
							/>
						</div>

						<div className={styles.divider}></div>

						<h2>Details page</h2>

						<div className='formGroup'>
							<label htmlFor='detailsPage.urlPattern'>URL pattern:</label>
							<input
								{...register('detailsPage.urlPattern', { required: true })}
								name='detailsPage.urlPattern'
								id='detailsPage.urlPattern'
								type='text'
							/>
						</div>

						<div className='formGroup'>
							<label htmlFor='detailsPage.title'>Title selector:</label>
							<input
								{...register('detailsPage.title', { required: true })}
								name='detailsPage.title'
								id='detailsPage.title'
								type='text'
							/>
						</div>

						<div className='formGroup'>
							<label htmlFor='detailsPage.poster'>Poster selector:</label>
							<input
								{...register('detailsPage.poster', { required: true })}
								name='detailsPage.poster'
								id='detailsPage.poster'
								type='text'
							/>
						</div>

						<div className='formGroup'>
							<label htmlFor='detailsPage.otherNames'>
								Other names selector:
							</label>
							<input
								{...register('detailsPage.otherNames', { required: true })}
								name='detailsPage.otherNames'
								id='detailsPage.otherNames'
								type='text'
							/>
						</div>

						<div className='formGroup'>
							<label htmlFor='detailsPage.authors'>
								Authors selector (optional):
							</label>
							<input
								{...register('detailsPage.authors')}
								name='detailsPage.authors'
								id='detailsPage.authors'
								type='text'
							/>
						</div>

						<div className='formGroup'>
							<label htmlFor='detailsPage.artists'>
								Artists selector (optional):
							</label>
							<input
								{...register('detailsPage.artists')}
								name='detailsPage.artists'
								id='detailsPage.artists'
								type='text'
							/>
						</div>

						<div className='formGroup'>
							<label htmlFor='detailsPage.genres'>Genres selector:</label>
							<input
								{...register('detailsPage.genres', { required: true })}
								name='detailsPage.genres'
								id='detailsPage.genres'
								type='text'
							/>
						</div>

						<div className='formGroup'>
							<label htmlFor='detailsPage.released'>
								Released selector (optional):
							</label>
							<input
								{...register('detailsPage.released')}
								name='detailsPage.released'
								id='detailsPage.released'
								type='text'
							/>
						</div>

						<div className='formGroup'>
							<label htmlFor='detailsPage.airStatus'>
								Air status selector:
							</label>
							<input
								{...register('detailsPage.airStatus', { required: true })}
								name='detailsPage.airStatus'
								id='detailsPage.airStatus'
								type='text'
							/>
						</div>

						<div className='formGroup'>
							<label htmlFor='detailsPage.description'>Poster selector:</label>
							<input
								{...register('detailsPage.description', { required: true })}
								name='detailsPage.description'
								id='detailsPage.description'
								type='text'
							/>
						</div>

						<div className='formGroup'>
							<label htmlFor='detailsPage.chapters'>Chapters selector:</label>
							<input
								{...register('detailsPage.chapters', { required: true })}
								name='detailsPage.chapters'
								id='detailsPage.chapters'
								type='text'
							/>
						</div>

						<div className={styles.divider}></div>
					</section>

					<section className={styles.section}>
						<h2>Chapter page</h2>

						<div className='formGroup'>
							<label htmlFor='chapterPage.urlPattern'>URL pattern:</label>
							<input
								{...register('chapterPage.urlPattern', { required: true })}
								name='chapterPage.urlPattern'
								id='chapterPage.urlPattern'
								type='text'
							/>
						</div>

						<div className='formGroup'>
							<label htmlFor='chapterPage.prevPage'>
								Previous page selector:
							</label>
							<input
								{...register('chapterPage.prevPage', { required: true })}
								name='chapterPage.prevPage'
								id='chapterPage.prevPage'
								type='text'
							/>
						</div>

						<div className='formGroup'>
							<label htmlFor='chapterPage.nextPage'>Next page selector:</label>
							<input
								{...register('chapterPage.nextPage', { required: true })}
								name='chapterPage.nextPage'
								id='chapterPage.nextPage'
								type='text'
							/>
						</div>

						<div className='formGroup'>
							<label htmlFor='chapterPage.images'>Images selector:</label>
							<input
								{...register('chapterPage.images', { required: true })}
								name='chapterPage.images'
								id='chapterPage.images'
								type='text'
							/>
						</div>

						<div className={styles.divider}></div>

						<h2>Search</h2>

						<div className='formGroup'>
							<label htmlFor='search.urlPattern'>URL pattern:</label>
							<input
								{...register('search.urlPattern', { required: true })}
								name='search.urlPattern'
								id='search.urlPattern'
								type='text'
							/>
						</div>

						<div className='formGroup'>
							<label htmlFor='search.method'>HTTP method:</label>
							<select
								{...register('search.method', { required: true })}
								name='search.method'
								id='search.method'
							>
								<option value='POST'>POST</option>
								<option value='GET'>GET</option>
							</select>
						</div>

						<div className='formGroup'>
							<label htmlFor='search.poster'>Poster selector:</label>
							<input
								{...register('search.poster', { required: true })}
								name='search.poster'
								id='search.poster'
								type='text'
							/>
						</div>

						<div className='formGroup'>
							<label htmlFor='search.title'>Title selector:</label>
							<input
								{...register('search.title', { required: true })}
								name='search.title'
								id='search.title'
								type='text'
							/>
						</div>

						<div className='formGroup'>
							<label htmlFor='search.latestChapter'>
								Latest chapter selector:
							</label>
							<input
								{...register('search.latestChapter', { required: true })}
								name='search.latestChapter'
								id='search.latestChapter'
								type='text'
							/>
						</div>

						<div className='formGroup'>
							<label htmlFor='search.latestUpdate'>
								Latest update selector:
							</label>
							<input
								{...register('search.latestUpdate', { required: true })}
								name='search.latestUpdate'
								id='search.latestUpdate'
								type='text'
							/>
						</div>

						<div className='formGroup'>
							<label htmlFor='search.detailsPage'>Details page selector:</label>
							<input
								{...register('search.detailsPage', { required: true })}
								name='search.detailsPage'
								id='search.detailsPage'
								type='text'
							/>
						</div>
					</section>

					<button
						className='btn btn-primary'
						style={{ marginTop: 16, marginLeft: 'auto' }}
						type='submit'
					>
						Create Host
					</button>
				</form>
			</AdminLayout>
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async context => {
	const session = await getServerSession(context.req, context.res, authOptions);

	if (!session?.user?.isAdmin) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	return {
		props: {},
	};
};
