import styles from './NotificationButton.module.css';
import Notification from '@/types/Notification';
import Dropdown from '@/components/Dropdown';
import Image from 'next/image';
import axios from 'axios';
import useSWRImmutable from 'swr/immutable';
import { KeyedMutator } from 'swr';

export default function NotificationButton() {
	const {
		data: notifications,
		mutate,
	}: { data?: Notification[]; mutate: KeyedMutator<any> } = useSWRImmutable(
		'/api/me/notifications'
	);

	const clearNotifications = async () => {
		try {
			const res = await axios.delete('/api/me/notifications');
			if (res.status === 200) mutate();
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Dropdown placement='br'>
			<Dropdown.Toggle className={styles.button}>
				<i className='icon outlined'>notifications</i>
				{notifications && notifications.length > 0 && (
					<span className={styles.count}>{notifications.length}</span>
				)}
			</Dropdown.Toggle>

			<Dropdown.Menu className={styles.dropdown}>
				<div className={styles.content}>
					{notifications !== undefined && notifications.length === 0 ? (
						<p className={styles.emptyText}>No new notifications</p>
					) : (
						notifications?.map((notification, i) => (
							<Dropdown.Item
								key={`notification_${i}`}
								href={notification.action.replace('url:', '')}
								className={styles.item}
								aria-label={notification.title}
							>
								<div className={styles.imageContainer}>
									{notification.image && (
										<Image
											src={notification.image}
											width={40}
											height={60}
											alt='poster'
										/>
									)}
								</div>

								<div className={styles.meta}>
									<h5>{notification.title}</h5>
									<p>{notification.body}</p>
								</div>
							</Dropdown.Item>
						))
					)}
				</div>

				<div className={styles.bottom}>
					<button className='btn btn-sm' onClick={clearNotifications}>
						Clear all
					</button>
				</div>
			</Dropdown.Menu>
		</Dropdown>
	);
}
