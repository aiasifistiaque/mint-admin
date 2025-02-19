'use client';
import React from 'react';
import { NextPage } from 'next';
import { FormLayout, BackendPageTable, BackendTableObjectProps } from '@/components/library';

const viewFields = [
	'name',
	'agenda',
	'description',
	'priority',
	'tags',
	'host',
	'invitees',
	'date',
	'scheduledTime',
	'duration',
	'startTime',
	'endTime',
	'externalCalendarId',
	'status',
	'rescheduleReason',
	'cancelReason',
	'meetingType',
	'location',
	'map',
	'platform',
	'meetingUrl',
	'meetingId',
	'meetingPassword',
	'note',
	'participants',
	'file',
	'fileUrl',
	'recordingUrl',
	'addedBy',
	'access',
	'createdAt',
];

const formLayout: FormLayout = [
	{
		sectionTitle: 'Meeting Details',
		fields: ['name', ['date', 'scheduledTime'], ['priority', 'status'], 'tags', 'agenda'],
	},
	{
		sectionTitle: 'Meeting Type & Location',
		fields: [
			'meetingType',
			['location', 'map'],
			['platform', 'meetingUrl'],
			['meetingId', 'meetingPassword'],
		],
	},
	{
		sectionTitle: 'Client/Project/Lead',
		description:
			'Client is the person who is responsible for the meeting. Project is the project related to the meeting. Lead is the lead related to the meeting. ',
		fields: [['client', 'project'], 'lead'],
	},
	{
		sectionTitle: 'Access',
		description: 'Access is the permission to view or edit the meeting. ',
		fields: ['access'],
	},
	{
		sectionTitle: 'Host & Invitees',
		description:
			'Host is the person who is responsible for the meeting. Invitees are the people who are invited to the meeting. ',
		fields: ['host', 'invitees'],
	},

	{
		sectionTitle: 'Cancel Or Reschedule',
		fields: ['rescheduleReason', 'cancelReason'],
	},
	{
		sectionTitle: 'External Integration',
		fields: ['externalCalendarId'],
	},

	{
		sectionTitle: 'Note & Participants',
		description:
			'Note is the additional information about the meeting. Participants are the people who participated in the meeting. ',
		fields: ['note', 'participants'],
	},

	{
		sectionTitle: 'Attachments & Recording',
		fields: ['file', 'fileUrl', 'recordingUrl'],
	},
];

const table: BackendTableObjectProps = {
	title: 'Meeting',
	path: 'meetings',
	export: true,

	button: {
		title: 'New Meeting',
		isModal: true,
		layout: formLayout,
	},
	fields: [
		'name',
		'priority',
		'date',
		'scheduledTime',
		'meetingType',
		'status',
		'meetingUrl',
		'meetingId',
		'addedBy',
	],

	menu: [
		{ type: 'view-modal', title: 'View', fields: viewFields },
		{ type: 'view-item', title: 'Go To Post' },

		{
			type: 'edit-modal',
			title: 'Edit',
			layout: formLayout,
		},

		{ type: 'delete', title: 'Delete' },
	],
};

const BrandPage: NextPage = () => {
	return <BackendPageTable table={table} />;
};

export default BrandPage;
