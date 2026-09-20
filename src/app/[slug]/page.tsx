'use client';
import React from 'react';
import { NextPage } from 'next';
import { ServerPage } from '@/components/library';
import { use } from 'react';

// `params` is a promise in Next 15, and this is a client component — so it gets
// unwrapped with `use()`, not `await`. An `async` client component is not a
// thing React supports: it made this page suspend on a promise React had no way
// to cache, which is what the "uncached promise" warning was about.
const FilePage: NextPage<any> = ({ params }) => {
	const { slug }: any = use(params);

	return <ServerPage route={slug} />;
};

export default FilePage;
