import { FlexChild } from '../../..';
import { Flex } from '@chakra-ui/react';
import React, { FC } from 'react';
import CategoriesCard from './CategoryCard';

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
		slidesPerView: 5,
	},
};

const CardContainer: FC<FlexChild & { data: any }> = ({ children, data, ...props }) => {
	return (
		<Flex
			py={8}
			w='full'
			as={Swiper}
			pagination={{
				clickable: true,
			}}
			scrollbar={{ draggable: true }}
			modules={[Pagination]}
			spaceBetween={20}
			breakpoints={swiperBreakpoints}>
			{data.map((item: any, i: number) => (
				<SwiperSlide key={i}>
					<CategoriesCard
						src={item?.src}
						name={item?.name}
						qty={item?.qty}
					/>
				</SwiperSlide>
			))}
		</Flex>
	);
};

export default CardContainer;
