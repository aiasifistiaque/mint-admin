'use client';
import React from 'react';
import { NextPage } from 'next';
import { ImagePage } from '@/components/library';

const FilePage: NextPage<any> = () => {
	return <ImagePage route='images' />;
};

export default FilePage;
