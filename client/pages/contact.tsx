import DefaultLayout from '@/layouts/DefaultLayout';
import Head from 'next/head';

export default function Contact() {
	return (
		<DefaultLayout>
			<Head>
				<title>Contact</title>
			</Head>

			<main
				style={{ display: 'grid', placeItems: 'center', paddingTop: '10rem' }}
			>
				<h1 style={{ marginBottom: '1rem' }}>Contact</h1>
				<p>
					Contact us via{' '}
					<a
						href='mailto:trorduatthanbryrsig@gmail.com'
						style={{ color: 'cyan' }}
					>
						email
					</a>
				</p>
			</main>
		</DefaultLayout>
	);
}
