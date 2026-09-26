'use client';

import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { Interval, bucketLabel, formatCompact } from './types';

/**
 * The dashboard's charts, drawn as plain SVG / HTML (no chart library):
 *
 * - ColumnChart: a series over time as columns;
 * - LineChart: the same as a line, with a crosshair;
 * - BarList: a breakdown as horizontal bars, labelled and valued;
 * - DonutChart: a breakdown as a ring, with a legend of values and shares.
 *
 * Marks follow the data-viz spec: bars at most 24px thick with a 4px rounded
 * end and a square baseline, 2px lines, recessive grid, a 2px surface gap
 * between slices, a hover tooltip on every mark, and a screen-reader table.
 * Colours are the reference categorical palette (validated light and dark,
 * with the legend carrying the three light hues under 3:1 contrast); they're
 * data colours, deliberately not the admin theme's.
 */

export const PALETTE_CSS: any = {
	'--series-1': '#2a78d6',
	'--series-2': '#eb6834',
	'--series-3': '#1baf7a',
	'--series-4': '#eda100',
	'--series-5': '#e87ba4',
	'--series-6': '#008300',
	'--series-7': '#4a3aa7',
	'--series-other': '#a3a29c',
	'--surface': 'var(--chakra-colors-bg-panel)',
	_dark: {
		'--series-1': '#3987e5',
		'--series-2': '#d95926',
		'--series-3': '#199e70',
		'--series-4': '#c98500',
		'--series-5': '#d55181',
		'--series-6': '#008300',
		'--series-7': '#9085e9',
		'--series-other': '#6e6d68',
	},
};

export const seriesColor = (i: number) => `var(--series-${(i % 7) + 1})`;

type Point = { key: string; value: number };
type Slice = { key: string | null; label: string; value: number; other?: boolean };

/** Width of an element, following resizes. */
const useWidth = () => {
	const ref = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState(0);
	useEffect(() => {
		if (!ref.current) return;
		// Measured now too: the observer's first call waits for a frame, which a
		// background tab never draws.
		setWidth(Math.floor(ref.current.getBoundingClientRect().width));
		const ro = new ResizeObserver(([e]) => setWidth(Math.floor(e.contentRect.width)));
		ro.observe(ref.current);
		return () => ro.disconnect();
	}, []);
	return { ref, width };
};

/** A round top for the axis: 0–37 -> 40, ticks every 10. */
const niceScale = (max: number, ticks = 4) => {
	if (max <= 0) return { top: 1, step: 1 / ticks };
	const raw = max / ticks;
	const mag = Math.pow(10, Math.floor(Math.log10(raw)));
	const step = [1, 2, 2.5, 5, 10].map(f => f * mag).find(s => s >= raw) || 10 * mag;
	return { top: step * Math.ceil(max / step), step };
};

const Tooltip: FC<{ x: number; y: number; width: number; children: ReactNode }> = ({ x, y, width, children }) => (
	<Box
		position='absolute'
		left={`${Math.min(Math.max(x, 70), width - 70)}px`}
		top={`${y}px`}
		transform='translate(-50%, calc(-100% - 8px))'
		pointerEvents='none'
		bg='bg.panel'
		borderWidth='1px'
		borderColor='border'
		borderRadius='md'
		boxShadow='md'
		px={2.5}
		py={1.5}
		fontSize='xs'
		whiteSpace='nowrap'
		zIndex={2}>
		{children}
	</Box>
);

/** The numbers behind a chart, for screen readers. */
const SrTable: FC<{ caption: string; rows: [string, string][] }> = ({ caption, rows }) => (
	<Box
		as='table'
		srOnly>
		<caption>{caption}</caption>
		<tbody>
			{rows.map(([k, v], i) => (
				<tr key={i}>
					<th scope='row'>{k}</th>
					<td>{v}</td>
				</tr>
			))}
		</tbody>
	</Box>
);

const PAD = { left: 40, right: 8, top: 10, bottom: 22 };

type SeriesProps = {
	points: Point[];
	interval: Interval;
	/** A value as the tooltip shows it, with its unit. */
	format: (v: number) => string;
	title: string;
	height?: number;
};

/** Axes shared by the column and line charts. */
const Axes: FC<{ width: number; height: number; top: number; step: number; points: Point[]; interval: Interval }> = ({
	width,
	height,
	top,
	step,
	points,
	interval,
}) => {
	const innerW = width - PAD.left - PAD.right;
	const innerH = height - PAD.top - PAD.bottom;
	const ticks: number[] = [];
	for (let v = 0; v <= top + step / 2; v += step) ticks.push(v);
	const band = innerW / Math.max(points.length, 1);
	const every = Math.max(1, Math.ceil(points.length / Math.max(1, Math.floor(innerW / 56))));
	return (
		<g>
			{ticks.map(v => {
				const y = PAD.top + innerH - (v / top) * innerH;
				return (
					<g key={v}>
						<line
							x1={PAD.left}
							x2={width - PAD.right}
							y1={y}
							y2={y}
							stroke='var(--chakra-colors-border-muted)'
							strokeWidth={1}
						/>
						<text
							x={PAD.left - 6}
							y={y}
							textAnchor='end'
							dominantBaseline='middle'
							fontSize={10}
							fill='var(--chakra-colors-fg-muted)'>
							{formatCompact(v)}
						</text>
					</g>
				);
			})}
			{points.map((p, i) =>
				i % every === 0 ? (
					<text
						key={p.key}
						x={PAD.left + band * i + band / 2}
						y={height - 6}
						textAnchor='middle'
						fontSize={10}
						fill='var(--chakra-colors-fg-muted)'>
						{bucketLabel(p.key, interval)}
					</text>
				) : null
			)}
		</g>
	);
};

/** A column with a 4px rounded top and a square foot on the baseline. */
const columnPath = (x: number, y: number, w: number, h: number) => {
	const r = Math.min(4, w / 2, h);
	return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
};

export const ColumnChart: FC<SeriesProps> = ({ points, interval, format, title, height = 200 }) => {
	const { ref, width } = useWidth();
	const [hover, setHover] = useState<number | null>(null);
	const max = Math.max(0, ...points.map(p => p.value));
	const { top, step } = niceScale(max);
	const innerW = Math.max(0, width - PAD.left - PAD.right);
	const innerH = height - PAD.top - PAD.bottom;
	const band = innerW / Math.max(points.length, 1);
	const barW = Math.max(2, Math.min(24, band - 2));
	return (
		<Box
			ref={ref}
			position='relative'
			w='full'
			h={`${height}px`}
			css={PALETTE_CSS}>
			{width > 0 && (
				<svg
					width={width}
					height={height}
					role='img'
					aria-label={title}>
					<Axes {...{ width, height, top, step, points, interval }} />
					{points.map((p, i) => {
						const h = (p.value / top) * innerH;
						const x = PAD.left + band * i + (band - barW) / 2;
						return (
							<g key={p.key}>
								{h > 0 && (
									<path
										d={columnPath(x, PAD.top + innerH - h, barW, h)}
										fill='var(--series-1)'
										opacity={hover === null || hover === i ? 1 : 0.45}
									/>
								)}
								{/* The hit target: the whole band, taller than the mark. */}
								<rect
									x={PAD.left + band * i}
									y={PAD.top}
									width={band}
									height={innerH}
									fill='transparent'
									onMouseEnter={() => setHover(i)}
									onMouseLeave={() => setHover(null)}
								/>
							</g>
						);
					})}
				</svg>
			)}
			{hover !== null && points[hover] && (
				<Tooltip
					x={PAD.left + band * hover + band / 2}
					y={PAD.top + innerH - (points[hover].value / top) * innerH}
					width={width}>
					<Text color='fg.muted'>{bucketLabel(points[hover].key, interval, true)}</Text>
					<Text fontWeight='600'>{format(points[hover].value)}</Text>
				</Tooltip>
			)}
			<SrTable
				caption={title}
				rows={points.map(p => [bucketLabel(p.key, interval, true), format(p.value)])}
			/>
		</Box>
	);
};

export const LineChart: FC<SeriesProps> = ({ points, interval, format, title, height = 200 }) => {
	const { ref, width } = useWidth();
	const [hover, setHover] = useState<number | null>(null);
	const max = Math.max(0, ...points.map(p => p.value));
	const { top, step } = niceScale(max);
	const innerW = Math.max(0, width - PAD.left - PAD.right);
	const innerH = height - PAD.top - PAD.bottom;
	const band = innerW / Math.max(points.length, 1);
	const xy = (i: number) => [PAD.left + band * i + band / 2, PAD.top + innerH - (points[i].value / top) * innerH];
	const line = points.map((_, i) => `${i ? 'L' : 'M'}${xy(i).join(',')}`).join('');
	const area = points.length
		? `${line}L${xy(points.length - 1)[0]},${PAD.top + innerH}L${xy(0)[0]},${PAD.top + innerH}Z`
		: '';
	return (
		<Box
			ref={ref}
			position='relative'
			w='full'
			h={`${height}px`}
			css={PALETTE_CSS}>
			{width > 0 && points.length > 0 && (
				<svg
					width={width}
					height={height}
					role='img'
					aria-label={title}
					onMouseMove={e => {
						const box = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
						const i = Math.floor((e.clientX - box.left - PAD.left) / band);
						setHover(i >= 0 && i < points.length ? i : null);
					}}
					onMouseLeave={() => setHover(null)}>
					<Axes {...{ width, height, top, step, points, interval }} />
					<path
						d={area}
						fill='var(--series-1)'
						opacity={0.1}
					/>
					<path
						d={line}
						fill='none'
						stroke='var(--series-1)'
						strokeWidth={2}
						strokeLinejoin='round'
						strokeLinecap='round'
					/>
					{hover !== null && (
						<>
							<line
								x1={xy(hover)[0]}
								x2={xy(hover)[0]}
								y1={PAD.top}
								y2={PAD.top + innerH}
								stroke='var(--chakra-colors-border-emphasized)'
								strokeWidth={1}
							/>
							<circle
								cx={xy(hover)[0]}
								cy={xy(hover)[1]}
								r={4}
								fill='var(--series-1)'
								stroke='var(--surface)'
								strokeWidth={2}
							/>
						</>
					)}
				</svg>
			)}
			{hover !== null && points[hover] && (
				<Tooltip
					x={xy(hover)[0]}
					y={xy(hover)[1]}
					width={width}>
					<Text color='fg.muted'>{bucketLabel(points[hover].key, interval, true)}</Text>
					<Text fontWeight='600'>{format(points[hover].value)}</Text>
				</Tooltip>
			)}
			<SrTable
				caption={title}
				rows={points.map(p => [bucketLabel(p.key, interval, true), format(p.value)])}
			/>
		</Box>
	);
};

type BreakdownProps = { slices: Slice[]; format: (v: number) => string; title: string };

/** A breakdown as labelled horizontal bars, biggest first. */
export const BarList: FC<BreakdownProps> = ({ slices, format, title }) => {
	const max = Math.max(0, ...slices.map(s => s.value));
	return (
		<Flex
			direction='column'
			gap={2}
			css={PALETTE_CSS}>
			{slices.map((s, i) => (
				<Box
					key={`${s.key}-${i}`}
					title={`${s.label}: ${format(s.value)}`}
					borderRadius='sm'
					_hover={{ bg: 'bg.muted' }}
					px={1}
					py={0.5}>
					<Flex
						justify='space-between'
						gap={3}
						fontSize='xs'
						mb={1}>
						<Text
							truncate
							color={s.other ? 'fg.muted' : 'fg'}>
							{s.label}
						</Text>
						<Text
							fontWeight='600'
							flexShrink={0}>
							{format(s.value)}
						</Text>
					</Flex>
					<Box
						h='10px'
						bg='bg.muted'
						borderRadius='0 4px 4px 0'>
						<Box
							h='full'
							w={`${max ? Math.max(1, (s.value / max) * 100) : 0}%`}
							bg={s.other ? 'var(--series-other)' : 'var(--series-1)'}
							borderRadius='0 4px 4px 0'
						/>
					</Box>
				</Box>
			))}
			<SrTable
				caption={title}
				rows={slices.map(s => [s.label, format(s.value)])}
			/>
		</Flex>
	);
};

/** An annular sector from angle a0 to a1 (radians, 0 = top). */
const arc = (cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) => {
	const p = (r: number, a: number) => [cx + r * Math.sin(a), cy - r * Math.cos(a)];
	const large = a1 - a0 > Math.PI ? 1 : 0;
	const [x0, y0] = p(r1, a0);
	const [x1, y1] = p(r1, a1);
	const [x2, y2] = p(r0, a1);
	const [x3, y3] = p(r0, a0);
	return `M${x0},${y0}A${r1},${r1} 0 ${large} 1 ${x1},${y1}L${x2},${y2}A${r0},${r0} 0 ${large} 0 ${x3},${y3}Z`;
};

export const DonutChart: FC<BreakdownProps & { total?: number }> = ({ slices, format, title, total }) => {
	const [hover, setHover] = useState<number | null>(null);
	const sum = slices.reduce((a, s) => a + s.value, 0);
	const size = 150;
	const c = size / 2;
	let at = 0;
	const arcs = slices.map((s, i) => {
		const a0 = at;
		const a1 = sum ? at + (s.value / sum) * Math.PI * 2 : at;
		at = a1;
		// A single slice is a full ring: two halves, as one arc can't close on itself.
		return { s, i, d: a1 - a0 >= Math.PI * 2 - 1e-6 ? [arc(c, c, 46, 70, 0, Math.PI), arc(c, c, 46, 70, Math.PI, Math.PI * 2)] : [arc(c, c, 46, 70, a0, a1)] };
	});
	const colorOf = (s: Slice, i: number) => (s.other ? 'var(--series-other)' : seriesColor(i));
	const shown = hover !== null ? slices[hover] : null;
	return (
		<Flex
			gap={5}
			align='center'
			flexWrap='wrap'
			justify='center'
			css={PALETTE_CSS}>
			<Box
				position='relative'
				w={`${size}px`}
				h={`${size}px`}
				flexShrink={0}>
				<svg
					width={size}
					height={size}
					role='img'
					aria-label={title}>
					{sum === 0 && (
						<circle
							cx={c}
							cy={c}
							r={58}
							fill='none'
							stroke='var(--chakra-colors-bg-muted)'
							strokeWidth={24}
						/>
					)}
					{arcs.map(({ s, i, d }) =>
						d.map((path, j) => (
							<path
								key={`${i}-${j}`}
								d={path}
								fill={colorOf(s, i)}
								stroke='var(--surface)'
								strokeWidth={2}
								opacity={hover === null || hover === i ? 1 : 0.45}
								onMouseEnter={() => setHover(i)}
								onMouseLeave={() => setHover(null)}
							/>
						))
					)}
				</svg>
				<Flex
					position='absolute'
					inset={0}
					direction='column'
					align='center'
					justify='center'
					pointerEvents='none'
					textAlign='center'
					px={8}>
					<Text
						fontSize={shown ? 'sm' : 'md'}
						fontWeight='700'
						lineHeight='1.2'>
						{format(shown ? shown.value : total ?? sum)}
					</Text>
					<Text
						fontSize='10px'
						color='fg.muted'
						truncate
						maxW='full'>
						{shown ? shown.label : 'Total'}
					</Text>
				</Flex>
			</Box>
			<Flex
				as='ul'
				direction='column'
				gap={1.5}
				flex='1'
				minW='150px'
				listStyleType='none'>
				{slices.map((s, i) => (
					<Flex
						as='li'
						key={`${s.key}-${i}`}
						align='center'
						gap={2}
						fontSize='xs'
						px={1}
						borderRadius='sm'
						bg={hover === i ? 'bg.muted' : undefined}
						onMouseEnter={() => setHover(i)}
						onMouseLeave={() => setHover(null)}>
						<Box
							w='10px'
							h='10px'
							borderRadius='2px'
							flexShrink={0}
							bg={colorOf(s, i)}
						/>
						<Text
							truncate
							flex='1'
							color={s.other ? 'fg.muted' : 'fg'}>
							{s.label}
						</Text>
						<Text fontWeight='600'>{format(s.value)}</Text>
						<Text
							color='fg.muted'
							w='38px'
							textAlign='right'>
							{sum ? `${Math.round((s.value / sum) * 100)}%` : '—'}
						</Text>
					</Flex>
				))}
			</Flex>
			<SrTable
				caption={title}
				rows={slices.map(s => [s.label, format(s.value)])}
			/>
		</Flex>
	);
};
