import { useContext, lazy, Suspense } from 'react';

import {
	BrowserRouter,
	Routes,
	Route,
	Navigate,
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
import Read from './pages/read';

// Library
const Mangas = lazy(() => import('./pages/library/Mangas'));
const Novels = lazy(() => import('./pages/library/Novels'));
const Animes = lazy(() => import('./pages/library/Animes'));

// Read/watch
const Manga = lazy(() => import('./pages/read/Manga'));
const Novel = lazy(() => import('./pages/read/Novel'));
const Anime = lazy(() => import('./pages/watch/Anime'));

// Settings
const Application = lazy(() => import('./pages/settings/Application'));
const Profiles = lazy(() => import('./pages/settings/Profiles'));
const Profile = lazy(() => import('./pages/settings/Profiles/Profile'));
const Hosts = lazy(() => import('./pages/settings/Hosts'));
const Host = lazy(() => import('./pages/settings/Hosts/Host'));

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
					<Route path='library' element={<Library />}>
						<Route path='mangas' element={<Suspense fallback={<Loader />}><Mangas /></Suspense>} />
						<Route path='novels' element={<Suspense fallback={<Loader />}><Novels /></Suspense>} />
						<Route path='animes' element={<Suspense fallback={<Loader />}><Animes /></Suspense>} />
					</Route>

					<Route path='read' element={<Read />}>
						<Route path='manga/:name/' element={<Suspense fallback={<Loader />}><Manga /></Suspense>}>
							<Route path=':chapter' element={<div></div>} />
						</Route>
						<Route path='novel/:name/' element={<Suspense fallback={<Loader />}><Novel /></Suspense>} />
					</Route>

					<Route path='watch/anime/:name' element={<Suspense fallback={<Loader />}><Anime /></Suspense>} />

					<Route path='settings' element={<Settings />}>
						<Route path='application' element={<Suspense fallback={<Loader />}><Application /></Suspense>} />

						<Route path='profiles' element={<Suspense fallback={<Loader />}><Profiles /></Suspense>}>
							<Route path=':_id' element={<Profile />} />
						</Route>

						<Route path='hosts' element={<Suspense fallback={<Loader />}><Hosts /></Suspense>}>
							<Route path=':_id' element={<Host />} />
						</Route>
					</Route>

					{/* <Route path='*' element={<Navigate to='/library/mangas' replace />} /> */}
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
