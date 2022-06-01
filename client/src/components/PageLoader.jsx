import { useEffect } from 'react';
import NProgress from 'nprogress';

export default function Loader() {
	useEffect(() => {
		NProgress.configure({ showSpinner: false });
		NProgress.start();

		return () => {
			NProgress.done(true);
		};
	}, []);

	return null;
}
