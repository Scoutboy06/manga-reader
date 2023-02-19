import { useEffect } from 'react';
import NProgress from 'nprogress';

export default function Loader({ onlyStart = false, showProgress = true }) {
	useEffect(() => {
		NProgress.configure({ showSpinner: false });

		if (showProgress) {
			NProgress.start();

			return () => {
				if (!onlyStart) NProgress.done(true);
			};
		}
	}, []);

	return null;
}
