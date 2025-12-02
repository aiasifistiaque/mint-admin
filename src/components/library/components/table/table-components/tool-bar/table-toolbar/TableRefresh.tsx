import { IconButton, Tooltip } from '@chakra-ui/react';
import { radius, sizes } from '../../../../../config';
import { refresh } from '../../../../../store';
import { useAppDispatch } from '../../../../../hooks';
import { updateTable, Icon } from '../../../../..';

const TableRefresh = () => {
	const dispatch = useAppDispatch();

	const onReset = () => {
		dispatch(refresh());
	};

	return (
		<Tooltip.Root positioning={{ placement: 'top' }}>
			<Tooltip.Trigger asChild>
				<IconButton
					aria-label='Refresh'
					h={sizes.SEARCH_BAR_HEIGHT}
					w={sizes.SEARCH_BAR_HEIGHT}
					size='sm'
					borderRadius={radius?.BUTTON}
					onClick={onReset}
					colorPalette='gray'
					borderWidth={1}
					_dark={{
						bg: 'container.dark',
						borderColor: 'container.borderDark',
					}}
					_light={{
						borderColor: 'container.borderLight',
						bg: 'container.newLight',
					}}>
					<Icon
						name='refresh'
						size={14}
					/>
				</IconButton>
			</Tooltip.Trigger>
			<Tooltip.Positioner>
				<Tooltip.Content>Refresh</Tooltip.Content>
			</Tooltip.Positioner>
		</Tooltip.Root>
	);
};

export default TableRefresh;
