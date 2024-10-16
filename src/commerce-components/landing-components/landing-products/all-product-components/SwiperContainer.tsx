import { FlexChild } from '../../..';
import { Flex } from '@chakra-ui/react';
import React, { FC } from 'react';

// Import Swiper React components
import { Swiper } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

import { Pagination } from 'swiper/modules';

const common_breakpoints = {
	100: {
		slidesPerView: 1,
	},
	320: {
		slidesPerView: 1,
	},
	480: {
		slidesPerView: 2,
	},
	768: {
		slidesPerView: 3,
	},
	1024: {
		slidesPerView: 4,
	},
};

const SwiperContainer: FC<FlexChild & { breakpoints?: any }> = ({
	children,
	breakpoints,
	...props
}) => {
	return (
		<Flex
			w='full'
			as={Swiper}
			pagination={{
				clickable: true,
			}}
			scrollbar={{ draggable: true }}
			modules={[Pagination]}
			spaceBetween={20}
			breakpoints={breakpoints || common_breakpoints}
			{...props}>
			{children}
		</Flex>
	);
};

export default SwiperContainer;
