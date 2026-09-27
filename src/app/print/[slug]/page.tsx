'use client';

import { FC, Suspense, use, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Button, Flex, Text, Theme } from '@chakra-ui/react';
import { Printer, X } from 'lucide-react';
import { AuthWrapper } from '@/components/library';
import useRecordView from '@/components/library/components/view/record/useRecordView';
import RecordOverview from '@/components/library/components/view/record/RecordOverview';

/**
 * /print/<route>?ids=a,b,c — the ticked records laid out for paper, one per
 * page, the way their view page shows them (the table's Print / PDF → "Print
 * view"). The browser's print dialog opens once they've loaded; "Save as PDF"
 * there makes the file. Always light, whatever the admin's colour mode.
 */

const MAX = 200;

const PrintRecord: FC<{ slug: string; id: string; last: boolean; onReady: (id: string) => void }> = ({ slug, id, last, onReady }) => {
	const rv = useRecordView({ slug, id });
	const ready = !!rv.schema && !rv.configuredLoading && !!(rv.name || rv.code || rv.recordTitle);
	useEffect(() => {
		if (ready) onReady(id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ready]);

	return (
		<Box
			as='article'
			css={{ breakAfter: last ? 'auto' : 'page', '@media print': { breakAfter: last ? 'auto' : 'page' } }}
			pb={10}
			mb={10}
			borderBottomWidth={{ base: last ? 0 : '1px', _print: 0 }}
			borderColor='border'>
			<Text
				fontSize='xs'
				color='fg.muted'
				textTransform='uppercase'
				letterSpacing='0.06em'>
				{rv.routeTitle}
			</Text>
			<Text
				fontSize='2xl'
				fontWeight='600'
				lineHeight='1.2'
				mt={1}>
				{rv.name || rv.code || id}
			</Text>
			{rv.name && rv.code && (
				<Text
					fontSize='sm'
					color='fg.muted'
					mt={0.5}>
					{rv.code}
				</Text>
			)}
			<Box mt={5}>
				<RecordOverview
					slug={slug}
					id={id}
					schema={rv.schema}
					moduleData={rv.moduleData}
					configured={rv.configured}
					configuredLoading={rv.configuredLoading}
					configuredFetching={rv.configuredFetching}
				/>
			</Box>
		</Box>
	);
};

const PrintRecords = ({ slug }: { slug: string }) => {
	const search = useSearchParams();
	const ids = (search.get('ids') || '').split(',').filter(Boolean).slice(0, MAX);
	const [ready, setReady] = useState<Set<string>>(new Set());
	const printed = useRef(false);

	// Once every record has loaded (and images had a moment), open the print dialog — once.
	useEffect(() => {
		if (printed.current || !ids.length || ready.size < ids.length) return;
		printed.current = true;
		const t = setTimeout(() => window.print(), 800);
		return () => clearTimeout(t);
	}, [ready.size, ids.length]);

	return (
		<AuthWrapper>
			<Theme
				appearance='light'
				minH='100vh'
				bg='white'
				color='fg'>
				<Flex
					position='sticky'
					top={0}
					zIndex={10}
					align='center'
					justify='space-between'
					gap={3}
					px={6}
					py={3}
					bg='bg.subtle'
					borderBottomWidth='1px'
					borderColor='border'
					css={{ '@media print': { display: 'none' } }}>
					<Text fontSize='sm'>
						{ready.size < ids.length ? `Loading ${ready.size} of ${ids.length}…` : `${ids.length} record${ids.length === 1 ? '' : 's'}, one per page`}
					</Text>
					<Flex gap={2}>
						<Button
							size='xs'
							h='28px'
							px={3}
							variant='outline'
							onClick={() => window.close()}>
							<X size={13} />
							Close
						</Button>
						<Button
							size='xs'
							h='28px'
							px={3}
							onClick={() => window.print()}>
							<Printer size={13} />
							Print / Save as PDF
						</Button>
					</Flex>
				</Flex>
				<Box
					maxW='820px'
					mx='auto'
					px={{ base: 5, md: 8 }}
					py={8}
					css={{ '@media print': { padding: 0, maxWidth: 'none' } }}>
					{!ids.length ? (
						<Text color='fg.muted'>No records to print.</Text>
					) : (
						ids.map((id, i) => (
							<PrintRecord
								key={id}
								slug={slug}
								id={id}
								last={i === ids.length - 1}
								onReady={done => setReady(r => (r.has(done) ? r : new Set(r).add(done)))}
							/>
						))
					)}
				</Box>
			</Theme>
		</AuthWrapper>
	);
};

// useSearchParams needs a Suspense boundary, or the build refuses the page.
const PrintPage = ({ params }: { params: Promise<{ slug: string }> }) => {
	const { slug } = use(params);
	return (
		<Suspense>
			<PrintRecords slug={slug} />
		</Suspense>
	);
};

export default PrintPage;
