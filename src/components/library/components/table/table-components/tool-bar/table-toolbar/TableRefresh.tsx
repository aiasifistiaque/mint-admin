import { Button, IconButton, Tooltip } from '@chakra-ui/react';
import { TbRefresh } from 'react-icons/tb';
import { useAppDispatch, refresh, radius, sizes } from '../../../../..';

const TableRefresh = () => {
	const dispatch = useAppDispatch();

	const onReset = () => {
		dispatch(refresh());
	};

	return (
		<Tooltip
			label='Refresh'
			placement='top'>
			<IconButton
				aria-label='Refresh'
				h={sizes.SEARCH_BAR_HEIGHT}
				w={sizes.SEARCH_BAR_HEIGHT}
				size='md'
				borderRadius={radius?.BUTTON}
				onClick={onReset}
				colorScheme='gray'
				borderWidth={1}
				_light={{
					borderColor: 'container.borderLight',
					bg: 'container.newLight',
				}}
				icon={<TbRefresh />}
			/>
		</Tooltip>
	);
};

export default TableRefresh;
