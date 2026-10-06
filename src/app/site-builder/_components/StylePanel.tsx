'use client';

import { FC, memo, useMemo, useState } from 'react';
import { Box, Button, Flex, IconButton, Input, Text } from '@chakra-ui/react';
import { ChevronDown, ChevronRight, Monitor, RotateCcw, Smartphone, Tablet } from 'lucide-react';
import { Dropdown } from '@/components/library/cl';
import type { SbBlockDef, SbManifest, SbNode } from '@/components/library/store/services/siteBuilderApi';
import { ColorPick, MediaPick } from './PropInputs';
import SiteGuide from './SiteGuide';
import type { Op } from './tree';

/**
 * The selected block's styles (docs/site-builder SB-07): the fixed style keys
 * the block takes (manifest `style`, D14), per screen size. Phone is the base
 * every size starts from; Tablet (768 px up) and Desktop (1024 px up) change
 * only what they set. A blue dot marks a value set for the size being edited
 * (click it to reset); an orange ring marks one a bigger size changes.
 * Colours are theme colours only — a theme switch must still restyle them.
 */

export type Bp = 'base' | 'md' | 'lg';
const BPS: { key: Bp; label: string; short: string; icon: React.ReactNode; help: string }[] = [
	{ key: 'base', label: 'Phone', short: 'phone', icon: <Smartphone size={13} />, help: 'Phone and up — every size, unless a bigger one changes it' },
	{ key: 'md', label: 'Tablet', short: 'tablet', icon: <Tablet size={13} />, help: 'Tablet and up (768 px and wider)' },
	{ key: 'lg', label: 'Desktop', short: 'desktop', icon: <Monitor size={13} />, help: 'Desktop (1024 px and wider)' },
];
const ORDER: Bp[] = ['base', 'md', 'lg'];

type StyleKeyDef = SbManifest['style'][string];
type StyleMap = Partial<Record<Bp, Record<string, any>>>;

const GROUPS: { key: string; label: string; keys: string[] }[] = [
	{ key: 'layout', label: 'Layout', keys: ['display', 'direction', 'wrap', 'align', 'justify', 'gap', 'rowGap', 'columns', 'colSpan'] },
	{ key: 'spacing', label: 'Spacing', keys: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft'] },
	{ key: 'size', label: 'Size', keys: ['width', 'maxWidth', 'minHeight', 'height', 'aspectRatio'] },
	{ key: 'background', label: 'Background', keys: ['bgColor', 'gradient', 'bgImage', 'bgPosition', 'bgSize', 'bgOverlay', 'bgOverlayOpacity'] },
	{ key: 'border', label: 'Border', keys: ['borderWidth', 'borderColor', 'radius', 'shadow'] },
	{ key: 'type', label: 'Text', keys: ['fontSize', 'fontWeight', 'textAlign', 'color', 'leading', 'tracking', 'transform'] },
	{ key: 'effects', label: 'Effects', keys: ['opacity', 'position', 'top', 'zIndex', 'overflow'] },
];

const LABEL: Record<string, string> = {
	display: 'Display',
	direction: 'Direction',
	wrap: 'Wrap',
	align: 'Align items',
	justify: 'Spread items',
	gap: 'Gap',
	rowGap: 'Row gap',
	columns: 'Columns',
	colSpan: 'Spans columns',
	paddingTop: 'Top',
	paddingRight: 'Right',
	paddingBottom: 'Bottom',
	paddingLeft: 'Left',
	marginTop: 'Top',
	marginRight: 'Right',
	marginBottom: 'Bottom',
	marginLeft: 'Left',
	width: 'Width',
	maxWidth: 'Max width',
	minHeight: 'Min height',
	height: 'Height',
	aspectRatio: 'Shape',
	bgColor: 'Colour',
	gradient: 'Gradient',
	bgImage: 'Image',
	bgPosition: 'Image position',
	bgSize: 'Image fit',
	bgOverlay: 'Overlay colour',
	bgOverlayOpacity: 'Overlay strength (%)',
	borderWidth: 'Width',
	borderColor: 'Colour',
	radius: 'Corners',
	shadow: 'Shadow',
	fontSize: 'Size',
	fontWeight: 'Weight',
	textAlign: 'Align',
	color: 'Colour',
	leading: 'Line height',
	tracking: 'Letter spacing',
	transform: 'Case',
	opacity: 'Opacity (%)',
	position: 'Position',
	top: 'Sticks at (from the top)',
	zIndex: 'Layer (0–50)',
	overflow: 'Overflow',
};

const VALUE_LABEL: Record<string, Record<string, string>> = {
	display: { block: 'Block', flex: 'Flex (row or column)', grid: 'Grid', none: 'Hidden' },
	direction: { row: 'Side by side', column: 'Stacked', 'row-reverse': 'Side by side, reversed', 'column-reverse': 'Stacked, reversed' },
	wrap: { wrap: 'Wrap onto new lines', nowrap: 'Keep on one line' },
	align: { start: 'Start', center: 'Centre', end: 'End', stretch: 'Stretch', baseline: 'Text baseline' },
	justify: { start: 'Start', center: 'Centre', end: 'End', between: 'Space between', around: 'Space around', evenly: 'Space evenly' },
	textAlign: { left: 'Left', center: 'Centre', right: 'Right', justify: 'Justified' },
	transform: { none: 'As typed', uppercase: 'UPPERCASE', lowercase: 'lowercase', capitalize: 'Capitalised' },
	fontWeight: { 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'Semibold', 700: 'Bold', 800: 'Extra bold' },
	borderWidth: { 0: 'None', 1: '1 px', 2: '2 px', 3: '3 px', 4: '4 px' },
	bgSize: { cover: 'Fill (crop)', contain: 'Fit (whole image)', auto: 'Actual size' },
	width: { auto: 'Fit the content', full: 'Full width' },
	height: { auto: 'Fit the content' },
	maxWidth: { prose: 'Reading width', sm: 'Small', md: 'Medium', lg: 'Large', xl: 'Extra large', container: 'Page width', full: 'No limit' },
	colSpan: { full: 'Every column' },
	position: { static: 'Normal', relative: 'Relative', sticky: 'Sticks when scrolling' },
};

const isEmpty = (o: any) => !o || !Object.keys(o).length;

/** The value in effect at `bp`: its own, else the nearest smaller size's. */
const effective = (style: StyleMap | undefined, bp: Bp, key: string) => {
	for (let i = ORDER.indexOf(bp); i >= 0; i--) {
		const v = style?.[ORDER[i]]?.[key];
		if (v !== undefined) return { value: v, from: ORDER[i] };
	}
	return { value: undefined, from: null as Bp | null };
};

const show = (key: string, v: any, space: Record<string, string>): string => {
	if (v === undefined || v === null) return 'not set';
	if (typeof v === 'object' && 'n' in v) return `${v.n} ${v.unit}`;
	if (typeof v === 'object' && 'from' in v) return `${v.from} → ${v.to}`;
	const l = VALUE_LABEL[key]?.[String(v)];
	if (l) return l;
	if (space[String(v)] && /padding|margin|gap|top|rowGap/i.test(key)) return `${v} · ${space[String(v)]}`;
	return String(v);
};

type FieldProps = {
	k: string;
	def: StyleKeyDef;
	style: StyleMap | undefined;
	bp: Bp;
	colors: Record<string, string>;
	space: Record<string, string>;
	readOnly: boolean;
	onSet: (key: string, value: any) => void;
	onClearLarger: (key: string) => void;
	label?: string;
};

/** Blue dot: set for this size (click to reset). Orange ring: a bigger size changes it. */
const Markers: FC<{ k: string; style: StyleMap | undefined; bp: Bp; readOnly: boolean; onSet: FieldProps['onSet']; onClearLarger: FieldProps['onClearLarger'] }> = ({ k, style, bp, readOnly, onSet, onClearLarger }) => {
	const own = style?.[bp]?.[k] !== undefined;
	const larger = ORDER.slice(ORDER.indexOf(bp) + 1).filter(b => style?.[b]?.[k] !== undefined);
	const name = BPS.find(b => b.key === bp)!.short;
	return (
		<Flex
			gap={1}
			align='center'>
			{larger.length > 0 && (
				<Box
					as='button'
					aria-label='Changed on bigger screens'
					title={`Changed on ${larger.map(b => BPS.find(x => x.key === b)!.short).join(' and ')}${readOnly ? '' : ' — click to use this size’s value there too'}`}
					w='9px'
					h='9px'
					borderRadius='full'
					borderWidth='2px'
					borderColor='orange.solid'
					onClick={() => !readOnly && onClearLarger(k)}
				/>
			)}
			{own && (
				<Box
					as='button'
					aria-label={`Reset for ${name}`}
					title={bp === 'base' ? 'Set here — click to clear it' : `Set for ${name} and up — click to reset to the smaller size’s value`}
					w='9px'
					h='9px'
					borderRadius='full'
					bg='blue.solid'
					onClick={() => !readOnly && onSet(k, null)}
				/>
			)}
		</Flex>
	);
};

const Row: FC<{ label: string; children: React.ReactNode; markers: React.ReactNode }> = ({ label, children, markers }) => (
	<Box>
		<Flex
			align='center'
			justify='space-between'
			mb={1}>
			<Text
				fontSize='11.5px'
				fontWeight='500'
				color='fg.muted'>
				{label}
			</Text>
			{markers}
		</Flex>
		{children}
	</Box>
);

const UNITS = ['px', 'rem', '%', 'vh', 'vw'];

const StyleField: FC<FieldProps> = ({ k, def, style, bp, colors, space, readOnly, onSet, onClearLarger, label }) => {
	const own = style?.[bp]?.[k];
	const eff = effective(style, bp, k);
	const inherited = own === undefined && eff.from !== null && eff.from !== bp ? eff.value : undefined;
	const inheritLabel =
		bp === 'base' ? 'Default' : inherited !== undefined ? `As on ${BPS.find(b => b.key === eff.from)!.short} (${show(k, inherited, space)})` : 'Default';
	const markers = (
		<Markers
			k={k}
			style={style}
			bp={bp}
			readOnly={readOnly}
			onSet={onSet}
			onClearLarger={onClearLarger}
		/>
	);
	const values = (def.values || []) as (string | number)[];
	const pick = (items: (string | number)[]) => (
		<Dropdown
			size='xs'
			value={own === undefined ? '' : String(own)}
			disabled={readOnly}
			onChange={s => onSet(k, s === '' ? null : (items.find(x => String(x) === s) ?? s))}
			items={[{ value: '', label: inheritLabel }, ...items.map(x => ({ value: String(x), label: show(k, x, space) }))]}
		/>
	);

	let input: React.ReactNode;
	switch (def.kind) {
		case 'enum':
		case 'space':
			input = pick(values);
			break;
		case 'int': {
			const span = (def.max ?? 0) - (def.min ?? 0);
			if (span <= 12 || def.also?.length) {
				const list: (string | number)[] = [];
				for (let i = def.min ?? 0; i <= (def.max ?? 0); i++) list.push(i);
				input = pick([...list, ...(def.also || [])]);
			} else
				input = (
					<Input
						size='xs'
						type='number'
						min={def.min}
						max={def.max}
						placeholder={inherited !== undefined ? String(inherited) : ''}
						value={own ?? ''}
						readOnly={readOnly}
						onChange={e => {
							const n = e.target.value === '' ? null : Math.round(Number(e.target.value));
							onSet(k, n === null ? null : Math.min(def.max ?? n, Math.max(def.min ?? n, n)));
						}}
					/>
				);
			break;
		}
		case 'color':
			input = (
				<ColorPick
					value={own ?? inherited}
					names={values as string[]}
					colors={colors}
					readOnly={readOnly}
					onChange={c => onSet(k, c)}
				/>
			);
			break;
		case 'length': {
			const words = values as string[];
			const custom = own && typeof own === 'object';
			const mode = own === undefined ? '' : custom ? 'custom' : String(own);
			input = (
				<Flex gap={1}>
					<Box flex={1}>
						<Dropdown
							size='xs'
							value={mode}
							disabled={readOnly}
							onChange={m => onSet(k, m === '' ? null : m === 'custom' ? (custom ? own : { n: 100, unit: k === 'minHeight' || k === 'height' ? 'px' : '%' }) : m)}
							items={[
								{ value: '', label: inheritLabel },
								...words.map(w => ({ value: w, label: show(k, w, space) })),
								{ value: 'custom', label: 'A size…' },
							]}
						/>
					</Box>
					{custom && (
						<>
							<Input
								size='xs'
								type='number'
								w='64px'
								min={0}
								max={def.units?.[own.unit]}
								value={own.n}
								readOnly={readOnly}
								onChange={e => onSet(k, { ...own, n: Math.max(0, Math.min(def.units?.[own.unit] ?? 4000, Number(e.target.value) || 0)) })}
							/>
							<Box w='64px'>
								<Dropdown
									size='xs'
									value={own.unit}
									disabled={readOnly}
									onChange={u => onSet(k, { n: Math.min(own.n, def.units?.[u] ?? own.n), unit: u })}
									items={UNITS.map(u => ({ value: u, label: u }))}
								/>
							</Box>
						</>
					)}
				</Flex>
			);
			break;
		}
		case 'url':
			input = (
				<MediaPick
					kind='image'
					value={own ?? ''}
					readOnly={readOnly}
					onChange={v => onSet(k, v || null)}
				/>
			);
			break;
		case 'gradient': {
			const g = own || null;
			const names = (Object.keys(colors).length ? [...Object.keys(colors), 'transparent', 'white', 'black'] : []) as string[];
			input = g ? (
				<Flex
					gap={1}
					align='center'>
					{(['from', 'to'] as const).map(end => (
						<Box
							key={end}
							flex={1}>
							<Dropdown
								size='xs'
								value={g[end]}
								disabled={readOnly}
								onChange={c => onSet(k, { ...g, [end]: c })}
								items={names.map(n => ({ value: n, label: n }))}
							/>
						</Box>
					))}
					<Input
						size='xs'
						type='number'
						w='56px'
						min={0}
						max={360}
						title='Angle (degrees)'
						value={g.angle}
						readOnly={readOnly}
						onChange={e => onSet(k, { ...g, angle: Math.max(0, Math.min(360, Math.round(Number(e.target.value) || 0))) })}
					/>
				</Flex>
			) : (
				<Button
					size='2xs'
					variant='outline'
					disabled={readOnly}
					onClick={() => onSet(k, { from: 'primary', to: 'accent', angle: 135 })}>
					Add a gradient
				</Button>
			);
			break;
		}
	}
	return (
		<Row
			label={label || LABEL[k] || k}
			markers={markers}>
			{input}
		</Row>
	);
};

/* -------------------------------------------------------- visibility */

const hiddenAt = (hidden: SbNode['hidden'], bp: Bp) => {
	for (let i = ORDER.indexOf(bp); i >= 0; i--) {
		const v = hidden?.[ORDER[i]];
		if (v !== undefined) return !!v;
	}
	return false;
};

/** Shown on phone / tablet / desktop, as the smallest `hidden` that says so. */
const Visibility: FC<{ node: SbNode; readOnly: boolean; apply: Props['apply'] }> = ({ node, readOnly, apply }) => {
	const now = ORDER.map(b => hiddenAt(node.hidden, b));
	const toggle = (i: number) => {
		const next = now.map((h, j) => (j === i ? !h : h));
		const out: Record<string, boolean> = {};
		if (next[0]) out.base = true;
		if (next[1] !== next[0]) out.md = next[1];
		if (next[2] !== next[1]) out.lg = next[2];
		apply([{ op: 'update', id: node.id, hidden: isEmpty(out) ? null : out }]);
	};
	return (
		<Row
			label='Shown on'
			markers={null}>
			<Flex gap={1}>
				{BPS.map((b, i) => (
					<Button
						key={b.key}
						size='2xs'
						variant={now[i] ? 'outline' : 'subtle'}
						opacity={now[i] ? 0.55 : 1}
						textDecoration={now[i] ? 'line-through' : undefined}
						disabled={readOnly}
						title={now[i] ? `Hidden on ${b.short} — click to show it` : `Shown on ${b.short} — click to hide it`}
						onClick={() => toggle(i)}>
						{b.icon} {b.label}
					</Button>
				))}
			</Flex>
		</Row>
	);
};

/* ------------------------------------------------------------- panel */

type Props = {
	node: SbNode;
	def: SbBlockDef;
	manifest: SbManifest;
	bp: Bp;
	onBp: (bp: Bp) => void;
	colors: Record<string, string>;
	space: Record<string, string>;
	readOnly: boolean;
	apply: (ops: Op[], key?: string) => string | null;
};

const StylePanel: FC<Props> = ({ node, def, manifest, bp, onBp, colors, space, readOnly, apply }) => {
	const style = node.style as StyleMap | undefined;
	const groups = useMemo(() => GROUPS.filter(g => def.style === 'all' || def.style.includes(g.key)), [def.style]);
	const used = (g: (typeof GROUPS)[number]) => g.keys.some(k => ORDER.some(b => style?.[b]?.[k] !== undefined));
	const [open, setOpen] = useState<Record<string, boolean>>({});
	// Open at first: the groups in use, else the one that matters most for this kind of block.
	const main = groups.find(g => g.key === (def.category === 'basic' ? 'type' : def.category === 'media' ? 'size' : 'layout'))?.key ?? groups[0]?.key;
	const isOpen = (g: (typeof GROUPS)[number]) => open[g.key] ?? (used(g) || (g.key === main && !groups.some(used)));

	// Only what applies: flex / grid settings for blocks that hold others (or are set to flex / grid),
	// image settings once there's an image, the sticky offset for sticky blocks.
	const eff = (k: string) => effective(style, bp, k).value;
	const holds = !!def.slots?.children;
	const shown = (k: string) => {
		const display = eff('display');
		if (['direction', 'wrap'].includes(k)) return display === 'flex' || (holds && display !== 'grid' && display !== 'block');
		if (['align', 'justify', 'gap', 'rowGap'].includes(k)) return display === 'flex' || display === 'grid' || (holds && display !== 'block');
		if (k === 'columns') return display === 'grid' || (def.type === 'grid' && !display);
		if (['bgPosition', 'bgSize'].includes(k)) return !!eff('bgImage');
		if (['bgOverlay', 'bgOverlayOpacity'].includes(k)) return !!eff('bgImage') || !!eff('gradient');
		if (k === 'top') return eff('position') === 'sticky';
		return true;
	};

	const write = (next: StyleMap, key: string) => {
		const clean: StyleMap = {};
		for (const b of ORDER) if (!isEmpty(next[b])) clean[b] = next[b];
		apply([{ op: 'update', id: node.id, style: isEmpty(clean) ? null : clean }], key);
	};
	const onSet = (key: string, value: any) => {
		const at = { ...(style?.[bp] || {}) };
		if (value === null || value === undefined) delete at[key];
		else at[key] = value;
		write({ ...(style || {}), [bp]: at }, `${node.id}:style:${bp}:${key}`);
	};
	const onClearLarger = (key: string) => {
		const next: StyleMap = { ...(style || {}) };
		for (const b of ORDER.slice(ORDER.indexOf(bp) + 1))
			if (next[b]?.[key] !== undefined) {
				const { [key]: _, ...rest } = next[b]!;
				next[b] = rest;
			}
		write(next, `${node.id}:style:larger:${key}`);
	};
	const resetSize = () => {
		const { [bp]: _, ...rest } = style || {};
		write(rest, `${node.id}:style:reset`);
	};

	const field = (k: string, label?: string) =>
		manifest.style[k] ? (
			<StyleField
				key={k}
				k={k}
				def={manifest.style[k]}
				style={style}
				bp={bp}
				colors={colors}
				space={space}
				readOnly={readOnly}
				onSet={onSet}
				onClearLarger={onClearLarger}
				label={label}
			/>
		) : null;

	const count = (b: Bp) => Object.keys(style?.[b] || {}).length;

	return (
		<Box>
			{/* which screen size the styles are for — the same switch as the canvas's */}
			<Flex
				align='center'
				gap={1}
				mb={1}>
				{BPS.map(b => (
					<Button
						key={b.key}
						size='2xs'
						flex={1}
						variant={bp === b.key ? 'solid' : 'outline'}
						title={b.help}
						onClick={() => onBp(b.key)}>
						{b.icon} {b.label}
						{count(b.key) > 0 && (
							<Box
								as='span'
								fontSize='10px'
								opacity={0.8}>
								{count(b.key)}
							</Box>
						)}
					</Button>
				))}
				<SiteGuide section='breakpoints' />
			</Flex>
			<Flex
				align='center'
				justify='space-between'
				mb={3}>
				<Text
					fontSize='11.5px'
					color='fg.muted'>
					{BPS.find(b => b.key === bp)!.help}
				</Text>
				{!readOnly && count(bp) > 0 && (
					<IconButton
						size='2xs'
						variant='ghost'
						aria-label='Reset this size'
						title={`Clear every style set for ${BPS.find(b => b.key === bp)!.short}`}
						onClick={resetSize}>
						<RotateCcw size={12} />
					</IconButton>
				)}
			</Flex>

			{groups.map(g => (
				<Box
					key={g.key}
					borderTopWidth='1px'
					py={2}>
					<Flex
						as='button'
						w='full'
						align='center'
						gap={1}
						fontSize='12px'
						fontWeight='600'
						onClick={() => setOpen(o => ({ ...o, [g.key]: !isOpen(g) }))}>
						{isOpen(g) ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
						{g.label}
						{used(g) && (
							<Box
								ml={1}
								w='6px'
								h='6px'
								borderRadius='full'
								bg='blue.solid'
							/>
						)}
					</Flex>
					{isOpen(g) && (
						<Flex
							direction='column'
							gap={2.5}
							mt={2}>
							{g.key === 'spacing' ? (
								<>
									{(['padding', 'margin'] as const).map(kind => (
										<Box key={kind}>
											<Text
												fontSize='11.5px'
												fontWeight='600'
												mb={1}>
												{kind === 'padding' ? 'Padding (inside)' : 'Margin (outside)'}
											</Text>
											<Box
												display='grid'
												gridTemplateColumns='1fr 1fr'
												gap={2}>
												{['Top', 'Right', 'Bottom', 'Left'].map(side => field(`${kind}${side}`))}
											</Box>
										</Box>
									))}
								</>
							) : (
								g.keys.filter(shown).map(k => field(k))
							)}
							{g.key === 'effects' && (
								<Visibility
									node={node}
									readOnly={readOnly}
									apply={apply}
								/>
							)}
						</Flex>
					)}
				</Box>
			))}
		</Box>
	);
};

export default memo(StylePanel);
