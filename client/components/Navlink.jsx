import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navlink({
	children,
	href,
	className,
	subpaths = false,
	...props
}) {
	const router = useRouter();

	const isActive = subpaths
		? router.pathname.startsWith(href)
		: router.pathname === href;

	return (
		<Link
			href={href}
			className={(isActive ? 'active ' : '') + className}
			{...props}
		>
			{children}
		</Link>
	);
}
