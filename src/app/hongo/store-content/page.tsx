'use client';
import { LayoutSuspense } from '@/components/library';
import { useGetContentQuery } from '@/components/library/store/services/contentApi';
import { Button, Link } from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import { StoreConfig, storeData } from './_components';

const HomeContentPage = () => {
	const { data, isLoading } = useGetContentQuery({});

	return (
		<LayoutSuspense
			isLoading={isLoading || !data}
			path='/store-content'
			title='Store Content'>
			<Link
				isExternal
				href={process.env.NEXT_PUBLIC_ECOM}>
				<Button>Preview</Button>
			</Link>

			<StoreConfig
				content={data?.basic}
				dataModel={storeData}
			/>
		</LayoutSuspense>
	);
};

export default HomeContentPage;
