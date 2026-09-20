import { FC, ReactNode } from 'react';
import { useIsMobile, useModalLayout } from '../../../..';
import { Drawer, Dialog } from '@chakra-ui/react';

type MenuModalHeaderProps = {
	children: ReactNode;
	description?: string;
	[key: string]: any;
};

// Padding sets the header height. The old fixed 52px fought the 24px padding
// beside it and clipped anything that wrapped.
const headerCss = {
	px: { base: 4, md: 6 },
	pt: { base: 4, md: 5 },
	pb: { base: 3, md: 4 },
	gap: 1,
	flexDir: 'column' as const,
	alignItems: 'flex-start' as const,
};

const titleCss = {
	color: 'text.light',
	_dark: { color: 'text.dark' },
	fontWeight: '600',
	fontSize: '16px',
	letterSpacing: '-0.01em',
	lineHeight: '1.4',
	pr: 8, // clear of the close button
};

const descriptionCss = {
	color: 'fg.muted',
	fontSize: '13px',
	lineHeight: '1.5',
	fontWeight: '400',
};

const MenuModalHeader: FC<MenuModalHeaderProps> = ({ children, description, ...props }) => {
	const isMobile = useIsMobile();
	const layout = useModalLayout();

	if (isMobile || layout === 'drawer') {
		return (
			<Drawer.Header {...headerCss}>
				<Drawer.Title {...titleCss}>{children}</Drawer.Title>
				{description && <Drawer.Description {...descriptionCss}>{description}</Drawer.Description>}
			</Drawer.Header>
		);
	}

	return (
		<Dialog.Header
			{...headerCss}
			{...props}>
			<Dialog.Title {...titleCss}>{children}</Dialog.Title>
			{description && <Dialog.Description {...descriptionCss}>{description}</Dialog.Description>}
		</Dialog.Header>
	);
};

export default MenuModalHeader;
