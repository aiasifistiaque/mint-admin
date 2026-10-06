'use client';

import { FC, memo, ReactNode } from 'react';
import { Badge, Box, Button, Flex, IconButton, Menu, Portal, Skeleton, Text } from '@chakra-ui/react';
import { Copy, EyeOff, Home, MoreHorizontal, Plus, RotateCcw, Settings2, Trash2 } from 'lucide-react';
import type { SbPageSummary } from '@/components/library/store/services/siteBuilderApi';
import SiteGuide from './SiteGuide';

/**
 * The site's pages (docs/site-builder SB-05): open one, add one, and each
 * page's settings, home, duplicate, take off the site, delete. The chip says
 * where it stands: a draft never published, live, live with changes, or off.
 */

export type PageAction = 'settings' | 'home' | 'duplicate' | 'unpublish' | 'republish' | 'delete';

type Props = {
	pages: SbPageSummary[] | undefined;
	currentId: string | null;
	readOnly: boolean;
	onOpen: (id: string) => void;
	onAdd: () => void;
	onAction: (page: SbPageSummary, action: PageAction) => void;
};

export const StatusChip: FC<{ page: Pick<SbPageSummary, 'status' | 'changed'> }> = ({ page }) => {
	const [label, palette] =
		page.status === 'unpublished' ? ['Off the site', 'gray'] : page.status === 'draft' ? ['Draft', 'orange'] : page.changed ? ['Changed', 'blue'] : ['Live', 'green'];
	return (
		<Badge
			size='xs'
			variant='subtle'
			colorPalette={palette}>
			{label}
		</Badge>
	);
};

const Item: FC<{ value: string; onClick: () => void; children: ReactNode; danger?: boolean; disabled?: boolean }> = ({ value, onClick, children, danger, disabled }) => (
	<Menu.Item
		value={value}
		disabled={disabled}
		color={danger ? 'red.fg' : undefined}
		onClick={onClick}>
		{children}
	</Menu.Item>
);

const PagesPanel: FC<Props> = ({ pages, currentId, readOnly, onOpen, onAdd, onAction }) => (
	<Flex
		direction='column'
		h='full'
		minH={0}>
		<Flex
			align='center'
			justify='space-between'
			px={3}
			py={2}
			borderBottomWidth='1px'>
			<Text
				fontSize='13px'
				fontWeight='600'>
				Pages
			</Text>
			<Flex
				gap={1}
				align='center'>
				<SiteGuide section='pages' />
				{!readOnly && (
					<Button
						size='2xs'
						variant='outline'
						onClick={onAdd}>
						<Plus size={12} /> Add
					</Button>
				)}
			</Flex>
		</Flex>
		<Box
			flex={1}
			overflowY='auto'
			py={1}>
			{!pages ? (
				<Flex
					direction='column'
					gap={2}
					p={3}>
					<Skeleton h='32px' />
					<Skeleton h='32px' />
				</Flex>
			) : (
				pages.map(p => (
					<Flex
						key={p.id}
						align='center'
						gap={2}
						px={3}
						py={1.5}
						cursor='pointer'
						bg={p.id === currentId ? 'blue.subtle' : undefined}
						_hover={{ bg: p.id === currentId ? 'blue.subtle' : 'bg.muted' }}
						onClick={() => onOpen(p.id)}>
						<Box
							flex={1}
							minW={0}>
							<Flex
								align='center'
								gap={1.5}>
								{p.isHome && <Home size={12} />}
								<Text
									fontSize='12.5px'
									fontWeight={p.id === currentId ? '600' : '500'}
									truncate>
									{p.name}
								</Text>
							</Flex>
							<Text
								fontSize='11.5px'
								color='fg.muted'
								truncate
								fontFamily='mono'>
								{p.path}
							</Text>
						</Box>
						<StatusChip page={p} />
						{!readOnly && (
							<Menu.Root positioning={{ placement: 'bottom-end' }}>
								<Menu.Trigger asChild>
									<IconButton
										size='2xs'
										variant='ghost'
										aria-label={`${p.name}: actions`}
										onClick={e => e.stopPropagation()}>
										<MoreHorizontal size={13} />
									</IconButton>
								</Menu.Trigger>
								<Portal>
									<Menu.Positioner>
										<Menu.Content
											minW='190px'
											onClick={e => e.stopPropagation()}>
											<Item
												value='settings'
												onClick={() => onAction(p, 'settings')}>
												<Settings2 size={13} /> Name, address & SEO
											</Item>
											<Item
												value='home'
												disabled={p.isHome || p.kind === 'template'}
												onClick={() => onAction(p, 'home')}>
												<Home size={13} /> Make it the home page
											</Item>
											<Item
												value='duplicate'
												onClick={() => onAction(p, 'duplicate')}>
												<Copy size={13} /> Duplicate
											</Item>
											{p.status === 'unpublished' ? (
												<Item
													value='republish'
													onClick={() => onAction(p, 'republish')}>
													<RotateCcw size={13} /> Put back on the site
												</Item>
											) : (
												<Item
													value='unpublish'
													disabled={p.isHome || p.status === 'draft'}
													onClick={() => onAction(p, 'unpublish')}>
													<EyeOff size={13} /> Take off the site
												</Item>
											)}
											<Menu.Separator />
											<Item
												value='delete'
												danger
												disabled={p.isHome}
												onClick={() => onAction(p, 'delete')}>
												<Trash2 size={13} /> Delete
											</Item>
										</Menu.Content>
									</Menu.Positioner>
								</Portal>
							</Menu.Root>
						)}
					</Flex>
				))
			)}
		</Box>
	</Flex>
);

export default memo(PagesPanel);
