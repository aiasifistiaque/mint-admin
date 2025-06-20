import { StatProps, Stat } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';
import { shadow, radius } from '../..';
import Link from 'next/link';

type StatContainerProps = StatProps & {
	/** Optional href for making the stat container clickable */
	href?: string;
	/** Content to be rendered inside the stat container */
	children: ReactNode;
};

/**
 * A styled container for statistics that can optionally be a clickable link
 *
 * @param children - The content to display inside the container
 * @param href - Optional URL to make the container clickable
 * @param props - Additional Chakra UI Stat props
 */

const StatContainer: FC<StatContainerProps> = ({ children, href, ...props }) => {
	// Conditionally add link props only when href is provided
	const linkProps = href ? { as: Link, href, cursor: 'pointer' } : {};
	return (
		<Stat
			{...linkProps}
			{...containerStyles}
			{...props}>
			{children}
		</Stat>
	);
};

/**
 * Styling configuration for the stat container
 * Provides consistent design across light and dark modes
 */
const containerStyles: StatProps = {
	borderRadius: radius.CONTAINER,
	alignItems: 'center',
	w: 'full',
	p: 4,
	bg: 'container.newLight',
	borderColor: 'container.borderLight',
	borderWidth: 1,
	boxShadow: shadow?.DASH,
	_dark: {
		bg: 'menu.dark',
		borderColor: 'container.borderDark',
	},
};

export default StatContainer;
