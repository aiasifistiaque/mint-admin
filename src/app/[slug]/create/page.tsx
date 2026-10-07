'use client';

import { use } from 'react';
import { NextPage } from 'next';
import CreateRecordPage from '@/components/library/pages/CreateRecordPage';

/** A route's "add a record" page — /<route>/create (createPath), for an add button set to open a page. */
const CreatePage: NextPage<any> = ({ params }) => {
	const { slug }: any = use(params);
	return <CreateRecordPage route={slug} />;
};

export default CreatePage;
