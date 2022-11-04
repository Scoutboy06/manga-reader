import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SWRConfig } from 'swr';
import './index.css';
import App from './App.jsx';

import { fetcher } from './functions/fetchAPI.js';

import ProfileContext from './contexts/ProfileContext.jsx';
import PopupContext from './contexts/PopupContext.jsx';
import SettingsContext from './contexts/SettingsContext.jsx';
import AlertContext from './contexts/AlertContext.jsx';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
	<StrictMode>
		<SWRConfig value={{ fetcher }}>
			<ProfileContext>
				<PopupContext>
					<SettingsContext>
						<AlertContext>
							<App />
						</AlertContext>
					</SettingsContext>
				</PopupContext>
			</ProfileContext>
		</SWRConfig>
	</StrictMode>
);
