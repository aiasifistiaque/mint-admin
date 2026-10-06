'use client';

import { FC, memo, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { Box, Button, Flex, Grid, IconButton, Image, Input, Switch, Text, Textarea } from '@chakra-ui/react';
import { ImageIcon, Plus, Trash2, X } from 'lucide-react';
import { Dropdown } from '@/components/library/cl';
import { UploadModal } from '@/components/library';
import type { SbManifest, SbNode, SbPageSummary, SbPropDef } from '@/components/library/store/services/siteBuilderApi';
import { SITES_URL } from './protocol';

/**
 * One input per kind of block setting (the manifest's PropDefs, SB-05):
 * text, long text, rich text, number, on/off, choice, theme colour, image(s),
 * video, link, page, icon, list. Values go straight into the draft; the
 * canvas shows them as you type.
 */

export type InputContext = {
	manifest: SbManifest;
	pages: SbPageSummary[];
	/** blocks on this page, for "scroll to" */
	nodes: { id: string; label: string }[];
};

const label = { fontSize: '12px', fontWeight: '600', mb: 1 } as const;

export const Field: FC<{ title: string; help?: string; children: React.ReactNode; inline?: boolean }> = ({ title, help, children, inline }) => (
	<Box>
		{!inline && <Text {...label}>{title}</Text>}
		{children}
		{help && (
			<Text
				fontSize='11.5px'
				color='fg.muted'
				mt={1}
				lineHeight='1.4'>
				{help}
			</Text>
		)}
	</Box>
);

/* ------------------------------------------------------------ rich text */

const Quill = dynamic(() => import('react-quill-new'), { ssr: false, loading: () => <Box h='120px' /> });

// The renderer keeps only these (its rich-text allowlist), so the toolbar offers only these.
const TOOLBAR = [[{ header: [2, 3, 4, false] }], ['bold', 'italic', 'link'], [{ list: 'ordered' }, { list: 'bullet' }], ['blockquote', 'code']];
const FORMATS = ['header', 'bold', 'italic', 'link', 'list', 'blockquote', 'code'];

/**
 * Quill, sending semantic HTML (real <ul>/<ol>, which the renderer's allowlist
 * keeps). Uncontrolled while typing; a value from outside (undo, another
 * block) remounts it.
 */
const RichText: FC<{ value: string; onChange: (html: string) => void; readOnly: boolean }> = ({ value, onChange, readOnly }) => {
	const quill = useRef<any>(null);
	const emitted = useRef(value);
	const [mount, setMount] = useState(0);
	useEffect(() => {
		if (value !== emitted.current) {
			emitted.current = value;
			setMount(m => m + 1);
		}
	}, [value]);
	return (
		<Box
			css={{
				'.ql-toolbar': { borderRadius: '6px 6px 0 0', borderColor: 'var(--chakra-colors-border)', padding: '4px' },
				'.ql-container': { borderRadius: '0 0 6px 6px', borderColor: 'var(--chakra-colors-border)', fontSize: '13px', fontFamily: 'inherit' },
				'.ql-editor': { minHeight: '110px', maxHeight: '320px', overflowY: 'auto' },
				'.ql-snow .ql-stroke': { stroke: 'currentColor' },
				'.ql-snow .ql-picker': { color: 'inherit' },
			}}>
			<Quill
				key={mount}
				{...({
					ref: (r: any) => {
						quill.current = r;
					},
				} as any)}
				theme='snow'
				readOnly={readOnly}
				defaultValue={value}
				modules={{ toolbar: TOOLBAR }}
				formats={FORMATS}
				onChange={() => {
					const editor = quill.current?.getEditor?.();
					if (!editor) return;
					const html = editor.getLength() <= 1 ? '' : editor.getSemanticHTML().replace(/&nbsp;/g, ' ');
					emitted.current = html;
					onChange(html);
				}}
			/>
		</Box>
	);
};

/* ---------------------------------------------------------------- media */

const MediaPick: FC<{ value: string; kind: 'image' | 'video'; onChange: (v: string) => void; readOnly: boolean }> = ({ value, kind, onChange, readOnly }) => (
	<Flex
		gap={2}
		align='center'>
		<Box
			w='56px'
			h='56px'
			flexShrink={0}
			borderRadius='md'
			borderWidth='1px'
			bg='bg.subtle'
			overflow='hidden'
			display='flex'
			alignItems='center'
			justifyContent='center'>
			{kind === 'image' && value && /^(https?:)?\//.test(value) ? (
				<Image
					src={value}
					alt=''
					w='full'
					h='full'
					objectFit='cover'
				/>
			) : (
				<ImageIcon size={18} />
			)}
		</Box>
		<Flex
			direction='column'
			gap={1}
			flex={1}
			minW={0}>
			<Input
				size='xs'
				value={value || ''}
				readOnly={readOnly}
				placeholder={kind === 'image' ? 'https://… or pick one' : 'YouTube, Vimeo or a video file'}
				onChange={e => onChange(e.target.value.trim())}
			/>
			{!readOnly && (
				<Flex gap={1}>
					<UploadModal
						fileType={kind}
						title={kind === 'image' ? 'Choose an image' : 'Choose a video'}
						handleImage={(url: string) => url && onChange(url)}>
						<Button
							size='2xs'
							variant='outline'>
							{kind === 'image' ? 'Media library' : 'Video file'}
						</Button>
					</UploadModal>
					{value && (
						<Button
							size='2xs'
							variant='ghost'
							onClick={() => onChange('')}>
							Clear
						</Button>
					)}
				</Flex>
			)}
		</Flex>
	</Flex>
);

const Images: FC<{ value: string[]; onChange: (v: string[]) => void; readOnly: boolean }> = ({ value, onChange, readOnly }) => (
	<Grid
		templateColumns='repeat(4, 1fr)'
		gap={1.5}>
		{(value || []).map((src, i) => (
			<Box
				key={`${src}-${i}`}
				position='relative'
				pt='100%'
				borderRadius='md'
				overflow='hidden'
				borderWidth='1px'>
				<Image
					src={src}
					alt=''
					position='absolute'
					inset={0}
					w='full'
					h='full'
					objectFit='cover'
				/>
				{!readOnly && (
					<IconButton
						size='2xs'
						position='absolute'
						top={0.5}
						right={0.5}
						aria-label='Remove'
						onClick={() => onChange(value.filter((_, j) => j !== i))}>
						<X size={10} />
					</IconButton>
				)}
			</Box>
		))}
		{!readOnly && (
			<UploadModal
				fileType='image'
				title='Add images'
				multiSelect
				handleImage={(v: string | string[]) => onChange([...(value || []), ...(Array.isArray(v) ? v : [v]).filter(Boolean)])}>
				<Box
					as='button'
					pt='100%'
					position='relative'
					borderRadius='md'
					borderWidth='1px'
					borderStyle='dashed'
					w='full'
					aria-label='Add images'>
					<Flex
						position='absolute'
						inset={0}
						align='center'
						justify='center'
						color='fg.muted'>
						<Plus size={14} />
					</Flex>
				</Box>
			</UploadModal>
		)}
	</Grid>
);

/* ----------------------------------------------------------------- icon */

/** Names from the manifest; each drawn by the renderer (/__mint/icon/<name>), so no icon library is bundled here. */
const IconPicker: FC<{ value: string; icons: string[]; onChange: (v: string) => void; readOnly: boolean }> = ({ value, icons, onChange, readOnly }) => {
	const [q, setQ] = useState('');
	const [open, setOpen] = useState(false);
	const list = useMemo(() => icons.filter(n => n.includes(q.trim().toLowerCase())).slice(0, 60), [icons, q]);
	const img = (name: string, size: number) => (
		<Image
			src={`${SITES_URL}/__mint/icon/${name}`}
			alt=''
			w={`${size}px`}
			h={`${size}px`}
			loading='lazy'
			_dark={{ filter: 'invert(1)' }}
		/>
	);
	return (
		<Box>
			<Flex
				gap={2}
				align='center'>
				<Flex
					w='32px'
					h='32px'
					align='center'
					justify='center'
					borderWidth='1px'
					borderRadius='md'
					flexShrink={0}>
					{value ? img(value, 18) : null}
				</Flex>
				<Text
					fontSize='12px'
					flex={1}
					truncate>
					{value || 'None'}
				</Text>
				{!readOnly && (
					<Button
						size='2xs'
						variant='outline'
						onClick={() => setOpen(o => !o)}>
						{open ? 'Done' : 'Change'}
					</Button>
				)}
				{!readOnly && value && (
					<Button
						size='2xs'
						variant='ghost'
						onClick={() => onChange('')}>
						Clear
					</Button>
				)}
			</Flex>
			{open && (
				<Box
					mt={2}
					p={2}
					borderWidth='1px'
					borderRadius='md'>
					<Input
						size='xs'
						autoFocus
						placeholder={`Search ${icons.length} icons`}
						value={q}
						onChange={e => setQ(e.target.value)}
						mb={2}
					/>
					<Grid
						templateColumns='repeat(6, 1fr)'
						gap={1}
						maxH='180px'
						overflowY='auto'>
						{list.map(n => (
							<Box
								as='button'
								key={n}
								title={n}
								aria-label={n}
								p={1.5}
								borderRadius='sm'
								display='flex'
								justifyContent='center'
								bg={n === value ? 'blue.subtle' : undefined}
								_hover={{ bg: 'bg.muted' }}
								onClick={() => onChange(n)}>
								{img(n, 18)}
							</Box>
						))}
					</Grid>
					{!list.length && (
						<Text
							fontSize='12px'
							color='fg.muted'>
							No icon by that name.
						</Text>
					)}
				</Box>
			)}
		</Box>
	);
};

/* ------------------------------------------------------------- colours */

const ColorPick: FC<{ value: string; manifest: SbManifest; theme: string; onChange: (v: string | null) => void; readOnly: boolean }> = ({ value, manifest, theme, onChange, readOnly }) => {
	const tokens: Record<string, { light: string }> = (manifest.themes.find(t => t.key === theme) as any)?.tokens?.colors || {};
	const names = (manifest.style.color?.values || []) as string[];
	const swatch = (n: string) => (n === 'transparent' ? 'transparent' : n === 'white' ? '#fff' : n === 'black' ? '#000' : tokens[n]?.light || '#ccc');
	return (
		<Flex
			gap={1}
			wrap='wrap'>
			{names.map(n => (
				<Box
					as='button'
					key={n}
					title={n}
					aria-label={n}
					w='22px'
					h='22px'
					borderRadius='full'
					borderWidth={n === value ? '2px' : '1px'}
					borderColor={n === value ? 'blue.solid' : 'border'}
					bg={swatch(n)}
					backgroundImage={n === 'transparent' ? 'linear-gradient(45deg,#ddd 25%,transparent 25%,transparent 75%,#ddd 75%)' : undefined}
					backgroundSize='8px 8px'
					{...(readOnly && { pointerEvents: 'none', opacity: 0.6 })}
					onClick={() => onChange(n === value ? null : n)}
				/>
			))}
		</Flex>
	);
};

/* --------------------------------------------------------------- lists */

const ListInput: FC<{ def: SbPropDef; value: any[]; ctx: InputContext; theme: string; onChange: (v: any[]) => void; readOnly: boolean }> = ({ def, value, ctx, theme, onChange, readOnly }) => {
	const rows = Array.isArray(value) ? value : [];
	return (
		<Flex
			direction='column'
			gap={2}>
			{rows.map((row, i) => (
				<Box
					key={i}
					p={2}
					borderWidth='1px'
					borderRadius='md'>
					<Flex
						justify='space-between'
						align='center'
						mb={1}>
						<Text
							fontSize='11.5px'
							color='fg.muted'>
							{i + 1}
						</Text>
						{!readOnly && (
							<IconButton
								size='2xs'
								variant='ghost'
								aria-label='Remove row'
								onClick={() => onChange(rows.filter((_, j) => j !== i))}>
								<Trash2 size={11} />
							</IconButton>
						)}
					</Flex>
					<Flex
						direction='column'
						gap={2}>
						{(def.fields || []).map(f => (
							<PropInput
								key={f.key}
								def={f}
								value={row?.[f.key]}
								ctx={ctx}
								theme={theme}
								readOnly={readOnly}
								onChange={v => onChange(rows.map((r, j) => (j === i ? { ...r, [f.key]: v ?? undefined } : r)))}
							/>
						))}
					</Flex>
				</Box>
			))}
			{!readOnly && (
				<Button
					size='2xs'
					variant='outline'
					alignSelf='flex-start'
					onClick={() => onChange([...rows, Object.fromEntries((def.fields || []).filter(f => f.default !== undefined).map(f => [f.key, f.default]))])}>
					<Plus size={11} /> Add
				</Button>
			)}
		</Flex>
	);
};

/* ----------------------------------------------------------- one input */

type InputProps = {
	def: SbPropDef;
	value: any;
	ctx: InputContext;
	theme: string;
	readOnly: boolean;
	onChange: (v: any) => void;
};

export const PropInput: FC<InputProps> = memo(function PropInput({ def, value, ctx, theme, readOnly, onChange }) {
	const v = value ?? def.default;
	let input: React.ReactNode;
	switch (def.kind) {
		case 'text':
		case 'model':
		case 'field':
			input = (
				<Input
					size='xs'
					value={v ?? ''}
					readOnly={readOnly}
					onChange={e => onChange(e.target.value)}
				/>
			);
			break;
		case 'textarea':
			input = (
				<Textarea
					size='xs'
					rows={4}
					value={v ?? ''}
					readOnly={readOnly}
					onChange={e => onChange(e.target.value)}
				/>
			);
			break;
		case 'richtext':
			input = (
				<RichText
					value={v ?? ''}
					readOnly={readOnly}
					onChange={onChange}
				/>
			);
			break;
		case 'number':
			input = (
				<Input
					size='xs'
					type='number'
					min={def.min}
					max={def.max}
					value={v ?? ''}
					readOnly={readOnly}
					onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value))}
				/>
			);
			break;
		case 'boolean':
			return (
				<Field
					title={def.label}
					help={def.help}
					inline>
					<Switch.Root
						size='sm'
						checked={!!v}
						disabled={readOnly}
						onCheckedChange={e => onChange(!!e.checked)}>
						<Switch.HiddenInput />
						<Switch.Control />
						<Switch.Label fontSize='12px'>{def.label}</Switch.Label>
					</Switch.Root>
				</Field>
			);
		case 'select':
			input = (
				<Dropdown
					size='xs'
					value={v === undefined || v === null ? '' : String(v)}
					disabled={readOnly}
					onChange={s => onChange((def.options || []).find(o => String(o.value) === s)?.value ?? s)}
					items={(def.options || []).map(o => ({ value: String(o.value), label: o.label }))}
				/>
			);
			break;
		case 'color':
			input = (
				<ColorPick
					value={v}
					manifest={ctx.manifest}
					theme={theme}
					readOnly={readOnly}
					onChange={onChange}
				/>
			);
			break;
		case 'image':
		case 'video':
			input = (
				<MediaPick
					kind={def.kind}
					value={v ?? ''}
					readOnly={readOnly}
					onChange={onChange}
				/>
			);
			break;
		case 'images':
			input = (
				<Images
					value={Array.isArray(v) ? v : []}
					readOnly={readOnly}
					onChange={onChange}
				/>
			);
			break;
		case 'link':
			input = (
				<Flex
					direction='column'
					gap={1}>
					<Input
						size='xs'
						value={v ?? ''}
						readOnly={readOnly}
						placeholder='/about, https://…, mailto:, tel:'
						onChange={e => onChange(e.target.value.trim())}
					/>
					{!readOnly && ctx.pages.length > 0 && (
						<Dropdown
							size='xs'
							value=''
							placeholder='Or pick a page'
							onChange={path => path && onChange(path)}
							items={ctx.pages.map(p => ({ value: p.path, label: `${p.name} — ${p.path}` }))}
						/>
					)}
				</Flex>
			);
			break;
		case 'page':
			input = (
				<Dropdown
					size='xs'
					value={v ?? ''}
					disabled={readOnly}
					onChange={onChange}
					items={ctx.pages.map(p => ({ value: p.id, label: `${p.name} — ${p.path}` }))}
				/>
			);
			break;
		case 'icon':
			input = (
				<IconPicker
					value={v ?? ''}
					icons={ctx.manifest.icons}
					readOnly={readOnly}
					onChange={onChange}
				/>
			);
			break;
		case 'list':
			input = (
				<ListInput
					def={def}
					value={v}
					ctx={ctx}
					theme={theme}
					readOnly={readOnly}
					onChange={onChange}
				/>
			);
			break;
		default:
			input = (
				<Text
					fontSize='12px'
					color='fg.muted'>
					Set from Data (coming soon).
				</Text>
			);
	}
	return (
		<Field
			title={def.label}
			help={def.help}>
			{input}
		</Field>
	);
});

/* --------------------------------------------------------------- action */

type ActionKind = 'none' | 'page' | 'link' | 'scroll' | 'widget';

/** What a button, link, icon or image does when clicked (D12). Overlays (open/close) arrive with SB-06. */
export const ActionEditor: FC<{ node: SbNode; ctx: InputContext; readOnly: boolean; onChange: (action: any) => void }> = ({ node, ctx, readOnly, onChange }) => {
	const a: any = node.action || null;
	const kind: ActionKind = !a ? 'none' : ['page', 'link', 'scroll', 'widget'].includes(a.type) ? a.type : 'none';
	const set = (k: ActionKind) => {
		if (k === 'none') return onChange(null);
		if (k === 'page') return onChange({ type: 'page', pageId: ctx.pages[0]?.id || '' });
		if (k === 'link') return onChange({ type: 'link', href: '' });
		if (k === 'scroll') return onChange({ type: 'scroll', target: ctx.nodes.find(n => n.id !== node.id)?.id || '' });
		return onChange({ type: 'widget', widget: 'cart', op: 'open' });
	};
	return (
		<Flex
			direction='column'
			gap={2}>
			<Field title='When clicked'>
				<Dropdown
					size='xs'
					value={kind}
					disabled={readOnly}
					onChange={k => set(k as ActionKind)}
					items={[
						{ value: 'none', label: 'Nothing' },
						{ value: 'page', label: 'Go to a page' },
						{ value: 'link', label: 'Open a link' },
						{ value: 'scroll', label: 'Scroll to a block' },
						{ value: 'widget', label: 'Open a widget' },
					]}
				/>
			</Field>
			{kind === 'page' && (
				<Field title='Page'>
					<Dropdown
						size='xs'
						value={a.pageId}
						disabled={readOnly}
						onChange={pageId => onChange({ ...a, pageId })}
						items={ctx.pages.map(p => ({ value: p.id, label: `${p.name} — ${p.path}` }))}
					/>
				</Field>
			)}
			{kind === 'link' && (
				<Field
					title='Address'
					help='A path on your site (/about), a web address (https://…), mailto: or tel:.'>
					<Input
						size='xs'
						value={a.href}
						readOnly={readOnly}
						placeholder='https://…'
						onChange={e => onChange({ ...a, href: e.target.value.trim() })}
					/>
				</Field>
			)}
			{(kind === 'page' || kind === 'link') && (
				<Switch.Root
					size='sm'
					checked={!!a.newTab}
					disabled={readOnly}
					onCheckedChange={e => onChange({ ...a, newTab: !!e.checked || undefined })}>
					<Switch.HiddenInput />
					<Switch.Control />
					<Switch.Label fontSize='12px'>Open in a new tab</Switch.Label>
				</Switch.Root>
			)}
			{kind === 'scroll' && (
				<Field title='Block'>
					<Dropdown
						size='xs'
						value={a.target}
						disabled={readOnly}
						onChange={target => onChange({ ...a, target })}
						items={ctx.nodes.filter(n => n.id !== node.id).map(n => ({ value: n.id, label: n.label }))}
					/>
				</Field>
			)}
			{kind === 'widget' && (
				<Field
					title='Widget'
					help='Switch the widget on under Widgets first.'>
					<Dropdown
						size='xs'
						value={a.widget}
						disabled={readOnly}
						onChange={widget => onChange({ ...a, widget })}
						items={[
							{ value: 'cart', label: 'Cart' },
							{ value: 'login', label: 'Login & account' },
						]}
					/>
				</Field>
			)}
		</Flex>
	);
};
