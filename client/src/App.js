import { useContext } from 'react';

import {
	BrowserRouter,
	Routes,
	Route,
	// Redirect,
} from 'react-router-dom';

import { SettingsContext } from './contexts/SettingsContext';

import ProfilePicker from './pages/profilePicker';
import Library from './pages/library';
import Read from './pages/read';
import Settings from './pages/settings';

import PopupCreator from './components/PopupCreator';
import Head from './components/Head';


export default function App() {
	const [settings] = useContext(SettingsContext);

	return <>
		<BrowserRouter>
			<Routes>
				<Route exact path='/' element={<ProfilePicker />} />
				<Route exact path='/library' element={<Library />} />
				<Route exact path='/read/:mangaName/' element={<Read />} />
				<Route exact path='/read/:mangaName/:chapter' element={<Read />} />
				<Route exact path='/settings/' element={<Settings />} />
				<Route exact path='/settings/:type' element={<Settings />} />
				{/* <Redirect to="/" /> */}
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
