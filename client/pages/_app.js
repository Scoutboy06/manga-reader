import { useEffect } from 'react';
import { SWRConfig } from 'swr';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { SessionProvider } from 'next-auth/react';

import BaseHeadContent from '@/components/BaseHeadContent';

import '@/styles/globals.css';
import '@/styles/NProgress.css';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function App({ Component, pageProps: { session, ...pageProps } }) {
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
			<SessionProvider session={session} refetchOnWindowFocus={false}>
				<Head>
					<BaseHeadContent />
				</Head>

				<Component {...pageProps} />
			</SessionProvider>
		</SWRConfig>
	)
}