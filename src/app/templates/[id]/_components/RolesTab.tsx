'use client';

import { FC } from 'react';
import { Box, Button, Checkbox, Flex, Grid, IconButton, Input, Text } from '@chakra-ui/react';
import { Plus, Trash2 } from 'lucide-react';
import { Panel } from '@/components/library/cl';
import { GuideLink, Intro, Label } from '../../_components/ui';
import type { TabProps } from './types';

/**
 * The Roles tab: organization roles the template suggests besides Owner,
 * Admin and Member — e.g. an Accountant who edits records but can't invite
 * anyone. Added to the tenant's organization when a project is made from the
 * template, unless a role of that name is already there.
 */

export type Role = { name: string; description: string; permissions: string[] };

const SYSTEM = ['owner', 'admin', 'member'];

const RolesTab: FC<TabProps<Role[]>> = ({ meta, value, onChange }) => {
	const perms: { key: string; group: string; label: string; description: string }[] = meta?.orgPermissions || [];
	const groups = [...new Set(perms.map(p => p.group))];
	const set = (i: number, patch: Partial<Role>) => onChange(value.map((r, j) => (j === i ? { ...r, ...patch } : r)));
	const toggle = (i: number, key: string, on: boolean) => {
		const has = new Set(value[i].permissions);
		on ? has.add(key) : has.delete(key);
		set(i, { permissions: perms.map(p => p.key).filter(k => has.has(k)) });
	};

	return (
		<Flex
			direction='column'
			gap={4}>
			<Intro section='roles'>
				Roles the template suggests for the people in the tenant’s organization, besides Owner, Admin and Member — an
				Accountant who can edit records but not invite anyone, a Viewer who only reads. They’re added to the organization when
				a project is made from the template; a role with the same name already there is left as it is.
			</Intro>

			{value.map((r, i) => {
				const clash = SYSTEM.includes(r.name.trim().toLowerCase());
				return (
					<Panel
						key={i}
						title={r.name || `Role ${i + 1}`}
						actions={
							<IconButton
								aria-label='Remove the role'
								size='xs'
								variant='ghost'
								onClick={() => onChange(value.filter((_, j) => j !== i))}>
								<Trash2 size={13} />
							</IconButton>
						}>
						<Flex
							direction='column'
							gap={4}>
							<Grid
								templateColumns={{ base: '1fr', md: '1fr 2fr' }}
								gap={4}>
								<Box>
									<Label
										required
										hint='As members see it, e.g. “Accountant”.'>
										Name
									</Label>
									<Input
										size='sm'
										value={r.name}
										maxLength={60}
										onChange={e => set(i, { name: e.target.value })}
									/>
									{clash && (
										<Text
											fontSize='xs'
											color='orange.fg'
											mt={1}>
											Every organization already has this role — it won’t be added. Pick another name.
										</Text>
									)}
								</Box>
								<Box>
									<Label hint='What people with this role do — shown when a role is picked for someone.'>Description</Label>
									<Input
										size='sm'
										value={r.description}
										maxLength={200}
										onChange={e => set(i, { description: e.target.value })}
									/>
								</Box>
							</Grid>
							<Grid
								templateColumns={{ base: '1fr', md: `repeat(${Math.max(groups.length, 1)}, minmax(0, 1fr))` }}
								gap={4}>
								{groups.map(g => (
									<Box key={g}>
										<Text
											fontSize='xs'
											fontWeight='600'
											mb={2}>
											{g}
										</Text>
										<Flex
											direction='column'
											gap={2}>
											{perms
												.filter(p => p.group === g)
												.map(p => (
													<Checkbox.Root
														key={p.key}
														size='sm'
														alignItems='flex-start'
														checked={r.permissions.includes(p.key)}
														onCheckedChange={e => toggle(i, p.key, !!e.checked)}>
														<Checkbox.HiddenInput />
														<Checkbox.Control mt='2px' />
														<Checkbox.Label>
															<Text fontSize='sm'>{p.label}</Text>
															<Text
																fontSize='xs'
																color='fg.muted'
																fontWeight='400'>
																{p.description}
															</Text>
														</Checkbox.Label>
													</Checkbox.Root>
												))}
										</Flex>
									</Box>
								))}
							</Grid>
						</Flex>
					</Panel>
				);
			})}

			<Flex
				gap={3}
				align='center'>
				<Button
					size='sm'
					variant='outline'
					onClick={() => onChange([...value, { name: '', description: '', permissions: ['records:view'] }])}>
					<Plus size={14} />
					Add a role
				</Button>
				<GuideLink section='roles' />
			</Flex>
			{!value.length && (
				<Text
					fontSize='sm'
					color='fg.muted'>
					No extra roles — Owner, Admin and Member are enough for most templates.
				</Text>
			)}
		</Flex>
	);
};

export default RolesTab;
