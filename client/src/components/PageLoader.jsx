import { useEffect } from 'react';
import NProgress from 'nprogress';

export default function Loader() {
	useEffect(() => {
		NProgress.start();

		return () => {
			NProgress.done(true);
		};
	}, []);

	return null;
}
