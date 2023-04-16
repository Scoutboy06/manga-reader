import Image from 'next/image';
import styles from './Horizontal.module.css';
import Link from 'next/link';
import { Chapter } from '@/types/Manga';
import relativeTimeString from '@/lib/relativeTimeString';

interface Props {
	title: string;
	urlName: string;
	image: string;
	chapters: Chapter[];
}

export default function Horizontal({ title, urlName, image, chapters }: Props) {
	return (
		<div className={styles.card}>
			<Link href={`/mangas/${urlName}`} className={styles.imageContainer}>
				<Image src={image} width={100} height={150} alt={title} />
				<div className={styles.overlayContainer}></div>
			</Link>

			<div className={styles.body}>
				<Link href={`/mangas/${urlName}`} className={styles.title}>
					{title}
				</Link>

				<div className={styles.chapters}>
					{chapters.map(chapter => (
						<Link
							href={`/mangas/${urlName}/${chapter.urlName}`}
							className={styles.chapter}
							key={[urlName, chapter.urlName].join('_')}
						>
							<span
								className={styles.chapterTitle}
							>{`Chap ${chapter.number}`}</span>
							<span className={styles.dateAdded}>
								{relativeTimeString(new Date(chapter.dateAdded))}
							</span>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
