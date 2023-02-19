import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navlink({ children, href, className, ...props }) {
	const router = useRouter();

	return (
		<Link
			href={href}
			className={(router.pathname === href ? 'active ' : '') + className}
			{...props}
		>
			{children}
		</Link>
	);
}
