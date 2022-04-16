import {
	BrowserRouter,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';

import profilePicker from './pages/profilePicker';
import Library from './pages/library';
import Read from './pages/read';
import Settings from './pages/settings';

import PopupCreator from './components/PopupCreator';

export default function App() {
	return <>
		<BrowserRouter>
			<Switch>
				<Route exact path='/' component={profilePicker} />
				<Route exact path='/library' component={Library} />
				<Route exact path='/read/:mangaName/' component={Read} />
				<Route exact path='/read/:mangaName/:chapter' component={Read} />
				<Route exact path='/settings/' component={Settings} />
				<Route exact path='/settings/:type' component={Settings} />
				<Redirect to="/" />
			</Switch>
		</BrowserRouter>
		<PopupCreator />
	</>;
}
