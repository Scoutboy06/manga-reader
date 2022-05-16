import { createContext, useState, useEffect } from 'react';

const initialState = (() => {
	const settingsString = localStorage.getItem('settings');
	if (settingsString === null) {
		const initialSettings = { appIcon: 'rikka_square' };
		localStorage.setItem('settings', JSON.stringify(initialSettings));
		return initialSettings;
	}
	return JSON.parse(settingsString);
})();

export const SettingsContext = createContext(initialState);

function updateSetting(setting, callback) {
	const settings = JSON.parse(localStorage.getItem('settings'));
	const saveValue = callback(settings[setting]);
	settings[setting] = saveValue;
	localStorage.setItem('settings', JSON.stringify(settings));
}

export default function Provider({ children }) {
	const [appIcon, setAppIcon] = useState(initialState.appIcon);

	useEffect(() => {
		updateSetting('appIcon', () => appIcon);
	}, [appIcon]);

	const actions = {
		setAppIcon,
	};

	return (
		<SettingsContext.Provider value={[{ appIcon }, actions]}>
			{children}
		</SettingsContext.Provider>
	);
}
