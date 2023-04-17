import DefaultLayout from '@/layouts/DefaultLayout';
import Head from 'next/head';

export default function Contact() {
	return (
		<DefaultLayout>
			<Head>
				<title>About</title>
			</Head>

			<main
				style={{ display: 'grid', placeItems: 'center', paddingTop: '10rem' }}
			>
				<h1 style={{ marginBottom: '1rem' }}>About</h1>
				<p style={{ textAlign: 'center' }}>
					This website is a hobby project.
					<br />
					We are not not making any money from this.
				</p>
			</main>
		</DefaultLayout>
	);
}
