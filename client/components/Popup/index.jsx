import styles from './Popup.module.css';
import { useState, useEffect, useRef } from 'react';

export default function Popup({
	children,
	visible = true,
	close = () => {},
	unmountOnClose = true,
}) {
	const [show, setShow] = useState(visible);
	const timeout = useRef();

	useEffect(() => {
		clearTimeout(timeout.current);
		if (visible) setShow(true);
		else setTimeout(() => setShow(visible), 200);
	}, [visible]);

	if (!show && unmountOnClose) return null;

	return (
		<>
			<div
				className={styles.background}
				onClick={close}
				data-visible={visible}
			></div>
			<div className={styles.popup} data-visible={visible}>
				<button className={styles.closeBtn + ' icon'} onClick={close}>
					close
				</button>
				{children}
			</div>
		</>
	);
}
