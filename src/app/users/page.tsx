'use client';

import React from 'react';
import { NextPage } from 'next';
import { PageTable } from '@/components/library';
import { viewAll as table } from '@/models/admin';

const page: NextPage = () => {
	return <PageTable table={table} />;
};

export default page;
