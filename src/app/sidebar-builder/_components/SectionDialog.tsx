'use client';

import { FC, useEffect, useState } from 'react';
import { Box, Button, Flex, Input, Textarea } from '@chakra-ui/react';
import {
	GenericModal,
	GenericModalBody,
	GenericModalContent,
	GenericModalFooter,
	GenericModalHeader,
	radius,
} from '@/components/library';
import { Section } from './draft';
import { Toggle } from './ItemDialog';
import { DocLink, IconField, Label } from './ui';

type Props = {
	section: Section | null;
	isNew: boolean;
	onClose: () => void;
	onSave: (section: Section) => void;
};

/** A sidebar section: the heading, its icon, and whether it shows. */
const SectionDialog: FC<Props> = ({ section, isNew, onClose, onSave }) => {
	const [draft, setDraft] = useState<Section | null>(section);
	const [touched, setTouched] = useState(false);

	useEffect(() => {
		setDraft(section);
		setTouched(false);
	}, [section]);

	if (!draft) return null;
	const set = (patch: Partial<Section>) => setDraft(d => (d ? { ...d, ...patch } : d));

	const save = () => {
		setTouched(true);
		if (!draft.name.trim()) return;
		onSave({ ...draft, name: draft.name.trim() });
	};

	return (
		<GenericModal
			isOpen={!!section}
			onClose={onClose}
			size='md'>
			<GenericModalContent borderRadius={radius.MODAL}>
				<GenericModalHeader>
					<Flex
						align='center'
						justify='space-between'
						gap={3}
						pr={2}>
						{isNew ? 'Add a section' : 'Edit section'}
						<DocLink section='sections' />
					</Flex>
				</GenericModalHeader>

				<GenericModalBody>
					<Flex
						direction='column'
						gap={4}>
						<Box>
							<Label
								required
								hint='The heading its pages are grouped under.'>
								Name
							</Label>
							<Input
								size='sm'
								autoFocus
								value={draft.name}
								maxLength={200}
								placeholder='e.g. Accounts'
								onChange={e => set({ name: e.target.value })}
							/>
							{touched && !draft.name.trim() && (
								<Box
									fontSize='xs'
									color='red.fg'
									mt={1}>
									Give the section a name.
								</Box>
							)}
						</Box>

						<IconField
							value={draft.icon}
							onChange={icon => set({ icon })}
							hint='Shown beside the section name. Copy a name from the Lucide catalogue.'
						/>

						<Toggle
							label='Show in the sidebar'
							hint='Off hides the section and every page in it, without deleting anything.'
							checked={draft.isActive}
							onChange={isActive => set({ isActive })}
						/>

						<Box>
							<Label hint='Shown when the pointer rests on the section.'>Tooltip</Label>
							<Input
								size='sm'
								value={draft.tooltip}
								onChange={e => set({ tooltip: e.target.value })}
							/>
						</Box>
						<Box>
							<Label hint='A note for the people who manage the sidebar.'>Description</Label>
							<Textarea
								size='sm'
								rows={2}
								value={draft.description}
								onChange={e => set({ description: e.target.value })}
							/>
						</Box>
					</Flex>
				</GenericModalBody>

				<GenericModalFooter>
					<Flex
						gap={2}
						justify='flex-end'
						w='full'>
						<Button
							size='sm'
							variant='outline'
							onClick={onClose}>
							Cancel
						</Button>
						<Button
							size='sm'
							onClick={save}>
							{isNew ? 'Add section' : 'Done'}
						</Button>
					</Flex>
				</GenericModalFooter>
			</GenericModalContent>
		</GenericModal>
	);
};

export default SectionDialog;
