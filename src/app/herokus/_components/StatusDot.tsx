'use client';

import { FC } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

export type StatusTone = 'running' | 'idle' | 'pending' | 'failed' | 'maintenance';

/**
 * Status is a dot and a word, not a filled badge.
 *
 * A table of twenty apps with twenty coloured pills reads as decoration and
 * nothing stands out. An 8px dot carries the same information at a fraction of
 * the visual weight, which is what lets the one genuinely bad row catch the eye.
 */
const TONE_COLOR: Record<StatusTone, string> = {
	running: 'green.500',
	idle: 'fg.subtle',
	pending: 'orange.400',
	failed: 'red.500',
	maintenance: 'blue.400',
};

/** Heroku's vocabulary is inconsistent across resources — map it in one place. */
export const toneFor = (value?: string | null): StatusTone => {
	const state = String(value || '').toLowerCase();

	if (['up', 'succeeded', 'success', 'active', 'running', 'provisioned'].includes(state))
		return 'running';
	if (['crashed', 'failed', 'error', 'payment-failed'].includes(state)) return 'failed';
	if (['starting', 'restarting', 'pending', 'building', 'provisioning', 'up-pending'].includes(state))
		return 'pending';
	if (['maintenance'].includes(state)) return 'maintenance';

	return 'idle';
};

type StatusDotProps = {
	tone?: StatusTone;
	/** Raw Heroku state; mapped through `toneFor` when `tone` is not given. */
	state?: string | null;
	label?: string;
	showLabel?: boolean;
	/** Hover text — used to surface a raw code behind a friendly label. */
	title?: string;
};

const StatusDot: FC<StatusDotProps> = ({ tone, state, label, showLabel = true, title }) => {
	const resolved = tone || toneFor(state);
	const text = label ?? state ?? resolved;

	return (
		<Flex
			align='center'
			gap={2}
			minW={0}
			title={title}>
			<Box
				w='8px'
				h='8px'
				flexShrink={0}
				borderRadius='full'
				bg={TONE_COLOR[resolved]}
			/>
			{showLabel && (
				<Text
					fontSize='xs'
					color='fg.muted'
					textTransform='capitalize'
					truncate>
					{text}
				</Text>
			)}
		</Flex>
	);
};

export default StatusDot;
