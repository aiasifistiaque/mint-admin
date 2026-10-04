'use client';

import { FC, useEffect, useState } from 'react';
import { Box, Flex, Text, Textarea } from '@chakra-ui/react';
import { usePublishTemplateMutation } from '@/components/library';
import { toaster } from '@/components/ui/toaster';
import StudioDialog from '../../_components/StudioDialog';
import { Label, errorMessage } from '../../_components/ui';

/**
 * Publish: the draft becomes the next version. New projects get it; projects
 * already made from the template keep what they were built with. Refused
 * while the draft has problems or is missing its explanations.
 */
const PublishDialog: FC<{ open: boolean; onClose: () => void; doc: any; dirty: boolean }> = ({ open, onClose, doc, dirty }) => {
	const [notes, setNotes] = useState('');
	const [publish, { isLoading }] = usePublishTemplateMutation();
	const v = doc.validation || {};
	const blockers: string[] = [
		...(dirty ? ['You have unsaved changes — save them first, or they won’t be in this version.'] : []),
		...(v.errors || []).map((i: any) => i.message),
		...(v.explain || []).map((i: any) => i.message),
		...(doc.version && !doc.changed ? ['Nothing changed since the last version.'] : []),
	];
	const next = (doc.version || 0) + 1;

	useEffect(() => {
		if (open) setNotes('');
	}, [open]);

	const run = async () => {
		try {
			await publish({ id: doc._id, notes: notes.trim() }).unwrap();
			toaster.create({ type: 'success', title: `Published version ${next}`, description: 'New projects get it from now on.' });
			onClose();
		} catch (e) {
			toaster.create({ type: 'error', title: 'Not published', description: errorMessage(e, 'Try again') });
		}
	};

	return (
		<StudioDialog
			open={open}
			onClose={onClose}
			title={`Publish version ${next}`}
			section='publish'
			confirmLabel={`Publish v${next}`}
			onConfirm={run}
			loading={isLoading}
			disabled={blockers.length > 0 || !notes.trim()}>
			<Flex
				direction='column'
				gap={4}>
				<Text
					fontSize='sm'
					color='fg.muted'
					lineHeight='1.6'>
					The draft becomes version {next}. Tenants who can use this template ({doc.visibility === 'organizations' ? 'the organizations you picked' : doc.visibility === 'hidden' ? 'nobody — it’s hidden' : 'everyone'}) get it when they start a new
					project. Projects already made from it keep what they were built with — publishing never changes a tenant’s
					project. You can restore any version into the draft later.
				</Text>
				{blockers.length > 0 && (
					<Box
						px={4}
						py={3}
						borderRadius='md'
						bg='orange.subtle'
						fontSize='sm'>
						<Text
							fontWeight='600'
							mb={1}>
							Can’t publish yet
						</Text>
						{blockers.map((b, i) => (
							<Text key={i}>• {b}</Text>
						))}
					</Box>
				)}
				<Box>
					<Label
						required
						hint='What changed, for whoever looks at the versions later — “Added budgets”, “Clearer setup guide”.'>
						Notes
					</Label>
					<Textarea
						size='sm'
						rows={3}
						value={notes}
						maxLength={1000}
						onChange={e => setNotes(e.target.value)}
					/>
				</Box>
			</Flex>
		</StudioDialog>
	);
};

export default PublishDialog;
