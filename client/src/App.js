import { useContext, lazy, Suspense } from 'react';

import {
	BrowserRouter,
	Routes,
	Route,
} from 'react-router-dom';

import { SettingsContext } from './contexts/SettingsContext';
import { ProfileContext } from './contexts/ProfileContext';

import PopupCreator from './components/PopupCreator';
import AlertCreator from './components/AlertCreator';
import Head from './components/Head';
import Loader from './components/PageLoader';

import ProfilePicker from './pages/profilePicker';
import Library from './pages/library';
import Settings from './pages/settings';

const Application = lazy(() => import('./pages/settings/Application'));
const Profiles = lazy(() => import('./pages/settings/Profiles'));
const Profile = lazy(() => import('./pages/settings/Profiles/Profile'));
const Hosts = lazy(() => import('./pages/settings/Hosts'));
const Host = lazy(() => import('./pages/settings/Hosts/Host'));
const Read = lazy(() => import('./pages/read'));

export default function App() {
	const [settings] = useContext(SettingsContext);
	const [{ currentProfile, isLoading }] = useContext(ProfileContext);

	return <>
		<BrowserRouter>

			{(!currentProfile && !isLoading) ? (
				<Routes>
					<Route path='*' element={<ProfilePicker />} />
				</Routes>
			) : (currentProfile && !isLoading) && (
				<Routes>
					<Route exact path='/' element={<Library />} />

					<Route exact path='/read/:mangaName/' element={<Suspense fallback={<Loader />}><Read /></Suspense>} />

					<Route exact path='/read/:mangaName/:chapter' element={<Suspense fallback={<Loader />}><Read /></Suspense>} />

					<Route path='settings' element={<Settings />}>
						<Route path='application' element={<Suspense fallback={<Loader />}><Application /></Suspense>} />

						<Route path='profiles' element={<Suspense fallback={<Loader />}><Profiles /></Suspense>}>
							<Route path=':_id' element={<Profile />} />
						</Route>

						<Route path='hosts' element={<Suspense fallback={<Loader />}><Hosts /></Suspense>}>
							<Route path=':_id' element={<Host />} />
						</Route>
					</Route>

				</Routes>
			)}
		</BrowserRouter>

		<PopupCreator />

		<AlertCreator />

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
