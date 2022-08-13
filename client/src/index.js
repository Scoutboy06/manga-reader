import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SWRConfig } from 'swr';
import './index.css';
import App from './App';

import { fetcher } from './functions/fetchAPI';

import ProfileContext from './contexts/ProfileContext';
import PopupContext from './contexts/PopupContext';
import SettingsContext from './contexts/SettingsContext';
import AlertContext from './contexts/AlertContext';

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
			</ProfileContext></SWRConfig>
	</StrictMode>
);
