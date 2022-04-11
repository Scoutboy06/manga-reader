import {
	BrowserRouter,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';

import Profiles from './pages/profiles';
import Index from './pages/index';
import Read from './pages/read';

export default function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path='/' component={Profiles} />
				<Route exact path='/library' component={Index} />
				<Route exact path='/read/:mangaName/' component={Read} />
				<Route exact path='/read/:mangaName/:chapter' component={Read} />
				<Redirect to="/" />
			</Switch>
		</BrowserRouter>
	);
}
