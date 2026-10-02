'use client';

import { FC, ReactNode } from 'react';
import { Badge, Box, Text } from '@chakra-ui/react';
import type { TicketStatus } from '@/components/library';

/** How each status reads to the person who opened the ticket. */
export const STATUS: Record<TicketStatus, { label: string; color: string }> = {
	open: { label: 'Open', color: 'blue' },
	'in-progress': { label: 'In progress', color: 'orange' },
	waiting: { label: 'Awaiting your reply', color: 'purple' },
	resolved: { label: 'Resolved', color: 'green' },
	closed: { label: 'Closed', color: 'gray' },
};

/** The team's wording for `waiting` — it waits on the requester, not on them. */
export const STAFF_STATUS_LABEL: Record<TicketStatus, string> = {
	open: 'Open',
	'in-progress': 'In progress',
	waiting: 'Waiting on requester',
	resolved: 'Resolved',
	closed: 'Closed',
};

export const CATEGORIES = [
	{ value: 'question', label: 'Question' },
	{ value: 'account', label: 'Account & access' },
	{ value: 'billing', label: 'Billing' },
	{ value: 'bug', label: 'Something broken' },
	{ value: 'feature', label: 'Feature request' },
	{ value: 'other', label: 'Other' },
];

export const categoryLabel = (v?: string) => CATEGORIES.find(c => c.value === v)?.label || 'Question';

export const PRIORITIES = [
	{ value: 'low', label: 'Low' },
	{ value: 'normal', label: 'Normal' },
	{ value: 'high', label: 'High' },
];

export const StatusBadge: FC<{ status: TicketStatus; staff?: boolean }> = ({ status, staff }) => (
	<Badge
		size='sm'
		colorPalette={STATUS[status]?.color || 'gray'}
		flexShrink={0}>
		{staff ? STAFF_STATUS_LABEL[status] : STATUS[status]?.label || status}
	</Badge>
);

export const dayTime = (iso?: string) =>
	iso
		? new Date(iso).toLocaleString(undefined, {
				day: 'numeric',
				month: 'short',
				year: 'numeric',
				hour: 'numeric',
				minute: '2-digit',
			})
		: '';

export const day = (iso?: string) =>
	iso ? new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '';

/** A form label with an optional hint and required mark. */
export const FieldLabel: FC<{ children: ReactNode; hint?: string; required?: boolean }> = ({
	children,
	hint,
	required,
}) => (
	<Box mb={1.5}>
		<Text
			fontSize='13px'
			fontWeight='500'>
			{children}
			{required && (
				<Text
					as='span'
					color='red.fg'
					ml={0.5}>
					*
				</Text>
			)}
		</Text>
		{hint && (
			<Text
				fontSize='12px'
				color='fg.muted'>
				{hint}
			</Text>
		)}
	</Box>
);
