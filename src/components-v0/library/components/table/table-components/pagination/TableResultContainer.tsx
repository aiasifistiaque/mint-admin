import React, { FC } from 'react';
import { Flex, FlexProps, Text, useColorModeValue } from '@chakra-ui/react';

import { useIsMobile, useAppSelector, Pagination, THEME, SpaceBetween } from '../../../..';

type ResultContainerProps = FlexProps & {
	data: any;
};

const TableResultContainer: FC<ResultContainerProps> = ({ data, ...props }) => {
	const { selectedItems } = useAppSelector(state => state.table);
	const isMobile = useIsMobile();

	const bg = useColorModeValue('container.light', 'container.dark');
	const borderColor = useColorModeValue('stroke.deepL', 'stroke.deepD');
	const sidebarColor = useColorModeValue('sidebar.light', 'sidebar.dark');

	if (selectedItems.length > 0) {
		return null;
	}

	return (
		<Flex
			bg={sidebarColor}
			pl={{ base: 0, md: THEME == 'basic' ? 0 : 4 }}
			sx={{
				...styles.container,
				pb: isMobile ? 4 : 0,
				...props,
			}}>
			<SpaceBetween
				px={4}
				gap={4}
				w='100%'
				bg={bg}
				borderBottom='1px solid'
				borderBottomColor={borderColor}>
				<Text>
					<b>{data?.totalDocs || '--'}</b> results
				</Text>

				<Pagination
					data={data && data}
					showPerPage={false}
				/>
			</SpaceBetween>
		</Flex>
	);
};

const styles = {
	container: {
		overflow: 'scroll',
		maxW: '100%',
		fontSize: '.9rem',
	},
};

export default TableResultContainer;
