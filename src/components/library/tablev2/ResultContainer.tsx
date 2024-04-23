import React, { FC } from 'react';
import { Flex, FlexProps, Text } from '@chakra-ui/react';
import Pagination from './Pagination';
import { sizes } from '@/lib/constants';
import { useAppSelector } from '@/hooks';

type ResultContainerProps = FlexProps & {
	data: any;
};

const ResultContainer: FC<ResultContainerProps> = ({ data, ...props }) => {
	const { selectedItems } = useAppSelector(state => state.table);

	if (selectedItems.length > 0) {
		return null;
	}

	return (
		<Flex sx={{ ...styles.container, ...props }}>
			<Text>
				<b>{data?.totalDocs}</b> results
			</Text>
			<Pagination data={data && data} />
		</Flex>
	);
};

const styles = {
	container: {
		borderTop: '1px solid',
		borderTopColor: 'stroke.deepL',
		alignItems: 'center',
		justifyContent: 'space-between',
		zIndex: 10,
		gap: 4,
		position: 'fixed',
		bottom: 0,
		left: sizes.HOME_NAV_LEFT,
		bg: 'container.light',
		w: sizes.HOME_NAV_MAX_WIDTH,
		_dark: { bg: 'container.dark', borderTopColor: 'stroke.deepD' },
		overflow: 'scroll',
		maxW: '100%',
		px: 8,
		fontSize: '.9rem',
	},
};

export default ResultContainer;