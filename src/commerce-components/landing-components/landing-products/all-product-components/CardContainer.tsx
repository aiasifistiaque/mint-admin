import { FlexChild } from '../../..';
import { Flex } from '@chakra-ui/react';
import React, { FC } from 'react';
import Card from './ProductCard';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

import { Pagination } from 'swiper/modules';

const swiperBreakpoints = {
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

const CardContainer: FC<FlexChild & { data: any }> = ({ children, data, ...props }) => {
	return (
		<
			// as={Swiper}
			// pagination={{
			// 	clickable: true,
			// }}
			// scrollbar={{ draggable: true }}
			// modules={[Pagination]}
			// spaceBetween={20}
			// breakpoints={swiperBreakpoints}
		>
			{data.map((item: any, i: number) => (
				<SwiperSlide key={i}>
					<Card {...item} />
				</SwiperSlide>
			))}
		</>
	);
};

export default CardContainer;
