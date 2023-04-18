import { Types } from 'mongoose';
import styles from './ReorderableList.module.css';

interface Item {
	title: string;
	_id: Types.ObjectId | string;
	[key: string]: any;
}

interface Props {
	items: Item[];
	remove: (_id: Item['_id']) => void;
	swap: (index1: number, index2: number) => void;
	className?: string;
}

export default function ReorderableList({
	items,
	remove,
	swap,
	className,
}: Props) {
	return (
		<div className={[styles.container, className].join(' ')}>
			{items.map((item, i) => (
				<div className={styles.item} key={item._id + ''}>
					<p>{item.title}</p>

					<div>
						<button
							className={[
								styles.actionBtn,
								'icon',
								i === 0 ? 'hidden' : '',
							].join(' ')}
							onClick={() => swap(i, i - 1)}
						>
							keyboard_arrow_up
						</button>
						<button
							className={[
								styles.actionBtn,
								'icon',
								i === items.length - 1 ? 'hidden' : '',
							].join(' ')}
							onClick={() => swap(i, i + 1)}
						>
							keyboard_arrow_down
						</button>
						<button
							className={[styles.actionBtn, 'icon'].join(' ')}
							onClick={() => remove(item._id)}
						>
							delete
						</button>
					</div>
				</div>
			))}
		</div>
	);
}
