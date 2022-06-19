import { createContext, useState, useEffect } from 'react';

const initialState = (() => {
	const settingsString = localStorage.getItem('settings');
	if (settingsString === null) {
		const initialSettings = { appIcon: 'rikka_square', imageScale: 1 };
		localStorage.setItem('settings', JSON.stringify(initialSettings));
		return initialSettings;
	}
	return JSON.parse(settingsString);
})();

export const SettingsContext = createContext(initialState);

function updateSettings(values) {
	const settings = JSON.parse(localStorage.getItem('settings'));

	Object.keys(values).forEach(key => {
		settings[key] = values[key];
	});

	localStorage.setItem('settings', JSON.stringify(settings));
}

export default function Provider({ children }) {
	const [appIcon, setAppIcon] = useState(initialState.appIcon);
	const [imageScale, setImageScale] = useState(initialState.imageScale);

	useEffect(() => {
		updateSettings({
			appIcon,
			imageScale,
		});
	}, [appIcon, imageScale]);

	const actions = {
		setAppIcon,
		setImageScale,
	};

	return (
		<SettingsContext.Provider value={[{ appIcon, imageScale }, actions]}>
			{children}
		</SettingsContext.Provider>
	);
}
