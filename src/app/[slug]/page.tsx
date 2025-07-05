'use client';
import React from 'react';
import { NextPage } from 'next';
import { ServerPage } from '@/components/library';

interface Props {
	params: {
		slug: string;
	};
}

const FilePage: NextPage<any> = ({ params }) => {
	const { slug } = params;
	return <ServerPage route={slug} />;
};

export default FilePage;
