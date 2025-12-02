'use client';
import React from 'react';
import { NextPage } from 'next';
import { ServerPage } from '@/components/library';

interface Props {
	params: {
		slug: string;
	};
}

const FilePage: NextPage<any> = async ({ params }) => {
	const { slug } = await params;
	return <ServerPage route={slug} />;
};

export default FilePage;
