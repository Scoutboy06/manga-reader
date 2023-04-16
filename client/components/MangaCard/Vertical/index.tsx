import Image from 'next/image';
import styles from './Vertical.module.css';
import Link from 'next/link';

interface Props {
	href: string;
	titleHref?: string;
	image: string;
	title: string;
	subtitle?: string;
}

export default function Vertical({
	href,
	titleHref,
	image,
	title,
	subtitle,
}: Props) {
	return (
		<div className={styles.card}>
			<Link href={href} className={styles.imageContainer}>
				<Image src={image} width={200} height={300} alt={title} />

				<div className={styles.overlayContainer}></div>
			</Link>

			<div className={styles.cardBody}>
				{titleHref ? (
					<Link className={styles.title} href={titleHref}>
						{title}
					</Link>
				) : (
					<span className={styles.title}>{title}</span>
				)}

				{subtitle && <p className={styles.subtitle}>{subtitle}</p>}
			</div>
		</div>
	);
}
