import { useEffect } from 'react';
import NProgress from 'nprogress';

export default function Loader({ onlyStart = false }) {
	useEffect(() => {
		NProgress.configure({ showSpinner: false });
		NProgress.start();

		return () => {
			if (!onlyStart) NProgress.done(true);
		};
	}, []);

	return null;
}
