import styles from './Loader.module.css';

export default function Loader({ size, style }) {
	return (
		// <div className={styles.lds_spinner} style={{ height: size, width: size }}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
		<div
			className={styles.lds_spinner}
			style={{
				...style,
				transform: `scale(${size / 80}) ${
					style?.transform ? style.transform : ''
				}`,
			}}
		>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	);
}
