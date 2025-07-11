'use client';
import React from 'react';
import { NextPage } from 'next';
import { ImagePage } from '@/components/library';
import { use } from 'react';

const FilePage: NextPage<any> = ({ params }) => {
	const resolvedParams: any = use(params);

	return (
		<ImagePage
			route='images'
			title='All Media'
			folder={resolvedParams.id}
		/>
	);
};

export default FilePage;
