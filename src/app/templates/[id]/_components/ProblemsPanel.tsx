'use client';

import { FC, useState } from 'react';
import { Badge, Box, Button, Flex, Text } from '@chakra-ui/react';
import { ChevronDown, ChevronRight, CircleAlert, CircleCheck, Info, PenLine } from 'lucide-react';
import type { TemplateIssue } from '@/components/library/store/services/templatesApi';
import { GuideLink, PART_LABEL } from '../../_components/ui';

/**
 * Everything the last check found, each with its fix: problems (block
 * previews and publishing), what's still to explain (blocks publishing) and
 * warnings. A click opens the tab — and the model or item — it's about.
 */

const KINDS = [
	{ key: 'errors', title: 'Problems', hint: 'Fix before previewing or publishing.', icon: CircleAlert, color: 'red.fg', bg: 'red.subtle' },
	{ key: 'explain', title: 'Still to explain', hint: 'Needed to publish — tenants read all of it.', icon: PenLine, color: 'orange.fg', bg: 'orange.subtle' },
	{ key: 'warnings', title: 'Worth a look', hint: 'Don’t block anything.', icon: Info, color: 'fg.muted', bg: 'bg.subtle' },
] as const;

const indexOf = (path: string) => {
	const m = path.match(/\[(\d+)\]/);
	return m ? Number(m[1]) : undefined;
};

const ProblemsPanel: FC<{ validation: any; onGo: (issue: TemplateIssue, index?: number) => void }> = ({ validation, onGo }) => {
	const [open, setOpen] = useState<Record<string, boolean>>({ errors: true, explain: true, warnings: false });
	const v = validation || {};
	const total = (v.errors?.length || 0) + (v.explain?.length || 0) + (v.warnings?.length || 0);

	if (!total)
		return (
			<Flex
				align='center'
				gap={2}
				px={4}
				py={3}
				borderRadius='md'
				borderWidth='1px'
				borderColor='border.muted'
				fontSize='sm'>
				<Box color='green.fg'>
					<CircleCheck size={16} />
				</Box>
				Checks clean — nothing to fix or explain.
				<Box ml='auto'>
					<GuideLink section='validate' />
				</Box>
			</Flex>
		);

	return (
		<Box
			borderRadius='md'
			borderWidth='1px'
			borderColor='border'>
			{KINDS.map(k => {
				const list: TemplateIssue[] = v[k.key] || [];
				if (!list.length) return null;
				const Icon = k.icon;
				const isOpen = open[k.key];
				return (
					<Box
						key={k.key}
						borderTopWidth={k.key === 'errors' ? 0 : '1px'}
						borderColor='border.muted'>
						<Flex
							align='center'
							gap={2}
							px={4}
							py={2.5}
							cursor='pointer'
							onClick={() => setOpen(o => ({ ...o, [k.key]: !o[k.key] }))}>
							{isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
							<Box color={k.color}>
								<Icon size={15} />
							</Box>
							<Text
								fontSize='sm'
								fontWeight='600'>
								{k.title}
							</Text>
							<Badge
								size='sm'
								variant='subtle'>
								{list.length}
							</Badge>
							<Text
								fontSize='xs'
								color='fg.muted'>
								{k.hint}
							</Text>
							{k.key === 'errors' && (
								<Box ml='auto'>
									<GuideLink section='validate' />
								</Box>
							)}
						</Flex>
						{isOpen && (
							<Box
								px={4}
								pb={3}>
								{list.map((i, n) => (
									<Flex
										key={n}
										gap={3}
										align='flex-start'
										py={1.5}
										borderTopWidth={n ? '1px' : 0}
										borderColor='border.muted'>
										<Badge
											size='xs'
											variant='outline'
											flexShrink={0}
											mt={0.5}>
											{PART_LABEL[i.part] || i.part}
										</Badge>
										<Box
											flex='1'
											minW={0}>
											<Text fontSize='sm'>{i.message}</Text>
											<Text
												fontSize='xs'
												color='fg.muted'>
												{i.fix}
											</Text>
										</Box>
										<Button
											size='2xs'
											variant='ghost'
											onClick={() => onGo(i, indexOf(i.path))}>
											Go there
										</Button>
									</Flex>
								))}
							</Box>
						)}
					</Box>
				);
			})}
		</Box>
	);
};

export default ProblemsPanel;
