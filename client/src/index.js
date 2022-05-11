import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

import ProfileContext from './contexts/ProfileContext';
import PopupContext from './contexts/PopupContext';
import SettingsContext from './contexts/SettingsContext';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
	<StrictMode>
		<ProfileContext>
			<PopupContext>
				<SettingsContext>
					<App />
				</SettingsContext>
			</PopupContext>
		</ProfileContext>
	</StrictMode>
);
