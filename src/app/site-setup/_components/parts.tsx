'use client';

import { FC, ReactNode } from 'react';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { Plus, Trash2 } from 'lucide-react';

/** Small pieces the Site setup tabs share. */

export const errorText = (e: any) => e?.data?.message || 'Something went wrong — try again.';

/** A tab's save bar: what's unsaved, the problem if any, Save. */
export const SaveBar: FC<{ dirty: boolean; saving: boolean; error?: any; saved?: boolean; onSave: () => void; onReset: () => void; disabled?: boolean }> = ({
	dirty,
	saving,
	error,
	saved,
	onSave,
	onReset,
	disabled,
}) => (
	<Flex
		align='center'
		justify='flex-end'
		gap={3}
		pt={4}
		mt={2}
		borderTopWidth='1px'
		borderColor='border.muted'
		wrap='wrap'>
		<Text
			flex={1}
			fontSize='12.5px'
			color={error ? 'red.fg' : 'fg.muted'}>
			{error ? errorText(error) : dirty ? 'Unsaved changes' : saved ? 'Saved — the site picks it up within a minute.' : ''}
		</Text>
		{dirty && (
			<Button
				size='sm'
				variant='ghost'
				onClick={onReset}
				disabled={saving}>
				Discard
			</Button>
		)}
		<Button
			size='sm'
			onClick={onSave}
			loading={saving}
			disabled={!dirty || disabled}>
			Save
		</Button>
	</Flex>
);

/** A labelled field with its help text. */
export const Field: FC<{ label: string; help?: ReactNode; children: ReactNode }> = ({ label, help, children }) => (
	<Box>
		<Text
			fontSize='13px'
			fontWeight='600'
			mb={1}>
			{label}
		</Text>
		{children}
		{help && (
			<Text
				fontSize='12px'
				color='fg.muted'
				mt={1}>
				{help}
			</Text>
		)}
	</Box>
);

/** Rows of inputs (redirects, headers, domains): add, edit, remove. */
export const Rows = <T extends Record<string, any>>({
	rows,
	onChange,
	blank,
	columns,
	addLabel,
	empty,
	extra,
}: {
	rows: T[];
	onChange: (rows: T[]) => void;
	blank: T;
	columns: { key: keyof T; placeholder: string; width?: string; mono?: boolean }[];
	addLabel: string;
	empty: string;
	extra?: (row: T, set: (patch: Partial<T>) => void) => ReactNode;
}) => (
	<Flex
		direction='column'
		gap={2}>
		{!rows.length && (
			<Text
				fontSize='12.5px'
				color='fg.muted'>
				{empty}
			</Text>
		)}
		{rows.map((row, i) => {
			const set = (patch: Partial<T>) => onChange(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
			return (
				<Flex
					key={i}
					gap={2}
					align='center'
					wrap={{ base: 'wrap', md: 'nowrap' }}>
					{columns.map(c => (
						<Input
							key={String(c.key)}
							size='sm'
							flex={c.width ? `0 0 ${c.width}` : 1}
							minW={{ base: '100%', md: 0 }}
							fontFamily={c.mono ? 'mono' : undefined}
							fontSize={c.mono ? '12.5px' : undefined}
							placeholder={c.placeholder}
							value={row[c.key] ?? ''}
							onChange={e => set({ [c.key]: e.target.value } as Partial<T>)}
						/>
					))}
					{extra?.(row, set)}
					<Button
						size='sm'
						variant='ghost'
						aria-label='Remove'
						onClick={() => onChange(rows.filter((_, j) => j !== i))}>
						<Trash2 size={14} />
					</Button>
				</Flex>
			);
		})}
		<Box>
			<Button
				size='xs'
				variant='outline'
				onClick={() => onChange([...rows, { ...blank }])}>
				<Plus size={13} />
				{addLabel}
			</Button>
		</Box>
	</Flex>
);
