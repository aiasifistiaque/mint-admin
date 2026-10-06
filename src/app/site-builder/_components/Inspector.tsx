'use client';

import { FC, memo, useCallback } from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { Trash2 } from 'lucide-react';
import type { SbBlockDef, SbNode } from '@/components/library/store/services/siteBuilderApi';
import { ActionEditor, PropInput, type InputContext } from './PropInputs';
import type { Op } from './tree';
import SiteGuide from './SiteGuide';

/**
 * The selected block's settings (docs/site-builder SB-05): its props from the
 * manifest, and what it does when clicked. Styles arrive with SB-07. Blocks of
 * the shared header and footer are shown, not edited, here.
 */

type Props = {
	node: SbNode | null;
	def: SbBlockDef | null;
	shared: boolean;
	ctx: InputContext;
	theme: string;
	readOnly: boolean;
	apply: (ops: Op[], key?: string) => string | null;
	onRemoved: () => void;
};

const Header: FC<{ title: string; sub?: string }> = ({ title, sub }) => (
	<Flex
		align='center'
		justify='space-between'
		px={3}
		py={2}
		borderBottomWidth='1px'>
		<Box minW={0}>
			<Text
				fontSize='13px'
				fontWeight='600'
				truncate>
				{title}
			</Text>
			{sub && (
				<Text
					fontSize='11.5px'
					color='fg.muted'
					truncate>
					{sub}
				</Text>
			)}
		</Box>
		<SiteGuide section='props' />
	</Flex>
);

const Inspector: FC<Props> = ({ node, def, shared, ctx, theme, readOnly, apply, onRemoved }) => {
	const id = node?.id;
	const setProp = useCallback(
		(key: string, value: any) => {
			if (id) apply([{ op: 'update', id, props: { [key]: value ?? null } }], `${id}:${key}`);
		},
		[id, apply]
	);

	if (!node || !def)
		return (
			<Flex
				direction='column'
				h='full'>
				<Header title='Settings' />
				<Text
					p={3}
					fontSize='12.5px'
					color='fg.muted'
					lineHeight='1.5'>
					Click a block on the page, or in the outline, to change it.
				</Text>
			</Flex>
		);

	const locked = readOnly || shared;
	return (
		<Flex
			direction='column'
			h='full'
			minH={0}>
			<Header
				title={node.name || def.label}
				sub={node.name ? def.label : def.description}
			/>
			<Box
				flex={1}
				overflowY='auto'
				p={3}>
				{shared && (
					<Text
						fontSize='12px'
						color='fg.muted'
						mb={3}
						p={2}
						bg='bg.subtle'
						borderRadius='md'
						lineHeight='1.5'>
						Part of the header or footer every page shares. You’ll edit it from Design, coming next.
					</Text>
				)}
				<Flex
					direction='column'
					gap={3}>
					{def.props.map(p => (
						<PropInput
							key={`${node.id}:${p.key}`}
							def={p}
							value={node.props?.[p.key]}
							ctx={ctx}
							theme={theme}
							readOnly={locked}
							onChange={v => setProp(p.key, v)}
						/>
					))}
					{!def.props.length && (
						<Text
							fontSize='12px'
							color='fg.muted'>
							This block has no settings of its own.
						</Text>
					)}
				</Flex>
				{def.actions && (
					<Box
						mt={4}
						pt={3}
						borderTopWidth='1px'>
						<ActionEditor
							node={node}
							ctx={ctx}
							readOnly={locked}
							onChange={action => apply([{ op: 'update', id: node.id, action: action ?? null }], `${node.id}:action`)}
						/>
					</Box>
				)}
				{!locked && (
					<Button
						mt={6}
						size='xs'
						variant='ghost'
						colorPalette='red'
						disabled={!!node.locked}
						title={node.locked ? 'Unlock it in the outline first' : undefined}
						onClick={() => {
							if (!apply([{ op: 'remove', id: node.id }])) onRemoved();
						}}>
						<Trash2 size={12} /> Remove block
					</Button>
				)}
			</Box>
		</Flex>
	);
};

export default memo(Inspector);
