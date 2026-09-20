import { FC, ReactNode } from 'react';
import { useIsMobile } from '../../../..';
import { Drawer, Dialog } from '@chakra-ui/react';
import { useResolvedModalLayout } from './ModalLayoutContext';

type MenuModalFooterProps = {
	children: ReactNode;
	[key: string]: any;
};

// The footer is a quiet ledge under the body: a hairline, a tinted surface and
// enough room that the buttons aren't pinned to the edge.
const footerCss = {
	w: 'full',
	gap: 2,
	px: { base: 4, md: 6 },
	py: 3,
	borderTopWidth: 1,
	borderColor: 'border.muted',
	bg: 'bg.subtle',
	justifyContent: 'flex-end',
	alignItems: 'center',
};

const MenuModalFooter: FC<MenuModalFooterProps> = ({ children, ...props }) => {
	const isMobile = useIsMobile();
	const layout = useResolvedModalLayout();

	if (layout === 'drawer') {
		return (
			<Drawer.Footer
				{...footerCss}
				{...(isMobile ? { pb: 5 } : {})}
				{...props}>
				{children}
			</Drawer.Footer>
		);
	}

	return (
		<Dialog.Footer
			{...footerCss}
			{...props}>
			{children}
		</Dialog.Footer>
	);
};

export default MenuModalFooter;
