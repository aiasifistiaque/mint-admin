'use client';

import { FC, useEffect, useState } from 'react';
import { Box, Flex, Grid, Input, Text } from '@chakra-ui/react';
import { useCreateTemplateMutation } from '@/components/library';
import type { TemplateType } from '@/components/library/store/services/templatesApi';
import { toaster } from '@/components/ui/toaster';
import StudioDialog from './StudioDialog';
import { GuideLink, Label, TYPES, errorMessage } from './ui';

/** New template: its type (each says what it holds), name, category and one-line summary — then the editor. */
const NewTemplateDialog: FC<{ open: boolean; onClose: () => void; onCreated: (doc: any) => void }> = ({ open, onClose, onCreated }) => {
	const [type, setType] = useState<TemplateType>('app');
	const [name, setName] = useState('');
	const [category, setCategory] = useState('');
	const [summary, setSummary] = useState('');
	const [touched, setTouched] = useState(false);
	const [create, { isLoading }] = useCreateTemplateMutation();

	useEffect(() => {
		if (!open) return;
		setType('app');
		setName('');
		setCategory('');
		setSummary('');
		setTouched(false);
	}, [open]);

	const save = async () => {
		setTouched(true);
		if (!name.trim()) return;
		try {
			const res = await create({ type, name: name.trim(), category: category.trim(), summary: summary.trim() }).unwrap();
			onClose();
			onCreated(res.doc);
		} catch (e) {
			toaster.create({ type: 'error', title: 'Could not create the template', description: errorMessage(e, 'Try again') });
		}
	};

	return (
		<StudioDialog
			open={open}
			onClose={onClose}
			title='New template'
			section='new'
			size='lg'
			confirmLabel='Create and open'
			onConfirm={save}
			loading={isLoading}
			aside={
				<Text
					fontSize='xs'
					color='fg.muted'>
					A draft — nothing is built, and tenants don’t see it until you publish.
				</Text>
			}>
			<Flex
				direction='column'
				gap={4}>
				<Box>
					<Flex
						align='baseline'
						justify='space-between'>
						<Label hint='What a project made from it is. Fixed once created.'>Type</Label>
						<GuideLink section='types' />
					</Flex>
					<Grid
						templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
						gap={2}>
						{TYPES.map(t => {
							const Icon = t.icon;
							const on = type === t.value;
							return (
								<Box
									key={t.value}
									as='button'
									textAlign='left'
									p={3}
									borderRadius='md'
									borderWidth={on ? '2px' : '1px'}
									borderColor={on ? 'fg' : 'border'}
									bg={on ? 'bg.subtle' : 'bg'}
									onClick={() => setType(t.value)}>
									<Flex
										align='center'
										gap={2}
										mb={1}>
										<Icon size={16} />
										<Text
											fontWeight='600'
											fontSize='sm'>
											{t.label}
										</Text>
									</Flex>
									<Text
										fontSize='xs'
										color='fg.muted'
										lineHeight='1.5'>
										{t.holds}
									</Text>
								</Box>
							);
						})}
					</Grid>
				</Box>
				<Grid
					templateColumns={{ base: '1fr', md: '2fr 1fr' }}
					gap={4}>
					<Box>
						<Label
							required
							hint='What tenants see in the gallery. Its key (the slug) comes from it.'>
							Name
						</Label>
						<Input
							size='sm'
							autoFocus
							value={name}
							maxLength={80}
							placeholder='Finance management'
							onChange={e => setName(e.target.value)}
						/>
						{touched && !name.trim() && (
							<Text
								fontSize='xs'
								color='red.fg'
								mt={1}>
								Give the template a name.
							</Text>
						)}
					</Box>
					<Box>
						<Label hint='Groups it in the gallery.'>Category</Label>
						<Input
							size='sm'
							value={category}
							maxLength={60}
							placeholder='Finance'
							onChange={e => setCategory(e.target.value)}
						/>
					</Box>
				</Grid>
				<Box>
					<Label hint='One sentence on what a project built from it does — the line under the name.'>Summary</Label>
					<Input
						size='sm'
						value={summary}
						maxLength={300}
						placeholder='Accounts, transactions and budgets for a small team.'
						onChange={e => setSummary(e.target.value)}
					/>
				</Box>
			</Flex>
		</StudioDialog>
	);
};

export default NewTemplateDialog;
