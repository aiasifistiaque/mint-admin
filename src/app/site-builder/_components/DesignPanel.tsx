'use client';

import { FC, memo, useEffect, useMemo } from 'react';
import { Box, Button, Flex, Input, Switch, Text } from '@chakra-ui/react';
import { RotateCcw } from 'lucide-react';
import { Dropdown } from '@/components/library/cl';
import type { SbManifest, SbTheme } from '@/components/library/store/services/siteBuilderApi';
import { COLOR_GROUPS, COLOR_LABEL, CORNERS, fontPreviewHref, ROLE_WEIGHTS, SHADOWS, themeOf, weightsFor } from './designTokens';
import SiteGuide from './SiteGuide';
import type { DesignData } from './useDesign';

/**
 * The Design tab (docs/site-builder SB-07): the theme, the colour scheme, and
 * changes on top of the theme — colours (light and dark), fonts from the
 * curated list, corners, shadows, page width and buttons. Every page follows;
 * the content never changes. Changes are kept apart from the theme (the
 * design's `tokens`), so "Reset to the theme" and a theme switch both work.
 */

type Props = {
	manifest: SbManifest;
	data: DesignData;
	readOnly: boolean;
	set: (patch: Partial<DesignData>, key?: string) => string | null;
};

const Section: FC<{ title: string; guide?: string; action?: React.ReactNode; children: React.ReactNode }> = ({ title, guide, action, children }) => (
	<Box
		px={3}
		py={3}
		borderBottomWidth='1px'>
		<Flex
			align='center'
			justify='space-between'
			mb={2}>
			<Flex
				align='center'
				gap={1.5}>
				<Text
					fontSize='12.5px'
					fontWeight='600'>
					{title}
				</Text>
				{guide && <SiteGuide section={guide} />}
			</Flex>
			{action}
		</Flex>
		{children}
	</Box>
);

const Reset: FC<{ onClick: () => void; title: string }> = ({ onClick, title }) => (
	<Box
		as='button'
		title={title}
		aria-label={title}
		color='fg.muted'
		_hover={{ color: 'fg' }}
		onClick={onClick}>
		<RotateCcw size={12} />
	</Box>
);

/** Drops empty groups, so an override that matches the theme again leaves nothing behind. */
const clean = (t: any) => {
	const out: any = {};
	for (const [k, v] of Object.entries<any>(t || {})) {
		if (v && typeof v === 'object' && !Array.isArray(v)) {
			const inner = clean(v);
			if (Object.keys(inner).length) out[k] = inner;
		} else if (v !== undefined && v !== null) out[k] = v;
	}
	return out;
};

const HEX6 = /^#[0-9a-f]{6}$/i;
const asHex = (v: string) => (HEX6.test(v) ? v : /^#[0-9a-f]{3}$/i.test(v) ? `#${[...v.slice(1)].map(c => c + c).join('')}` : '#000000');

const ThemeCard: FC<{ theme: SbTheme; active: boolean; readOnly: boolean; onPick: () => void }> = ({ theme, active, readOnly, onPick }) => {
	const c = theme.tokens.colors;
	return (
		<Box
			as='button'
			textAlign='left'
			w='full'
			borderWidth={active ? '2px' : '1px'}
			borderColor={active ? 'blue.solid' : 'border'}
			borderRadius='md'
			overflow='hidden'
			aria-disabled={readOnly && !active}
			cursor={readOnly ? 'default' : 'pointer'}
			onClick={() => !readOnly && onPick()}>
			<Flex
				align='center'
				gap={2}
				px={3}
				h='56px'
				style={{ background: c.background.light, color: c.foreground.light }}>
				<Text
					fontSize='22px'
					fontWeight='700'
					color='inherit'
					style={{ fontFamily: `"${theme.tokens.fonts.heading.family}", sans-serif` }}>
					Aa
				</Text>
				<Box flex={1} />
				{['primary', 'accent', 'secondary', 'muted'].map(k => (
					<Box
						key={k}
						w='16px'
						h='16px'
						borderRadius='full'
						borderWidth='1px'
						borderColor='blackAlpha.200'
						style={{ background: c[k]?.light }}
					/>
				))}
				<Box
					px={2.5}
					py={1}
					fontSize='11px'
					fontWeight='600'
					style={{
						background: c.primary.light,
						color: c['primary-foreground'].light,
						borderRadius: theme.tokens.radius[theme.tokens.button.radius] || '6px',
					}}>
					Button
				</Box>
			</Flex>
			<Box
				px={3}
				py={2}>
				<Text
					fontSize='12.5px'
					fontWeight='600'>
					{theme.label}
					{active && (
						<Text
							as='span'
							fontWeight='400'
							color='fg.muted'>
							{' '}
							· in use
						</Text>
					)}
				</Text>
				<Text
					fontSize='11.5px'
					color='fg.muted'
					lineHeight='1.4'
					lineClamp={2}>
					{theme.description}
				</Text>
			</Box>
		</Box>
	);
};

const DesignPanel: FC<Props> = ({ manifest, data, readOnly, set }) => {
	const theme = themeOf(manifest, data.theme)!;
	const t = data.tokens || {};
	const changes = useMemo(() => {
		let n = 0;
		const walk = (o: any): void => Object.values(o || {}).forEach(v => (v && typeof v === 'object' && !Array.isArray(v) ? walk(v) : n++));
		walk(t);
		return n;
	}, [t]);

	// Every listed font, only the letters it needs, so the pickers can show each in its own face.
	useEffect(() => {
		const google = manifest.fonts?.google || [];
		if (!google.length || document.getElementById('sb-font-preview')) return;
		const link = document.createElement('link');
		link.id = 'sb-font-preview';
		link.rel = 'stylesheet';
		link.href = fontPreviewHref(google);
		document.head.appendChild(link);
	}, [manifest]);

	const setTokens = (fn: (draft: any) => void, key: string) => {
		const draft = structuredClone(t);
		fn(draft);
		set({ tokens: clean(draft) }, key);
	};

	/* colours */
	const color = (k: string, mode: 'light' | 'dark') => t.colors?.[k]?.[mode] || theme.tokens.colors[k]?.[mode];
	const setColor = (k: string, mode: 'light' | 'dark', v: string | null) =>
		setTokens(d => {
			d.colors = d.colors || {};
			d.colors[k] = { ...(d.colors[k] || {}) };
			if (v === null || v.toLowerCase() === theme.tokens.colors[k]?.[mode]?.toLowerCase()) delete d.colors[k][mode];
			else d.colors[k][mode] = v;
		}, `tokens:colors:${k}:${mode}`);

	/* fonts */
	const google = manifest.fonts?.google || [];
	const fontItems = (role: 'heading' | 'body' | 'mono') => [
		{ value: role === 'mono' ? 'monospace' : 'system-ui', label: role === 'mono' ? 'The device’s monospace font' : 'The device’s own font', group: 'System' },
		...google
			.filter(f => (role === 'mono' ? f.category === 'mono' : f.category !== 'mono'))
			.map(f => ({
				value: f.family,
				label: <span style={{ fontFamily: `"${f.family}", ${f.category === 'serif' ? 'serif' : 'sans-serif'}` }}>{f.family}</span>,
				group: { sans: 'Sans serif', serif: 'Serif', display: 'Display', mono: 'Monospace', hand: 'Handwriting' }[f.category],
			})),
	];
	const family = (role: 'heading' | 'body' | 'mono') => t.fonts?.[role]?.family || theme.tokens.fonts[role].family;
	const setFont = (role: 'heading' | 'body' | 'mono', fam: string) =>
		setTokens(d => {
			d.fonts = d.fonts || {};
			if (fam === theme.tokens.fonts[role].family) delete d.fonts[role];
			else d.fonts[role] = { family: fam, weights: weightsFor(google.find(f => f.family === fam), ROLE_WEIGHTS[role]) };
		}, `tokens:fonts:${role}`);

	/* corners, shadows, width, buttons */
	const radius = { ...theme.tokens.radius, ...(t.radius || {}) };
	const corner = CORNERS.find(c => Object.entries(c.radius).every(([k, v]) => radius[k] === v))?.key;
	const shadowSet = t.shadow ? SHADOWS.find(s => s.shadow && Object.entries(s.shadow).every(([k, v]) => t.shadow[k] === v))?.key : 'theme';
	const button = { ...theme.tokens.button, ...(t.button || {}) };
	const container = t.container ?? theme.tokens.container;

	const disabled = readOnly;

	return (
		<Box
			h='full'
			overflowY='auto'>
			<Section
				title='Theme'
				guide='design'
				action={
					changes > 0 && !readOnly ? (
						<Button
							size='2xs'
							variant='ghost'
							title='Drop every change below — colours, fonts, corners, buttons — and use the theme as it comes'
							onClick={() => set({ tokens: {} }, 'tokens:reset')}>
							<RotateCcw size={11} /> Reset to the theme
						</Button>
					) : null
				}>
				<Flex
					direction='column'
					gap={2}>
					{[...manifest.themes].sort((a, b) => (a.key === 'studio' ? -1 : b.key === 'studio' ? 1 : a.label.localeCompare(b.label))).map(th => (
						<ThemeCard
							key={th.key}
							theme={th}
							active={th.key === data.theme}
							readOnly={readOnly}
							onPick={() => set({ theme: th.key }, 'theme')}
						/>
					))}
				</Flex>
				{changes > 0 && (
					<Text
						mt={2}
						fontSize='11.5px'
						color='fg.muted'
						lineHeight='1.45'>
						{changes === 1 ? 'Your change below stays' : `Your ${changes} changes below stay`} on top of whichever theme you pick.
					</Text>
				)}
			</Section>

			<Section
				title='Light and dark'
				guide='design'>
				<Flex gap={1}>
					{(
						[
							['light', 'Light'],
							['dark', 'Dark'],
							['system', 'Visitor’s choice'],
						] as const
					).map(([v, label]) => (
						<Button
							key={v}
							size='2xs'
							flex={1}
							variant={data.colorScheme === v ? 'solid' : 'outline'}
							disabled={disabled}
							onClick={() => set({ colorScheme: v }, 'colorScheme')}>
							{label}
						</Button>
					))}
				</Flex>
				<Text
					mt={1.5}
					fontSize='11.5px'
					color='fg.muted'
					lineHeight='1.45'>
					{data.colorScheme === 'system'
						? 'Visitors see light or dark as their device is set. Preview both with the moon button above the page.'
						: `Visitors always see the ${data.colorScheme} colours. The moon button above the page only changes this preview.`}
				</Text>
			</Section>

			<Section
				title='Colours'
				guide='design'>
				<Flex
					justify='flex-end'
					gap={3}
					pr='18px'
					mb={1}
					fontSize='10.5px'
					color='fg.muted'>
					<Text
						w='28px'
						textAlign='center'
						whiteSpace='nowrap'>
						Light
					</Text>
					<Text
						w='28px'
						textAlign='center'
						whiteSpace='nowrap'>
						Dark
					</Text>
				</Flex>
				{COLOR_GROUPS.map(g => (
					<Box
						key={g.label}
						mb={2}>
						<Text
							fontSize='10.5px'
							fontWeight='600'
							textTransform='uppercase'
							letterSpacing='0.06em'
							color='fg.muted'
							mb={1}>
							{g.label}
						</Text>
						{g.keys
							.filter(k => theme.tokens.colors[k])
							.map(k => {
								const changed = !!(t.colors?.[k]?.light || t.colors?.[k]?.dark);
								return (
									<Flex
										key={k}
										align='center'
										gap={3}
										h='28px'>
										<Text
											flex={1}
											fontSize='12px'
											truncate
											title={k}>
											{COLOR_LABEL[k] || k}
										</Text>
										{(['light', 'dark'] as const).map(mode => (
											<Input
												key={mode}
												type='color'
												aria-label={`${COLOR_LABEL[k] || k} (${mode})`}
												title={`${color(k, mode)} — ${mode}`}
												w='28px'
												h='22px'
												p='1px'
												borderRadius='sm'
												cursor={disabled ? 'not-allowed' : 'pointer'}
												disabled={disabled}
												value={asHex(color(k, mode))}
												onChange={e => setColor(k, mode, e.target.value)}
											/>
										))}
										<Box w='12px'>
											{changed && !readOnly && (
												<Reset
													title='Back to the theme’s colour'
													onClick={() =>
														setTokens(d => {
															delete d.colors?.[k];
														}, `tokens:colors:${k}:reset`)
													}
												/>
											)}
										</Box>
									</Flex>
								);
							})}
					</Box>
				))}
			</Section>

			<Section
				title='Fonts'
				guide='design'>
				<Flex
					direction='column'
					gap={2}>
					{(
						[
							['heading', 'Headings'],
							['body', 'Text'],
							['mono', 'Code'],
						] as const
					).map(([role, label]) => (
						<Box key={role}>
							<Flex
								justify='space-between'
								mb={1}>
								<Text
									fontSize='11.5px'
									fontWeight='500'
									color='fg.muted'>
									{label}
								</Text>
								{t.fonts?.[role] && !readOnly && (
									<Reset
										title={`Back to ${theme.tokens.fonts[role].family}`}
										onClick={() =>
											setTokens(d => {
												delete d.fonts?.[role];
											}, `tokens:fonts:${role}:reset`)
										}
									/>
								)}
							</Flex>
							<Dropdown
								size='xs'
								value={family(role)}
								disabled={disabled}
								searchable
								onChange={f => setFont(role, f)}
								items={fontItems(role)}
							/>
						</Box>
					))}
				</Flex>
			</Section>

			<Section
				title='Shape'
				guide='design'>
				<Text
					fontSize='11.5px'
					fontWeight='500'
					color='fg.muted'
					mb={1}>
					Corners
				</Text>
				<Flex
					gap={1}
					mb={3}>
					{CORNERS.map(c => (
						<Button
							key={c.key}
							size='2xs'
							flex={1}
							variant={corner === c.key ? 'solid' : 'outline'}
							disabled={disabled}
							onClick={() =>
								setTokens(d => {
									const same = Object.entries(c.radius).every(([k, v]) => theme.tokens.radius[k] === v);
									if (same) delete d.radius;
									else d.radius = { ...c.radius };
								}, 'tokens:radius')
							}>
							{c.label}
						</Button>
					))}
				</Flex>
				<Text
					fontSize='11.5px'
					fontWeight='500'
					color='fg.muted'
					mb={1}>
					Shadows
				</Text>
				<Flex
					gap={1}
					mb={3}>
					{SHADOWS.map(s => (
						<Button
							key={s.key}
							size='2xs'
							flex={1}
							variant={shadowSet === s.key ? 'solid' : 'outline'}
							disabled={disabled}
							onClick={() =>
								setTokens(d => {
									if (s.shadow) d.shadow = { ...s.shadow };
									else delete d.shadow;
								}, 'tokens:shadow')
							}>
							{s.label}
						</Button>
					))}
				</Flex>
				<Flex
					align='center'
					justify='space-between'
					gap={2}>
					<Text
						fontSize='11.5px'
						fontWeight='500'
						color='fg.muted'>
						Page width
					</Text>
					<Flex
						align='center'
						gap={1}>
						<Input
							size='xs'
							type='number'
							w='76px'
							min={640}
							max={1920}
							step={20}
							value={container}
							disabled={disabled}
							onChange={e => {
								const n = Math.round(Number(e.target.value));
								if (!Number.isFinite(n)) return;
								setTokens(d => {
									if (n === theme.tokens.container || n < 640 || n > 1920) delete d.container;
									else d.container = n;
								}, 'tokens:container');
							}}
						/>
						<Text
							fontSize='11.5px'
							color='fg.muted'>
							px
						</Text>
					</Flex>
				</Flex>
			</Section>

			<Section
				title='Buttons'
				guide='design'>
				<Flex
					direction='column'
					gap={2}>
					<Flex
						gap={2}
						align='center'>
						<Text
							w='70px'
							fontSize='11.5px'
							color='fg.muted'>
							Corners
						</Text>
						<Box flex={1}>
							<Dropdown
								size='xs'
								value={button.radius}
								disabled={disabled}
								onChange={r => setTokens(d => void (d.button = { ...(d.button || {}), radius: r }), 'tokens:button:radius')}
								items={['none', 'sm', 'md', 'lg', 'xl', 'full'].map(r => ({ value: r, label: r === 'full' ? 'Pill' : r === 'none' ? 'Square' : r.toUpperCase() }))}
							/>
						</Box>
					</Flex>
					<Flex
						gap={2}
						align='center'>
						<Text
							w='70px'
							fontSize='11.5px'
							color='fg.muted'>
							Weight
						</Text>
						<Box flex={1}>
							<Dropdown
								size='xs'
								value={String(button.weight)}
								disabled={disabled}
								onChange={w => setTokens(d => void (d.button = { ...(d.button || {}), weight: Number(w) }), 'tokens:button:weight')}
								items={[
									['400', 'Regular'],
									['500', 'Medium'],
									['600', 'Semibold'],
									['700', 'Bold'],
									['800', 'Extra bold'],
								].map(([value, label]) => ({ value, label }))}
							/>
						</Box>
					</Flex>
					<Switch.Root
						size='sm'
						checked={!!button.uppercase}
						disabled={disabled}
						onCheckedChange={e => setTokens(d => void (d.button = { ...(d.button || {}), uppercase: !!e.checked }), 'tokens:button:uppercase')}>
						<Switch.HiddenInput />
						<Switch.Control />
						<Switch.Label fontSize='12px'>CAPITAL LETTERS</Switch.Label>
					</Switch.Root>
				</Flex>
			</Section>
		</Box>
	);
};

export default memo(DesignPanel);
