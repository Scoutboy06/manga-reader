import { createContext, useState, useEffect } from 'react';

const initialState = (() => {
	const settingsString = localStorage.getItem('settings');
	if (settingsString === null) {
		const initialSettings = {
			contentWidth: 1.0,
			appIcon: 'rikka_square',
		};
		localStorage.setItem('settings', JSON.stringify(initialSettings));
		console.log(initialSettings);
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
	const [contentWidth, setContentWidth] = useState(initialState.contentWidth);

	useEffect(() => {
		updateSettings({
			appIcon,
			contentWidth,
		});
	}, [appIcon, contentWidth]);

	const actions = {
		setAppIcon,
		setContentWidth,
	};

	return (
		<SettingsContext.Provider value={[{ appIcon, contentWidth }, actions]}>
			{children}
		</SettingsContext.Provider>
	);
}
