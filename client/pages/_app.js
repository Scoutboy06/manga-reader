import { useEffect } from 'react';
import { SWRConfig } from 'swr';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';

import ProfileContext from '@/contexts/ProfileContext';

import { fetcher } from '@/functions/fetchAPI.js';

import '@/styles/globals.css';
import '@/styles/NProgress.css';

export default function App({ Component, pageProps }) {
	const router = useRouter();

	useEffect(() => {
		NProgress.configure({ showSpinner: false });

		const handleRouteStart = () => NProgress.start();
		const handleRouteEnd = () => NProgress.done();

		router.events.on('routeChangeStart', handleRouteStart);
		router.events.on('routeChangeComplete', handleRouteEnd);
		router.events.on('routeChangeError', handleRouteEnd);

		return () => {
			router.events.off('routeChangeStart', handleRouteStart);
			router.events.off('routeChangeComplete', handleRouteEnd);
			router.events.off('routeChangeError', handleRouteEnd);
		};
	}, [router]);

	return (
		<SWRConfig value={{ fetcher }}>
			<ProfileContext>
				<Head>
					<meta charSet="utf-8" />
					<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<meta name="description" content="Manga reader" />

					<meta name="theme-color" content="#121212" />
					<meta name="apple-mobile-web-app-capable" content="yes" />
					<meta name="apple-mobile-web-app-status-bar-style" content="#121212" />
					<meta name="apple-mobile-web-app-title" content="Manga Reader" />
					<meta name="msapplication-TileColor" content="#000" />

					<link rel='manifest' href='/manifest.json' />
					<link rel='icon' href='/appIcons/rikka_square.ico' type='image/ico' />
					<link rel='apple-touch-icon' href='/appIcons/rikka_square_256.png' type='image/png' />
					<meta name='msapplication-TileImage' content='/appIcons/rikka_square_128.png' />

					<link
						rel="apple-touch-startup-image"
						href="apple-touch-startup-images/apple-splash-2048-2732.jpg"
						media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
					/>
					<link
						rel="apple-touch-startup-image"
						href="apple-touch-startup-images/apple-splash-1668-2388.jpg"
						media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
					/>
					<link
						rel="apple-touch-startup-image"
						href="apple-touch-startup-images/apple-splash-1536-2048.jpg"
						media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
					/>
					<link
						rel="apple-touch-startup-image"
						href="apple-touch-startup-images/apple-splash-1668-2224.jpg"
						media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
					/>
					<link
						rel="apple-touch-startup-image"
						href="apple-touch-startup-images/apple-splash-1620-2160.jpg"
						media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
					/>
					<link
						rel="apple-touch-startup-image"
						href="apple-touch-startup-images/apple-splash-1284-2778.jpg"
						media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
					/>
					<link
						rel="apple-touch-startup-image"
						href="apple-touch-startup-images/apple-splash-1170-2532.jpg"
						media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
					/>
					<link
						rel="apple-touch-startup-image"
						href="apple-touch-startup-images/apple-splash-1125-2436.jpg"
						media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
					/>
					<link
						rel="apple-touch-startup-image"
						href="apple-touch-startup-images/apple-splash-1242-2688.jpg"
						media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
					/>
					<link
						rel="apple-touch-startup-image"
						href="apple-touch-startup-images/apple-splash-828-1792.jpg"
						media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
					/>
					<link
						rel="apple-touch-startup-image"
						href="apple-touch-startup-images/apple-splash-1242-2208.jpg"
						media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
					/>
					<link
						rel="apple-touch-startup-image"
						href="apple-touch-startup-images/apple-splash-750-1334.jpg"
						media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
					/>
					<link
						rel="apple-touch-startup-image"
						href="apple-touch-startup-images/apple-splash-640-1136.jpg"
						media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
					/>
				</Head>

				<Component {...pageProps} />
			</ProfileContext>
		</SWRConfig>
	)
}