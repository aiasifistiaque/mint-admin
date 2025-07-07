'use client';

import VTableMenu from '@/components/library/utils/inputs/section/VTableMenu/VTableMenu';
import { Center } from '@chakra-ui/react';
import React from 'react';

type Props = {};

const page = () => {
	return (
		<Center
			flex={1}
			w='100vw'
			h='100vh'>
			<VTableMenu
				value={'..'}
				name='table'
				onChange={() => {}}
			/>
		</Center>
	);
};

export default page;
