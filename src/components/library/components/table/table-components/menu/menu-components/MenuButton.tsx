import { IconButton } from '@chakra-ui/react';
import { Icon, useIsMobile } from '../../../../..';

/**
 * The per-row actions trigger. It stays quiet until you reach for it: no
 * border or fill at rest, a soft round target on hover. A bordered box on every
 * row drew a column of little chips down the table and competed with the data.
 */
const MenuButton = ({ ...props }: any) => {
	const isMobile = useIsMobile();

	return (
		<IconButton
			aria-label='Row actions'
			variant='ghost'
			size='sm'
			boxSize={isMobile ? '32px' : '28px'}
			minW={isMobile ? '32px' : '28px'}
			borderRadius='full'
			color='fg.subtle'
			bg='transparent'
			transitionProperty='background-color, color'
			transitionDuration='120ms'
			_hover={{ bg: 'bg.muted', color: 'fg' }}
			_active={{ bg: 'bg.emphasized' }}
			_expanded={{ bg: 'bg.emphasized', color: 'fg' }}
			css={isMobile ? { position: 'absolute', right: '8px', top: '8px' } : {}}
			{...props}>
			<Icon
				name='dots'
				size={isMobile ? 18 : 16}
			/>
		</IconButton>
	);
};

export default MenuButton;
