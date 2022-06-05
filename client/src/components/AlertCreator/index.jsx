import { useContext, useEffect, useRef } from 'react';

import { AlertContext } from '../../contexts/AlertContext';

import styles from './index.module.css';

export default function AlertCreator() {
	/*
	Alert:
		text: String
		(optional) actionText: string
		(optional) onAction: function,
		(optional) onClose: function,
		(optional) timeout: number (4s - 10s)
	*/

	const [alerts, alertActions] = useContext(AlertContext);
	const currentAlertId = useRef();

	useEffect(() => {
		if (alerts.length === 0) return;
		if (alerts[0].id === currentAlertId.current) return;

		const alert = alerts[0];

		currentAlertId.current = alert.id;
		setTimeout(() => {
			alertActions.closeAlert(0);
		}, alert.timeout || 4000);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [alerts]);

	if (alerts.length === 0) return null;

	const alert = alerts[0];

	return (
		<div
			className={[
				styles.alert,
				alert.actionText ? styles.hasAction : '',
				alert.isVisible ? 'visible' : '',
			].join(' ')}
		>
			<p className={styles.text}>{alert.text}</p>

			{alert.actionText && (
				<button className={styles.actionButton} onClick={alert.onAction}>
					{alert.actionText}
				</button>
			)}
		</div>
	);
}
