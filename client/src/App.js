import {
	BrowserRouter,
	// Switch,
	Routes,
	Route,
	// Redirect,
} from 'react-router-dom';

import ProfilePicker from './pages/profilePicker';
import Library from './pages/library';
import Read from './pages/read';
import Settings from './pages/settings';

import PopupCreator from './components/PopupCreator';

export default function App() {
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
	</>;
}
