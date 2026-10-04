'use client';

import { FC, useEffect, useState } from 'react';
import { Box, Button, Flex, IconButton, Input, Switch, Text } from '@chakra-ui/react';
import { ExternalLink, Trash2 } from 'lucide-react';
import {
	useDeleteTemplatePreviewMutation,
	useGetTemplatePreviewsQuery,
	useOpenTemplatePreviewMutation,
	usePreviewTemplateMutation,
} from '@/components/library';
import { Dropdown, when } from '@/components/library/cl';
import { toaster } from '@/components/ui/toaster';
import StudioDialog from '../../_components/StudioDialog';
import { Label, errorMessage } from '../../_components/ui';

/**
 * Preview: the template built into a throwaway project in the sandbox
 * organization (deleted after 24 hours), opened in the tenant panel with a
 * single-use link. The questions are answered here, as a tenant would.
 */
const PreviewDialog: FC<{ open: boolean; onClose: () => void; doc: any; dirty: boolean }> = ({ open, onClose, doc, dirty }) => {
	const questions: any[] = doc.draft?.questions || [];
	const [answers, setAnswers] = useState<Record<string, string>>({});
	const [sampleData, setSampleData] = useState(true);
	const [from, setFrom] = useState<'draft' | 'published'>('draft');
	const [preview, { isLoading }] = usePreviewTemplateMutation();
	const [reopen] = useOpenTemplatePreviewMutation();
	const [remove] = useDeleteTemplatePreviewMutation();
	const { data } = useGetTemplatePreviewsQuery(doc._id, { skip: !open });
	const previews = data?.doc || [];
	const errors = doc.validation?.errors || [];

	useEffect(() => {
		if (!open) return;
		setAnswers(Object.fromEntries(questions.map(q => [q.key, q.default || ''])));
		setFrom('draft');
		setSampleData(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	const missing = from === 'draft' ? questions.filter(q => q.required && !String(answers[q.key] || '').trim()) : [];

	const go = (url: string) => window.open(url, '_blank', 'noopener');

	const run = async () => {
		try {
			const res = await preview({ id: doc._id, from, answers, sampleData }).unwrap();
			go(res.url);
			const n = res.result?.models?.length || 0;
			toaster.create({ type: 'success', title: 'Preview built', description: `${n} model${n === 1 ? '' : 's'} — opened in a new tab. It’s deleted in 24 hours.` });
		} catch (e) {
			toaster.create({ type: 'error', title: 'The preview wasn’t built', description: errorMessage(e, 'Try again') });
		}
	};

	return (
		<StudioDialog
			open={open}
			onClose={onClose}
			title='Preview'
			section='preview'
			size='lg'
			confirmLabel={isLoading ? 'Building…' : 'Build and open'}
			onConfirm={run}
			loading={isLoading}
			disabled={(from === 'draft' && errors.length > 0) || missing.length > 0}>
			<Flex
				direction='column'
				gap={4}>
				<Text
					fontSize='sm'
					color='fg.muted'
					lineHeight='1.6'>
					Builds the template into a throwaway project, exactly as a tenant would get it, and opens it in the tenant panel
					in a new tab. Nobody else sees it, and it’s deleted after 24 hours. The link works once; open it again from the
					list below.
				</Text>
				{dirty && (
					<Text
						fontSize='sm'
						color='orange.fg'>
						You have unsaved changes — the preview uses the saved draft.
					</Text>
				)}
				{from === 'draft' && errors.length > 0 && (
					<Text
						fontSize='sm'
						color='red.fg'>
						The draft has {errors.length} problem{errors.length === 1 ? '' : 's'} — fix them first (see the problems list).
					</Text>
				)}
				{doc.version > 0 && (
					<Box>
						<Label hint='The draft has your latest changes; the published version is what tenants get today.'>Build</Label>
						<Dropdown
							value={from}
							onChange={v => setFrom(v as any)}>
							<option value='draft'>The draft</option>
							<option value='published'>Published version {doc.version}</option>
						</Dropdown>
					</Box>
				)}
				{from === 'draft' && questions.length > 0 && (
					<Flex
						direction='column'
						gap={3}>
						<Text
							fontSize='sm'
							fontWeight='600'>
							The template’s questions
						</Text>
						{questions.map(q => (
							<Box key={q.key}>
								<Label
									hint={q.help}
									required={q.required}>
									{q.label || q.key}
								</Label>
								{q.kind === 'select' ? (
									<Dropdown
										value={answers[q.key] || ''}
										onChange={v => setAnswers(a => ({ ...a, [q.key]: v }))}>
										{(q.options || []).map((o: any) => (
											<option
												key={o.value}
												value={o.value}>
												{o.label || o.value}
											</option>
										))}
									</Dropdown>
								) : (
									<Input
										size='sm'
										value={answers[q.key] || ''}
										onChange={e => setAnswers(a => ({ ...a, [q.key]: e.target.value }))}
									/>
								)}
							</Box>
						))}
					</Flex>
				)}
				<Switch.Root
					size='sm'
					checked={sampleData}
					onCheckedChange={e => setSampleData(e.checked)}>
					<Switch.HiddenInput />
					<Switch.Control>
						<Switch.Thumb />
					</Switch.Control>
					<Switch.Label fontSize='sm'>Include the sample data</Switch.Label>
				</Switch.Root>

				{previews.length > 0 && (
					<Box>
						<Text
							fontSize='sm'
							fontWeight='600'
							mb={2}>
							Previews still open ({previews.length})
						</Text>
						{previews.map((p: any) => (
							<Flex
								key={p._id}
								align='center'
								gap={2}
								py={1.5}
								borderTopWidth='1px'
								borderColor='border.muted'>
								<Box
									flex='1'
									minW={0}>
									<Text
										fontSize='sm'
										truncate>
										{p.from === 'published' ? 'Published version' : 'Draft'} · built {when(p.createdAt)}
									</Text>
									<Text
										fontSize='xs'
										color='fg.muted'>
										Deleted {when(p.expiresAt)}
									</Text>
								</Box>
								<Button
									size='2xs'
									variant='outline'
									onClick={async () => {
										try {
											go((await reopen({ projectId: p._id }).unwrap()).url);
										} catch (e) {
											toaster.create({ type: 'error', title: 'Could not open it', description: errorMessage(e, 'Try again') });
										}
									}}>
									<ExternalLink size={11} />
									Open
								</Button>
								<IconButton
									aria-label='Delete now'
									size='2xs'
									variant='ghost'
									onClick={() => remove({ projectId: p._id })}>
									<Trash2 size={12} />
								</IconButton>
							</Flex>
						))}
					</Box>
				)}
			</Flex>
		</StudioDialog>
	);
};

export default PreviewDialog;
