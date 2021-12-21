import {
	BrowserRouter as Router,
	Switch,
	Route /* Link */,
} from 'react-router-dom';

import Home from './pages/index';
import Read from './pages/read';

export default function App() {
	return (
		<Router>
			<Switch>
				<Route exact path='/' component={Home} />

				<Route exact path='/:mangaName/:chapter' component={Read} />
			</Switch>
		</Router>
	);
}
