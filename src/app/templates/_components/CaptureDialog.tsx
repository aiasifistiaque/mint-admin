'use client';

import { FC, useEffect, useState } from 'react';
import { Box, Flex, Input, Text } from '@chakra-ui/react';
import { useCaptureTemplateMutation, useGetAllQuery } from '@/components/library';
import { Dropdown } from '@/components/library/cl';
import { toaster } from '@/components/ui/toaster';
import StudioDialog from './StudioDialog';
import { Label, errorMessage } from './ui';

/**
 * Save a project as a template: a tenant project's structure — models,
 * sidebar, dashboard, public API, pages and settings — copied into a new
 * draft. A tenant's records are never copied (to keep sample records, save a
 * preview instead, from its template's Previews).
 */
const CaptureDialog: FC<{ open: boolean; onClose: () => void; onCreated: (doc: any) => void }> = ({ open, onClose, onCreated }) => {
	const [project, setProject] = useState('');
	const [name, setName] = useState('');
	const [capture, { isLoading }] = useCaptureTemplateMutation();
	const { data, isFetching } = useGetAllQuery({ path: 'tenant-projects', limit: 200, sort: 'name' }, { skip: !open });
	const projects: any[] = data?.doc || [];

	useEffect(() => {
		if (!open) return;
		setProject('');
		setName('');
	}, [open]);

	const save = async () => {
		if (!project) return;
		try {
			const res = await capture({ project, ...(name.trim() && { name: name.trim() }) }).unwrap();
			onClose();
			toaster.create({ type: 'success', title: `Saved as the draft “${res.doc.name}”`, description: 'Check it, explain it, then preview and publish.' });
			onCreated(res.doc);
		} catch (e) {
			toaster.create({ type: 'error', title: 'Could not save it as a template', description: errorMessage(e, 'Try again') });
		}
	};

	const picked = projects.find(p => p._id === project);

	return (
		<StudioDialog
			open={open}
			onClose={onClose}
			title='Save a project as a template'
			section='capture'
			confirmLabel='Save as a draft'
			onConfirm={save}
			loading={isLoading}
			disabled={!project}>
			<Flex
				direction='column'
				gap={4}>
				<Text
					fontSize='sm'
					color='fg.muted'>
					Copies a project’s structure into a new draft template: its models and fields, sidebar, dashboard, public API,
					and for a website its pages, SEO, content and settings. The project’s records are never copied — add sample
					data in the template instead.
				</Text>
				<Box>
					<Label
						required
						hint='Any organization’s project. Previews of templates aren’t listed — open them from their template.'>
						Project
					</Label>
					<Dropdown
						value={project}
						onChange={setProject}
						placeholder={isFetching ? 'Loading projects…' : 'Pick a project'}
						searchable>
						{projects.map(p => (
							<option
								key={p._id}
								value={p._id}>
								{p.name} · {p.type || 'app'}
								{p.organization?.name ? ` · ${p.organization.name}` : ''}
							</option>
						))}
					</Dropdown>
				</Box>
				<Box>
					<Label hint='Left empty: the project’s name.'>Template name</Label>
					<Input
						size='sm'
						value={name}
						maxLength={80}
						placeholder={picked?.name || 'Finance management'}
						onChange={e => setName(e.target.value)}
					/>
				</Box>
			</Flex>
		</StudioDialog>
	);
};

export default CaptureDialog;
