import { createContext, useReducer } from 'react';
import generateId from '../functions/generateId';

const types = {
	CREATE_ALERT: 'CREATE_ALERT',
	CLOSE_ALERT: 'CLOSE_ALERT',
	SET_VISIBILITY: 'SET_VISIBILITY',
};

const initialState = [];

const reducer = (alerts, action) => {
	switch (action.type) {
		case types.CREATE_ALERT:
			return [
				...alerts,
				{ ...action.payload, isVisible: true, id: generateId() },
			];

		case types.CLOSE_ALERT:
			return [
				...alerts.slice(0, action.index),
				...alerts.slice(action.index + 1, alerts.length),
			];

		case types.SET_VISIBILITY:
			const alert = alerts[action.index];
			alert.isVisible = action.isVisible;
			const newAlerts = [
				...alerts.slice(0, action.index),
				alert,
				...alerts.slice(action.index + 1, alerts.length),
			];
			return newAlerts;

		default:
			return alerts;
	}
};

export const AlertContext = createContext(initialState);

export default function Provider({ children }) {
	const [alerts, dispatch] = useReducer(reducer, initialState);

	const actions = {
		createAlert: payload => {
			dispatch({
				type: types.CREATE_ALERT,
				payload,
			});
		},
		closeAlert: index => {
			dispatch({
				type: types.SET_VISIBILITY,
				index,
				isVisible: false,
			});
			setTimeout(() => {
				dispatch({
					type: types.CLOSE_ALERT,
					index,
				});
			}, 150);
		},
	};

	return (
		<AlertContext.Provider value={[alerts, actions]}>
			{children}
		</AlertContext.Provider>
	);
}
