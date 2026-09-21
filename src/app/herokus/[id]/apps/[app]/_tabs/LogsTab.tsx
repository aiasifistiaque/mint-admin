'use client';

import { FC, useState } from 'react';
import { Box, Button, Flex, NativeSelect, Text } from '@chakra-ui/react';
import { radius, useGetHerokuLogsQuery } from '@/components/library';
import { Panel, EmptyState, ErrorState, TableSkeleton } from '@/components/library/cl';

const LINE_OPTIONS = [100, 500, 1500];

/**
 * A log line's level, where one is parseable. Heroku prefixes platform lines
 * with `heroku[router]` and the like; application lines are whatever the app
 * printed, so this is a best effort and falls back to plain text.
 */
const toneOf = (line: string): string | undefined => {
	if (/\b(error|fatal|exception|critical)\b/i.test(line)) return 'red.400';
	if (/\b(warn|warning|deprecat)/i.test(line)) return 'orange.400';
	if (/^\d{4}-\d{2}-\d{2}T[\d:.]+\+?\S*\s+heroku\[/i.test(line)) return 'blue.300';
	return undefined;
};

const LogsTab: FC<{ id: string; app: string }> = ({ id, app }) => {
	const [lines, setLines] = useState(100);
	const [source, setSource] = useState('');
	const [dyno, setDyno] = useState('');

	const { data, isFetching, isError, error, refetch } = useGetHerokuLogsQuery({
		id,
		app,
		lines,
		source,
		dyno,
	});

	return (
		<Panel
			flush
			title='Logs'
			subtitle='Applications routinely print tokens and connection strings to stdout — treat anything here as a secret.'
			actions={
				<>
					<NativeSelect.Root size='sm' w='110px'>
						<NativeSelect.Field
							borderRadius={radius.INPUT}
							value={String(lines)}
							onChange={event => setLines(Number(event.target.value))}>
							{LINE_OPTIONS.map(option => (
								<option key={option} value={option}>
									{option} lines
								</option>
							))}
						</NativeSelect.Field>
						<NativeSelect.Indicator />
					</NativeSelect.Root>

					<NativeSelect.Root size='sm' w='130px'>
						<NativeSelect.Field
							borderRadius={radius.INPUT}
							value={source}
							onChange={event => setSource(event.target.value)}>
							<option value=''>All sources</option>
							<option value='app'>Application</option>
							<option value='heroku'>Platform</option>
						</NativeSelect.Field>
						<NativeSelect.Indicator />
					</NativeSelect.Root>

					<Button size='sm' variant='outline' loading={isFetching} onClick={() => refetch()}>
						Refresh
					</Button>
				</>
			}>
			{isFetching && !data ? (
				<TableSkeleton rows={10} cols={1} />
			) : isError ? (
				<ErrorState error={error} onRetry={refetch} />
			) : !data?.lines?.length ? (
				<EmptyState
					title='No log lines'
					description='Nothing has been logged in the window requested. Try more lines, or a different source.'
				/>
			) : (
				<Box
					bg='bg.subtle'
					maxH='600px'
					overflowY='auto'
					px={4}
					py={3}
					// Newest last, matching `heroku logs`, so the freshest line is where
					// the eye already is after scrolling to the bottom.
					fontFamily='mono'
					fontSize='12px'
					lineHeight='1.7'>
					{data.lines.map((line: string, index: number) => (
						<Text
							key={index}
							color={toneOf(line)}
							whiteSpace='pre-wrap'
							wordBreak='break-all'>
							{line}
						</Text>
					))}
				</Box>
			)}
		</Panel>
	);
};

export default LogsTab;
