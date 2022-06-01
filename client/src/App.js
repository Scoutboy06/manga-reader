import { useContext, lazy, Suspense, useEffect } from 'react';

import {
	BrowserRouter,
	Routes,
	Route,
	// Redirect,
} from 'react-router-dom';
import NProgress from 'nprogress';

import { SettingsContext } from './contexts/SettingsContext';

import PopupCreator from './components/PopupCreator';
import Head from './components/Head';
import Loader from './components/PageLoader';
import isTouchScreen from './functions/isTouchScreen';


import ProfilePicker from './pages/profilePicker';
import Library from './pages/library';
// import Read from './pages/read';
// import Settings from './pages/settings';

// const ProfilePicker = lazy(() => import('./pages/profilePicker'));
// const Library = lazy(() => import('./pages/library'));
const Read = lazy(() => import('./pages/read'));
const Settings = lazy(() => import('./pages/settings'));

export default function App() {
	const [settings] = useContext(SettingsContext);

	useEffect(() => {
		document.body.dataset.isTouchScreen = isTouchScreen();
		NProgress.configure({ showSpinner: false });
	}, []);

	return <>
		<BrowserRouter>
			<Routes>
				<Route exact path='/' element={<ProfilePicker />} />

				<Route exact path='/library' element={<Library />} />

				<Route exact path='/read/:mangaName/' element={<Suspense fallback={<Loader />}><Read /></Suspense>} />

				<Route exact path='/read/:mangaName/:chapter' element={<Suspense fallback={<Loader />}><Read /></Suspense>} />

				<Route exact path='/settings/' element={<Suspense fallback={<Loader />}> <Settings /> </Suspense>} />

				<Route exact path='/settings/:type' element={<Suspense fallback={<Loader />}> <Settings /> </Suspense>} />
			</Routes>
		</BrowserRouter>
		<PopupCreator />
		<Head>
			<link
				rel='icon'
				id='icon'
				href={`/appIcons/${settings.appIcon}.ico`}
				type='image/ico'
			/>
			<link
				rel='apple-touch-icon'
				id='apple-touch-icon'
				href={`/appIcons/${settings.appIcon}_256.png`}
				type='image/png'
			/>
			<meta
				name='msapplication-TileImage'
				id='msapplication-TileImage'
				content={`/appIcons/${settings.appIcon}_128.png`}
			/>
		</Head>
	</>;
}
