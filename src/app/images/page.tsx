'use client';
import React from 'react';
import { NextPage } from 'next';
import { ImagePage } from '@/components/library';

const FilePage: NextPage<any> = () => {
	return (
		<ImagePage
			route='images'
			title='All Media'
			// folder='687135fde09e2a40a979761b'
		/>
	);
};

export default FilePage;
