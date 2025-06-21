import { FC } from 'react';
import { Flex, FlexProps, Text } from '@chakra-ui/react';

import { useIsMobile, useAppSelector } from '../../../../hooks';
import { sizes, Pagination, THEME, styles as style } from '../../../..';

type ResultContainerProps = FlexProps & {
	data: any;
};

const ResultContainer: FC<ResultContainerProps> = ({ data, ...props }) => {
	const { selectedItems } = useAppSelector(state => state.table);
	const isMobile = useIsMobile();

	if (selectedItems.length > 0) {
		return null;
	}

	return (
		<Flex
			sx={{
				...styles.container,
				left: isMobile ? 0 : sizes.HOME_NAV_LEFT,
				w: isMobile ? '100vw' : sizes.HOME_NAV_MAX_WIDTH,
				// pb: isMobile ? 4 : 0,
				...props,
			}}
			bg='result.bg.light'
			borderTop='1px solid'
			backdropFilter='blur(10px)'
			borderTopColor='result.border.light'
			_dark={{ bg: 'result.bg.dark', borderTopColor: 'result.border.dark' }}
			pl={{ base: 0, md: THEME == 'basic' ? 0 : 4 }}>
			<Flex
				px={4}
				pl={6}
				backdropFilter={style.BACKDROP_FILTER}
				align='center'
				justify='space-between'
				gap={4}
				w='100%'>
				<Text>
					<b>{data?.totalDocs || '--'}</b> Results
				</Text>

				<Pagination data={data && data} />
			</Flex>
		</Flex>
	);
};

const styles = {
	container: {
		position: 'fixed',
		bottom: 0,
		overflow: 'scroll',
		maxW: '100%',
		fontSize: '.9rem',
	},
};

export default ResultContainer;
