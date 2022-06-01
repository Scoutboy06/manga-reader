import { createContext, useReducer } from 'react';

const types = {
	CREATE_POPUP: 'CREATE_POPUP',
	CLOSE_POPUP: 'CLOSE_POPUP',
	SET_VISIBILITY: 'SET_VISIBILITY',
};

const initialState = [];

const reducer = (popups, action) => {
	switch (action.type) {
		case types.CREATE_POPUP:
			return [...popups, { ...action.payload, isVisible: true }];
		case types.CLOSE_POPUP:
			return [
				...popups.slice(0, action.index),
				...popups.slice(action.index + 1, popups.length),
			];
		case types.SET_VISIBILITY:
			const popup = popups[action.index];
			popup.isVisible = action.isVisible;
			const newPopups = [
				...popups.slice(0, action.index),
				popup,
				...popups.slice(action.index + 1, popups.length),
			];
			return newPopups;
		default:
			return popups;
	}
};

export const PopupContext = createContext(initialState);

export default function Provider({ children }) {
	const [popups, dispatch] = useReducer(reducer, initialState);

	const actions = {
		createPopup: payload => {
			dispatch({
				type: types.CREATE_POPUP,
				payload,
			});
			return popups.length;
		},
		closePopup: index => {
			dispatch({
				type: types.SET_VISIBILITY,
				index,
				isVisible: false,
			});
			setTimeout(() => {
				dispatch({
					type: types.CLOSE_POPUP,
					index,
				});
			}, 200);
		},
	};

	return (
		<PopupContext.Provider value={[popups, actions]}>
			{children}
		</PopupContext.Provider>
	);
}
