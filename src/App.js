import {
	BrowserRouter,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';

import Index from './pages/index';
import Read from './pages/read';

export default function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path='/' component={Index} />
				<Route exact path='/read/:mangaName/:chapter' component={Read} />
				<Redirect to="/" />
			</Switch>
		</BrowserRouter>
	);
}
