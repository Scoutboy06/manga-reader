import styles from './ProfileButton.module.css';
import Dropdown from '@/components/Dropdown';
import Image from 'next/image';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

interface Props {
	session: Session;
}

export default function NotificationButton({ session }: Props) {
	return (
		<Dropdown placement='br'>
			<Dropdown.Toggle className={styles.button}>
				<Image
					src={session.user.image || ''}
					width={28}
					height={28}
					alt='Profile picture'
				/>
			</Dropdown.Toggle>

			<Dropdown.Menu>
				{session.user.isAdmin && (
					<>
						<Dropdown.Item href='/admin' icon='dashboard'>
							Admin
						</Dropdown.Item>
						<Dropdown.Divider />
					</>
				)}
				<Dropdown.Item onClick={() => signOut()} icon='logout'>
					Log out
				</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	);
}
