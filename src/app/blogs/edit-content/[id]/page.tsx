import { ContentEditorPage } from '@/components/library';
import React from 'react';

const EditBlogContentPage = () => {
	const table = {
		type: 'edit',
		title: 'name',
		path: 'blogs',
		key: 'content',
		fields: [
			{
				name: 'content',
				type: 'editor',
				label: 'Content',
			},
		],
	};
	return <ContentEditorPage data={table} />;
};

export default EditBlogContentPage;
