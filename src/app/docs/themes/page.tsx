'use client';

import { FC, ReactNode, useEffect } from 'react';
import { Box, Flex, Grid, Link, Table, Text } from '@chakra-ui/react';
import { Layout } from '@/components/library';
import { PageHeader } from '@/components/library/cl';
import { Palette, THEMES } from '@/theme/palettes';

/**
 * Colour themes, explained — for everyone choosing one, and (at the end) for
 * developers adding a theme or building UI that should follow it. Linked from
 * the Themes window (`/docs/themes#<section>`), always in a new tab.
 *
 * Section ids are link targets in components/library/theme/ThemeModal.tsx;
 * rename one there too.
 */

const SECTIONS = [
	{ id: 'what', title: 'What a theme is' },
	{ id: 'choose', title: 'Choosing a theme' },
	{ id: 'modes', title: 'Light, dark and system' },
	{ id: 'themes', title: 'The themes' },
	{ id: 'saved', title: 'Where it’s saved' },
	{ id: 'fixed', title: 'What keeps its colour' },
	{ id: 'developers', title: 'For developers' },
	{ id: 'faq', title: 'Troubleshooting' },
];

const Section: FC<{ id: string; title: string; lead?: ReactNode; children: ReactNode }> = ({ id, title, lead, children }) => (
	<Box
		as='section'
		id={id}
		scrollMarginTop='24px'
		pt={8}
		pb={2}
		borderTopWidth='1px'
		borderColor='border.muted'
		_first={{ borderTopWidth: 0, pt: 0 }}>
		<Text
			as='h2'
			fontSize='lg'
			fontWeight='600'
			mb={lead ? 1 : 3}>
			<Link
				href={`#${id}`}
				color='fg'
				_hover={{ textDecoration: 'none', color: 'fg.muted' }}>
				{title}
			</Link>
		</Text>
		{lead && (
			<Text
				fontSize='sm'
				color='fg.muted'
				mb={4}>
				{lead}
			</Text>
		)}
		<Flex
			direction='column'
			gap={3}>
			{children}
		</Flex>
	</Box>
);

const P: FC<{ children: ReactNode }> = ({ children }) => (
	<Text
		fontSize='sm'
		lineHeight='1.7'>
		{children}
	</Text>
);

const C: FC<{ children: ReactNode }> = ({ children }) => (
	<Box
		as='code'
		fontFamily='mono'
		fontSize='0.85em'
		px={1}
		py={0.5}
		borderRadius='sm'
		bg='bg.muted'>
		{children}
	</Box>
);

const List: FC<{ items: ReactNode[]; ordered?: boolean }> = ({ items, ordered }) => (
	<Box
		as={ordered ? 'ol' : 'ul'}
		pl={5}
		fontSize='sm'
		lineHeight='1.7'
		listStyleType={ordered ? 'decimal' : 'disc'}>
		{items.map((item, i) => (
			<Box
				as='li'
				key={i}
				mb={1}>
				{item}
			</Box>
		))}
	</Box>
);

const Note: FC<{ children: ReactNode; tone?: 'warn' }> = ({ children, tone }) => (
	<Box
		px={4}
		py={3}
		borderLeftWidth='3px'
		borderColor={tone === 'warn' ? 'orange.solid' : 'border.emphasized'}
		bg='bg.subtle'
		borderRadius='sm'
		fontSize='sm'
		lineHeight='1.7'>
		{children}
	</Box>
);

const Terms: FC<{ head?: [string, string]; rows: [ReactNode, ReactNode][] }> = ({ head = ['Term', 'Meaning'], rows }) => (
	<Box
		borderWidth='1px'
		borderColor='border'
		borderRadius='md'
		overflowX='auto'>
		<Table.Root
			size='sm'
			variant='line'>
			<Table.Header>
				<Table.Row bg='bg.subtle'>
					{head.map(h => (
						<Table.ColumnHeader
							key={h}
							fontSize='11px'
							fontWeight='500'
							letterSpacing='0.04em'
							textTransform='uppercase'
							color='fg.muted'>
							{h}
						</Table.ColumnHeader>
					))}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{rows.map(([term, def], i) => (
					<Table.Row
						key={i}
						bg='transparent'>
						<Table.Cell
							fontSize='sm'
							fontWeight='500'
							verticalAlign='top'
							w='34%'
							minW='150px'>
							{term}
						</Table.Cell>
						<Table.Cell
							fontSize='sm'
							color='fg.muted'
							lineHeight='1.6'>
							{def}
						</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	</Box>
);

/** A theme's key colours in one mode, as literal swatches. */
const Swatches: FC<{ p: Palette }> = ({ p }) => (
	<Flex gap={1}>
		{[p.accent, p.page, p.surface, p.sidebar, p.border, p.text].map((c, i) => (
			<Box
				key={i}
				w='18px'
				h='18px'
				borderRadius='sm'
				borderWidth='1px'
				title={c}
				style={{ background: c, borderColor: p.border }}
			/>
		))}
	</Flex>
);

const ThemesDocs = () => {
	// The page renders after the auth check, so the browser's own jump to
	// `#section` has already happened (to nothing). Do it once content exists.
	useEffect(() => {
		const id = decodeURIComponent(window.location.hash.slice(1));
		if (id) document.getElementById(id)?.scrollIntoView();
	}, []);

	return (
		<Flex
			direction='column'
			gap={6}
			pb={16}>
			<PageHeader
				breadcrumbs={[
					{ href: '/dashboard', title: 'Home' },
					{ href: '/docs/themes', title: 'Themes guide' },
				]}
				title='Themes guide'
				meta='Colour themes for the admin panel — choosing one, light and dark, and how they work'
			/>

			<Grid
				templateColumns={{ base: '1fr', lg: '200px minmax(0, 1fr)' }}
				gap={10}
				alignItems='start'>
				<Box
					as='nav'
					display={{ base: 'none', lg: 'block' }}>
					<Text
						fontSize='11px'
						fontWeight='500'
						letterSpacing='0.04em'
						textTransform='uppercase'
						color='fg.muted'
						mb={2}>
						On this page
					</Text>
					<Flex
						direction='column'
						gap={1}>
						{SECTIONS.map(s => (
							<Link
								key={s.id}
								href={`#${s.id}`}
								fontSize='sm'
								color='fg.muted'
								_hover={{ color: 'fg', textDecoration: 'none' }}>
								{s.title}
							</Link>
						))}
					</Flex>
				</Box>

				<Box
					maxW='760px'
					minW={0}>
					<Section
						id='what'
						title='What a theme is'
						lead='A colour scheme for the whole admin panel: sidebar, navbar, pages, panels, tables, forms, menus and buttons.'>
						<P>
							Each theme is really two colour sets — one for <strong>light mode</strong> and one for{' '}
							<strong>dark mode</strong> — designed together, so switching mode keeps the same character. The theme
							also sets the <strong>accent</strong>: the colour of primary buttons, switches, links, selected items
							and focus outlines.
						</P>
						<P>
							Themes only change colours. Layout, text, data and what you have access to stay exactly the same.
						</P>
					</Section>

					<Section
						id='choose'
						title='Choosing a theme'
						lead='From the user menu, in the top-right corner of any page.'>
						<List
							ordered
							items={[
								<>
									Click your <strong>user icon</strong> in the top-right corner.
								</>,
								<>
									Choose <strong>Themes</strong>. A window opens with every theme, each shown in light and dark.
								</>,
								<>
									Click a theme. It applies at once — look around the page behind the window to see it.
								</>,
								<>
									Try others as often as you like, then press <strong>Done</strong>.
								</>,
							]}
						/>
						<P>The theme in use has a tick and an outline.</P>
					</Section>

					<Section
						id='modes'
						title='Light, dark and system'
						lead='Every theme has both. Which one you see is a separate choice.'>
						<Terms
							head={['Mode', 'What it does']}
							rows={[
								['Light', 'The light version of your theme.'],
								['Dark', 'The dark version of your theme.'],
								['System', 'Follows your computer or phone: light by day, dark at night if your device does that.'],
							]}
						/>
						<P>
							Change it with <strong>Mode</strong> at the top of the Themes window, or with the sun / moon button in
							the navbar. Both are the same switch.
						</P>
					</Section>

					<Section
						id='themes'
						title='The themes'
						lead='Swatches, left to right: accent, page, panels, sidebar, borders, text.'>
						<Box
							borderWidth='1px'
							borderColor='border'
							borderRadius='md'
							overflowX='auto'>
							<Table.Root
								size='sm'
								variant='line'>
								<Table.Header>
									<Table.Row bg='bg.subtle'>
										{['Theme', 'Light', 'Dark'].map(h => (
											<Table.ColumnHeader
												key={h}
												fontSize='11px'
												fontWeight='500'
												letterSpacing='0.04em'
												textTransform='uppercase'
												color='fg.muted'>
												{h}
											</Table.ColumnHeader>
										))}
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{THEMES.map(t => (
										<Table.Row
											key={t.id}
											bg='transparent'>
											<Table.Cell>
												<Text
													fontSize='sm'
													fontWeight='500'>
													{t.name}
												</Text>
												<Text
													fontSize='xs'
													color='fg.muted'>
													{t.description}
												</Text>
											</Table.Cell>
											<Table.Cell>
												<Swatches p={t.light} />
											</Table.Cell>
											<Table.Cell>
												<Swatches p={t.dark} />
											</Table.Cell>
										</Table.Row>
									))}
								</Table.Body>
							</Table.Root>
						</Box>
					</Section>

					<Section
						id='saved'
						title='Where it’s saved'
						lead='Your theme belongs to your account; your mode belongs to your browser.'>
						<List
							items={[
								<>
									<strong>Theme</strong> — saved to your account. Sign in on another computer or phone and it’s
									already there. Nobody else is affected: each person picks their own.
								</>,
								<>
									<strong>Light / dark / system</strong> — remembered by the browser you set it in, so a laptop and
									a phone can use different modes.
								</>,
								<>
									The browser also keeps a copy of your theme, so pages open in the right colours straight away
									instead of flashing the default first.
								</>,
							]}
						/>
					</Section>

					<Section
						id='fixed'
						title='What keeps its colour'
						lead='A few things look the same in every theme, on purpose.'>
						<Terms
							head={['What', 'Why']}
							rows={[
								[
									'Red, green and orange status colours',
									'Errors, warnings, “paid”, “overdue” and similar must mean the same thing whatever the theme.',
								],
								['QR codes', 'Scanners need dark-on-light.'],
								[
									'The search-result preview in SEO fields',
									'It shows what Google will display, in Google’s own colours.',
								],
								[
									'The rich-text editor’s writing area',
									'It stays white so its toolbar and your formatting stay legible.',
								],
								['Photos, logos and uploaded images', 'They’re your content, shown as uploaded.'],
							]}
						/>
					</Section>

					<Section
						id='developers'
						title='For developers'
						lead='How themes work, how to add one, and how to build UI that follows them.'>
						<P>
							Themes are defined in <C>src/theme/palettes.ts</C>: each has a <C>light</C> and a <C>dark</C>{' '}
							palette of named roles (accent, page, surface, border, text, sidebar…). <C>src/theme/applyTheme.ts</C>{' '}
							maps those roles onto the CSS variables Chakra generates for the admin’s colour tokens and writes them
							into one <C>{'<style id="admin-theme">'}</C>. Nothing reloads; every component using tokens follows.
						</P>
						<P>
							The choice is stored per admin as <C>Admin.theme</C> (saved through <C>PUT /auth/update/self</C>).{' '}
							<C>ThemeSync</C> applies it when the account loads, and a boot script in <C>app/layout.tsx</C>{' '}
							replays the last theme from <C>localStorage</C> before the first paint.
						</P>
						<P>
							<strong>Adding a theme:</strong> add an entry to <C>THEMES</C> with a stable <C>id</C>, a name, a
							description, and both palettes. Keep text readable on every surface and <C>accentFg</C> readable on{' '}
							<C>accent</C>, in both modes. Never rename an existing id — admins have it saved; an unknown id falls
							back to Default.
						</P>
						<P>
							<strong>Building UI that follows the theme:</strong> use tokens, never a literal colour.
						</P>
						<Terms
							head={['Use', 'For']}
							rows={[
								[<C key='a'>bg.panel · bg.subtle · bg.muted · bg.emphasized</C>, 'Surfaces, from cards to faint fills.'],
								[<C key='b'>fg · fg.muted · fg.subtle</C>, 'Text and icons.'],
								[<C key='c'>border · border.muted · border.emphasized</C>, 'Outlines and dividers.'],
								[
									<C key='d'>accent.solid · accent.contrast · accent.fg · accent.subtle</C>,
									'Primary actions, text on them, links and selection tints.',
								],
								[<C key='e'>red.* · green.* · orange.*</C>, 'Status only — these stay fixed.'],
							]}
						/>
						<Note>
							A colour written as <C>#hex</C>, <C>white</C> or <C>black</C>, or a raw <C>gray.300</C>, will not
							change with the theme. If you add a new paired token family to <C>colors.theme.ts</C>, add it to{' '}
							<C>PAIRS</C> in <C>applyTheme.ts</C> too. Icons take a token as their <C>color</C> (it’s resolved to
							its CSS variable) or inherit the text colour when given none.
						</Note>
					</Section>

					<Section
						id='faq'
						title='Troubleshooting'>
						<Terms
							head={['Symptom', 'Why, and what to do']}
							rows={[
								[
									'“Theme not saved”',
									'The server didn’t accept the change — usually a dropped connection or an expired sign-in. Your previous theme is put back; sign in again and retry.',
								],
								[
									'A new device shows the default colours for a moment',
									'It hasn’t seen your theme yet. It switches as soon as your account loads, and opens in your theme from then on.',
								],
								[
									'Dark mode doesn’t stick',
									'Mode is per browser. Set it once in each browser you use, or choose System.',
								],
								[
									'One part of a page ignores the theme',
									'It uses a fixed colour. Some are intentional (see What keeps its colour); anything else is a bug worth reporting.',
								],
							]}
						/>
					</Section>
				</Box>
			</Grid>
		</Flex>
	);
};

const ThemesDocsPage = () => (
	<Layout
		title='Themes guide'
		path='themes-guide'>
		<ThemesDocs />
	</Layout>
);

export default ThemesDocsPage;
