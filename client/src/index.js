import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

import ProfileContext from './contexts/ProfileContext';
import PopupContext from './contexts/PopupContext';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
	<StrictMode>
		<ProfileContext>
			<PopupContext>
				<App />
			</PopupContext>
		</ProfileContext>
	</StrictMode>
);
