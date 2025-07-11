import { IconButton, Tooltip } from '@chakra-ui/react';
import { TbRefresh } from 'react-icons/tb';
import { radius, sizes } from '../../../../../config';
import { refresh } from '../../../../../store';
import { useAppDispatch } from '../../../../../hooks';

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
				ml={0.5}
				_dark={{
					bg: 'container.dark',
				}}
				_light={{
					borderColor: 'container.borderLight',
					bg: 'container.newLight',
				}}
				icon={<TbRefresh size={18} />}
			/>
		</Tooltip>
	);
};

export default TableRefresh;
