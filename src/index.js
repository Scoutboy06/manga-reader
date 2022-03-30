import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import ProfileContext from './contexts/ProfileContext';

ReactDOM.render(
	<React.StrictMode>
		<ProfileContext>
			<App />
		</ProfileContext>
	</React.StrictMode>,
	document.getElementById('root')
);
