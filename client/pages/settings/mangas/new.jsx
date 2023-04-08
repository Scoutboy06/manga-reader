import Head from 'next/head';

import fetchAPI from '@/lib/fetchAPI';
import useFormCreator from '@/hooks/useFormCreator';
import Navbar from '@/components/navbars/Library';

import styles from '@/styles/settings.module.css';

export default function Mangas({ hosts }) {
	const { states, elements, _, setFields } = useFormCreator([
		{
			label: 'Poster URL:',
			name: 'poster',
			type: 'input',
			defaultValue: '',
		},
		{
			label: 'Host:',
			name: 'hostId',
			type: 'select',
			defaultValue: '',
			options: hosts.map(host => ({
				value: host._id,
				displayName: host.name,
			})),
		},
		{
			label: 'Title:',
			name: 'title',
			type: 'input',
			defaultValue: '',
		},
		{
			label: 'Description:',
			name: 'description',
			type: 'textarea',
			defaultValue: '',
		},
		{
			label: 'URL name:',
			name: 'urlName',
			type: 'input',
			defaultValue: '',
		},
		{
			label: 'Source URL name:',
			name: 'sourceUrlName',
			type: 'input',
			defaultValue: '',
		},
		{
			label: 'Owner ID:',
			name: 'ownerId',
			type: 'input',
			defaultValue: '',
		},
		{
			label: 'Air status:',
			name: 'airStatus',
			type: 'select',
			defaultValue: '',
			options: [
				{ value: 'ongoing', displayName: 'Ongoing' },
				{ value: 'completed', displayName: 'Completed' },
			],
		},
		{
			label: 'Other names:',
			name: 'otherNames',
			type: 'input',
			defaultValue: '',
		},
		{
			label: 'Authors:',
			name: 'authors',
			type: 'input',
			defaultValue: '',
		},
		{
			label: 'Artists:',
			name: 'artists',
			type: 'input',
			defaultValue: '',
		},
		{
			label: 'Genres:',
			name: 'genres',
			type: 'input',
			defaultValue: '',
		},
		{
			label: 'Released:',
			name: 'released',
			type: 'input',
			defaultValue: '',
		},
	]);

	const importHandler = async () => {
		const url = prompt('URL to the manga:');

		const {
			poster,
			hostId,
			title,
			description,
			urlName,
			sourceUrlName,
			airStatus,
			otherNames,
			authors,
			artists,
			genres,
			released,
		} = await fetchAPI(`/mangas/external?url=${encodeURI(url)}`);

		setFields({
			...states,
			poster,
			hostId,
			title,
			description,
			urlName,
			sourceUrlName,
			airStatus,
			otherNames,
			authors,
			artists,
			genres,
			released,
		});
	};

	const submitHandler = async () => {
		console.log(states);

		const res = await fetchAPI('/mangas', {
			method: 'POST',
			body: JSON.stringify({
				...states,
				isVerified: true,
			}),
		});

		console.log(res);
	};

	return (
		<>
			<Head>
				<title>Settings - New Manga</title>
			</Head>

			<Navbar />

			<main className={styles.main}>
				<button
					className='btn secondary'
					style={{ margin: '0 auto', height: '3rem' }}
					onClick={importHandler}
				>
					Import
				</button>

				<img src={states.poster} alt='Manga poster' className={styles.poster} />

				{elements}

				<button
					type='submit'
					className='btn btn-primary'
					style={{ width: '100%', height: '3rem' }}
					onClick={submitHandler}
				>
					Create manga
				</button>
			</main>
		</>
	);
}

export async function getServerSideProps() {
	const hosts = await fetchAPI('/hosts');

	return {
		props: {
			hosts,
		},
	};
}
