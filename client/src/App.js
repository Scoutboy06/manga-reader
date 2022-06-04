import { useContext, lazy, Suspense } from 'react';

import {
	BrowserRouter,
	Routes,
	Route,
	// Redirect,
} from 'react-router-dom';

import { SettingsContext } from './contexts/SettingsContext';

import PopupCreator from './components/PopupCreator';
import Head from './components/Head';
import Loader from './components/PageLoader';


import ProfilePicker from './pages/profilePicker';
import Library from './pages/library';
// import Read from './pages/read';
import Settings from './pages/settings';

// import Application from './pages/settings/Application';
// import Profiles from './pages/settings/Profiles';
// import Profile from './pages/settings/Profiles/Profile';
const Application = lazy(() => import('./pages/settings/Application'));
const Profiles = lazy(() => import('./pages/settings/Profiles'));
const Profile = lazy(() => import('./pages/settings/Profiles/Profile'));

// const ProfilePicker = lazy(() => import('./pages/profilePicker'));
// const Library = lazy(() => import('./pages/library'));
const Read = lazy(() => import('./pages/read'));
// const Settings = lazy(() => import('./pages/settings'));

export default function App() {
	const [settings] = useContext(SettingsContext);

	return <>
		<BrowserRouter>
			<Routes>
				<Route exact path='/' element={<ProfilePicker />} />

				<Route exact path='/library' element={<Library />} />

				<Route exact path='/read/:mangaName/' element={<Suspense fallback={<Loader />}><Read /></Suspense>} />

				<Route exact path='/read/:mangaName/:chapter' element={<Suspense fallback={<Loader />}><Read /></Suspense>} />

				<Route path='settings' element={<Settings />}>
					<Route path='application' element={<Suspense fallback={<Loader />}><Application /></Suspense>} />

					<Route path='profiles' element={<Suspense fallback={<Loader />}><Profiles /></Suspense>}>
						<Route path=':_id' element={<Profile />} />
					</Route>
				</Route>
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
