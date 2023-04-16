import styles from './NewManga.module.css';
import AdminLayout from '@/layouts/AdminLayout';
import { authOptions } from '@/api/auth/[...nextauth]';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useForm, useWatch } from 'react-hook-form';
import Head from 'next/head';
import Host from '@/models/Host.model';
import IHost from '@/types/Host';
import axios from 'axios';
import { useState } from 'react';

export default function NewManga({ hosts }) {
	const [values, setValues] = useState();
	const { register, control, handleSubmit } = useForm({
		values,
		defaultValues: {
			title: '',
			poster: '',
			backdrop: '',
			hostId: '',
			airStatus: '',
			description: '',
			urlName: '',
			sourceUrlName: '',
			otherNames: '',
			authors: '',
			artists: '',
			genres: '',
			released: '',
		},
	});
	const poster = useWatch({ name: 'poster', control });
	const backdrop = useWatch({ name: 'backdrop', control });

	const importPrompt = async () => {
		const url = prompt('URL:');
		if (!url) return;

		try {
			const {
				data: { chapters, ...data },
			} = await axios.get('/api/scraper/mangas/external', {
				params: { url },
			});
			setValues(data);
		} catch (err) {
			console.error(err);
			window.alert(err.message);
		}
	};

	const submit = async fields => {
		try {
			console.log(fields);
			const res = await axios.post('/api/mangas', fields);

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

			<AdminLayout
				top={
					<>
						<h1>Create New Manga</h1>
						<button
							className='btn btn-primary icon-left'
							onClick={importPrompt}
						>
							<i className='icon'>file_download</i>
							Import
						</button>
					</>
				}
			>
				<form onSubmit={handleSubmit(submit)} className={styles.container}>
					<div className={styles.left}>
						<div className='formGroup'>
							<label htmlFor='poster'>Poster URL:</label>
							<input
								{...register('poster', { required: true })}
								name='poster'
								id='poster'
								type='text'
							/>
						</div>
						{poster && <img src={poster} alt='Poster' />}

						<div className={styles.divider}></div>

						<div className='formGroup'>
							<label htmlFor='backdrop'>Backdrop URL:</label>
							<input
								{...register('backdrop')}
								name='backdrop'
								id='backdrop'
								type='text'
							/>
						</div>
						{backdrop && <img src={backdrop} alt='Backdrop' />}
					</div>

					<div className={styles.right}>
						<div className='formGroup'>
							<label htmlFor='hostId'>Host:</label>
							<select
								{...register('hostId', { required: true })}
								name='hostId'
								id='hostId'
							>
								{hosts.map((host: IHost) => (
									<option value={host._id} key={host._id}>
										{host.name}
									</option>
								))}
							</select>
						</div>

						<div className='formGroup'>
							<label htmlFor='airStatus'>Air status:</label>
							<select
								{...register('airStatus', { required: true })}
								name='airStatus'
								id='airStatus'
							>
								<option value='ongoing'>Ongoing</option>
								<option value='completed'>Completed</option>
							</select>
						</div>

						<div className={styles.divider}></div>

						<div className='formGroup'>
							<label htmlFor='title'>Title:</label>
							<input
								{...register('title', { required: true })}
								name='title'
								id='title'
								type='text'
							/>
						</div>

						<div className='formGroup'>
							<label htmlFor='urlName'>URL name:</label>
							<input
								{...register('urlName', { required: true })}
								name='urlName'
								id='urlName'
								type='text'
							/>
						</div>

						<div className='formGroup'>
							<label htmlFor='sourceUrlName'>Source URL name:</label>
							<input
								{...register('sourceUrlName', { required: true })}
								name='sourceUrlName'
								id='sourceUrlName'
								type='text'
							/>
						</div>

						<div className='formGroup'>
							<label htmlFor='description'>Description:</label>
							<textarea
								{...register('description')}
								name='description'
								id='description'
							/>
						</div>

						<div className={styles.divider}></div>

						<div className='formGroup'>
							<label htmlFor='otherNames'>Other names (optional):</label>
							<input
								{...register('otherNames')}
								name='otherNames'
								id='otherNames'
								type='text'
							/>
						</div>

						<div className='formGroup'>
							<label htmlFor='authors'>Authors (optional):</label>
							<input
								{...register('authors')}
								name='authors'
								id='authors'
								type='text'
							/>
						</div>

						<div className='formGroup'>
							<label htmlFor='artists'>Artists (optional):</label>
							<input
								{...register('artists')}
								name='artists'
								id='artists'
								type='text'
							/>
						</div>

						<div className='formGroup'>
							<label htmlFor='genres'>Genres (optional):</label>
							<input
								{...register('genres')}
								name='genres'
								id='genres'
								type='text'
							/>
						</div>

						<div className='formGroup'>
							<label htmlFor='released'>Released (optional):</label>
							<input
								{...register('released')}
								name='released'
								id='released'
								type='text'
							/>
						</div>

						<button
							className='btn btn-primary'
							style={{ marginTop: 16 }}
							type='submit'
						>
							Create Manga
						</button>
					</div>
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

	const hosts = await Host.find({}, { name: 1 });

	return {
		props: {
			user: JSON.parse(JSON.stringify(session.user)),
			hosts: JSON.parse(JSON.stringify(hosts)),
		},
	};
};
