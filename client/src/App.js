import { useContext, lazy, Suspense } from 'react';

import {
	BrowserRouter,
	Routes,
	Route,
	// Redirect,
} from 'react-router-dom';

// import Loader from './components/Loader';

import { SettingsContext } from './contexts/SettingsContext';

import ProfilePicker from './pages/profilePicker';
import Library from './pages/library';
// import Read from './pages/read';
// import Settings from './pages/settings';

import PopupCreator from './components/PopupCreator';
import Head from './components/Head';

// const ProfilePicker = lazy(() => import('./pages/profilePicker'));
// const Library = lazy(() => import('./pages/library'));
const Read = lazy(() => import('./pages/read'));
const Settings = lazy(() => import('./pages/settings'));

export default function App() {
	const [settings] = useContext(SettingsContext);

	return <>
		<BrowserRouter>
			<Routes>
				<Route exact path='/' element={<ProfilePicker />} />

				<Route exact path='/library' element={<Library />} />

				{/* fallback={<Loader size={90} style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />} */}
				<Route exact path='/read/:mangaName/' element={<Suspense><Read /></Suspense>} />

				<Route exact path='/read/:mangaName/:chapter' element={<Suspense><Read /></Suspense>} />

				<Route exact path='/settings/' element={<Suspense> <Settings /> </Suspense>} />
				<Route exact path='/settings/:type' element={<Suspense> <Settings /> </Suspense>} />
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
