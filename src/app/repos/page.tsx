'use client';

import React from 'react';
import { NextPage } from 'next';
import {
	PageTable,
	TableObjectProps,
	convertToViewFields,
	convertToTableFields,
	createFormFields,
} from '@/components/library';
import { projectSchema as schema } from '@/models';
import { formFields, fields, tableFields } from './config';
import { projectHref, platformLabel } from './_components/hosting';

const table: TableObjectProps = {
	title: 'Repo',
	path: 'repos',
	export: true,
	button: {
		title: 'New Repo',
		isModal: true,
		dataModel: createFormFields({ schema, layout: formFields }),
	},
	menu: [
		{
			title: 'Open',
			type: 'view',
		},
		{
			// Straight to the Vercel or Heroku console page for whatever this repo
			// deploys to. Hidden rather than disabled when the repo is not linked:
			// a greyed-out row here would be the only thing in the menu that never
			// becomes clickable from the menu itself.
			title: 'View Project',
			type: 'custom-redirect',
			href: (doc: any) => projectHref(doc) || '#',
			renderCondition: (doc: any) => !!projectHref(doc),
		},
		{
			title: 'Quick View',
			type: 'view-modal',
			dataModel: convertToViewFields({ schema }),
		},
		{
			title: 'Edit',
			type: 'edit-modal',
			dataModel: createFormFields({ schema, layout: formFields }),
		},
		{
			title: 'Delete',
			type: 'delete',
		},
	],
	data: convertToTableFields({ schema, fields }),
};

const page: NextPage = () => {
	return <PageTable table={table} />;
};

export default page;
