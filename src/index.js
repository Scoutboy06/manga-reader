import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import ProfileContext from './contexts/ProfileContext';
import PopupContext from './contexts/PopupContext';

ReactDOM.render(
	<React.StrictMode>
		<ProfileContext>
			<PopupContext>
				<App />
			</PopupContext>
		</ProfileContext>
	</React.StrictMode>,
	document.getElementById('root')
);
