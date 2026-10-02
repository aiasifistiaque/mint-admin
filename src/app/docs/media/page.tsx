'use client';

import DocsShell from '../_components/DocsShell';
import { FC, ReactNode, useEffect } from 'react';
import { Box, Flex, Grid, Link, Table, Text } from '@chakra-ui/react';
import GuideNav from '../_components/GuideNav';
import GuideHeader from '../_components/GuideHeader';

/**
 * The media manager (admin /images), explained for the people who keep the
 * site's images and files — not for developers. Every "How this works" link on
 * the page and in its dialogs points at a section here (`/docs/media#<id>`),
 * opened in a new tab.
 *
 * Section ids are link targets in components/library/pages/media; rename one
 * there too.
 */

const SECTIONS = [
	{ id: 'what', title: 'What it is' },
	{ id: 'folders', title: 'Folders' },
	{ id: 'upload', title: 'Uploading' },
	{ id: 'select', title: 'Selecting' },
	{ id: 'move', title: 'Moving' },
	{ id: 'rename', title: 'Renaming and copies' },
	{ id: 'preview', title: 'Preview and links' },
	{ id: 'find', title: 'Search, filter, sort, view' },
	{ id: 'trash', title: 'Trash' },
	{ id: 'shortcuts', title: 'Keyboard shortcuts' },
	{ id: 'faq', title: 'Troubleshooting' },
];

const Section: FC<{ id: string; title: string; lead?: ReactNode; children: ReactNode }> = ({ id, title, lead, children }) => (
	<Box
		as='section'
		id={id}
		scrollMarginTop='80px'
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

const Terms: FC<{ head?: [string, string]; rows: [ReactNode, ReactNode][] }> = ({ head = ['Field', 'What it does'], rows }) => (
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

const MediaDocs = () => {
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
			<GuideHeader
				href='/docs/media'
				title='Media'
				description='How to organise, upload, find and clean up the images and files the site uses.'
				open={{ href: '/images', label: 'Open Media' }}
				mb={2}
			/>

			<Grid
				templateColumns={{ base: '1fr', lg: '200px minmax(0, 1fr)' }}
				gap={10}
				alignItems='start'>
				<GuideNav sections={SECTIONS} />

				<Box
					maxW='760px'
					minW={0}>
					<Section
						id='what'
						title='What it is'
						lead='One place for every image, video and document the site uses — organised in folders, like Google Drive.'>
						<P>
							Open it from <strong>Media → Images</strong> in the sidebar, or go to <C>/images</C>. It opens on{' '}
							<strong>All Media</strong>, the top level. Folders are listed first, then files.
						</P>
						<P>
							The images you pick in product, blog and other forms come from here, so anything you upload here can be
							used there, and changes here (a new name, a new folder) show up there straight away.
						</P>
						<P>
							The bottom of the page shows how much storage is used, split by type, and how much is sitting in the
							trash.
						</P>
					</Section>

					<Section
						id='folders'
						title='Folders'
						lead='Folders can hold files and other folders, as deep as you like.'>
						<List
							items={[
								<>
									<strong>New → New folder</strong> makes a folder in the one you’re looking at.
								</>,
								<>Click a folder to open it. The path at the top shows where you are; click any part of it to go back up.</>,
								<>
									Two folders side by side can’t share a name. If you pick one that’s taken, the new folder is called
									“Name (2)” and a message says so. The same name in <em>different</em> folders is fine.
								</>,
								<>Under each folder’s name is what’s inside it — for example “2 folders, 14 files”.</>,
							]}
						/>
					</Section>

					<Section
						id='upload'
						title='Uploading'
						lead='Files go into the folder you’re looking at.'>
						<List
							items={[
								<>
									<strong>Drag files from your computer</strong> onto the page. Drop them on a folder instead to put them
									straight into that folder.
								</>,
								<>
									<strong>Drag a whole folder</strong> from your computer, or use <strong>New → Upload folder</strong>: its
									sub-folders are created here with the same names, and each file goes into the right one.
								</>,
								<>
									<strong>New → Upload files</strong> picks files the usual way.
								</>,
								<>
									A panel in the bottom-right corner shows each upload with its own progress. A failed upload can be retried
									there; running ones can be canceled. You can keep working — and open other folders — while it runs.
								</>,
							]}
						/>
						<Note>
							Photos (JPG, PNG and the like) are converted to WebP to keep pages fast, so a file named{' '}
							<C>photo.png</C> is saved as <C>photo.webp</C>. SVGs, GIFs, videos and documents are kept as they are. The
							limit is 50 MB per file.
						</Note>
					</Section>

					<Section
						id='select'
						title='Selecting'
						lead='Select items to act on several at once.'>
						<Terms
							head={['How', 'What it does']}
							rows={[
								['Click', 'Opens it: a folder shows what’s inside, a file opens its preview. While items are selected, a click adds or removes one instead.'],
								['⌘ / Ctrl + click', 'Selects an item without opening it, or removes it from the selection.'],
								['Shift + click', 'Selects everything between the last item you clicked and this one.'],
								['The checkbox', 'Appears on hover (always, on a phone). Ticks an item without un-ticking the others.'],
								['Drag on an empty spot', 'Draws a box; everything it touches is selected. Hold ⌘ / Ctrl or Shift to add to what’s already selected. Dragging near the top or bottom of the window scrolls it.'],
								['⌘ / Ctrl + A', 'Selects everything on screen.'],
								['Esc, or click an empty spot', 'Clears the selection.'],
							]}
						/>
						<P>
							While something is selected, a bar replaces the search row with what you can do to it: Move, Download,
							Copy link, Rename and Delete.
						</P>
					</Section>

					<Section
						id='move'
						title='Moving'
						lead='Three ways, all with Undo.'>
						<List
							items={[
								<>
									<strong>Drag</strong> one item — or a whole selection — onto a folder. The folder lights up when a drop
									will land there.
								</>,
								<>
									<strong>Drag onto the path at the top</strong> (“All Media / Banners / …”) to move things up a level or
									more.
								</>,
								<>
									<strong>Move to…</strong> (right-click, the ⋯ button, or the selection bar) opens a folder tree. Pick the
									destination and press <strong>Move here</strong>. You can search for a folder by name, or make a new one
									inside the highlighted folder without leaving the window.
								</>,
							]}
						/>
						<P>
							After a move, a message offers <strong>Undo</strong> for a few seconds; it puts everything back where it was.
						</P>
						<Note>
							A folder can’t be moved into itself or into one of its own sub-folders — those are greyed out. If a
							folder you move has the same name as one already at the destination, it’s renamed “Name (2)”.
						</Note>
					</Section>

					<Section
						id='rename'
						title='Renaming and copies'>
						<List
							items={[
								<>
									<strong>Rename</strong> from the right-click menu, the selection bar, or press <strong>F2</strong>. The
									name turns into a text box with just the name (not the extension) selected. <strong>Enter</strong> saves,{' '}
									<strong>Esc</strong> cancels, clicking elsewhere saves.
								</>,
								<>
									Renaming changes the name shown here only — the file’s link stays the same, so pages already using it
									keep working.
								</>,
								<>
									<strong>Make a copy</strong> creates a separate file (“Copy of …”) with its own link. Deleting either one
									leaves the other intact.
								</>,
							]}
						/>
					</Section>

					<Section
						id='preview'
						title='Preview and links'>
						<P>
							Click a file (or right-click → Preview) to see it full screen, with its details beside it: type,
							size, dimensions, the folder it’s in, when it was uploaded, and its link. Use the arrows or the ← → keys
							to step through the files in the current view. Videos play; other files can be downloaded. In the grid,
							videos show their first frame with a play badge, and documents show an icon for their kind (PDF, Word,
							spreadsheet, slides, archive, audio, code) over their extension.
						</P>
						<List
							items={[
								<>
									<strong>Open in new tab</strong> (right-click or ⋮) opens a file on its own in a new browser tab, or a
									folder’s page.
								</>,
								<>
									<strong>Copy link</strong> puts the file’s public address on your clipboard — for pasting into an email,
									a page, or anywhere outside the admin.
								</>,
								<>
									<strong>Download</strong> saves the original file. Select several files to download them one after
									another.
								</>,
							]}
						/>
					</Section>

					<Section
						id='find'
						title='Search, filter, sort, view'>
						<Terms
							head={['Control', 'What it does']}
							rows={[
								[
									'Search all media',
									'Finds files and folders by name in every folder, not only the one you’re in. Each result says which folder it’s in.',
								],
								['All types', 'Shows only images, videos or documents. Folders are hidden while a type is chosen.'],
								[
									'Sort (“Name” and the arrow beside it)',
									'Click the field name for the sort menu: Sort by (Name, Date added, Size, Type) and Sort direction. The arrow flips the direction in one click. Folders always stay above files.',
								],
								['Grid / list (the last button)', 'Tiles with thumbnails, or a table with date, size and type columns you can click to sort.'],
							]}
						/>
						<P>Your sort and view are remembered in this browser.</P>
						<P>A big folder shows the first 60 files; <strong>Load more</strong> at the bottom brings the next batch.</P>
					</Section>

					<Section
						id='trash'
						title='Trash'
						lead='Deleting moves things to the trash first. Nothing is gone until the trash lets it go.'>
						<List
							items={[
								<>
									<strong>Delete</strong> (or the Delete key) moves the selection to the trash, with <strong>Undo</strong>{' '}
									for a few seconds. A folder goes with everything inside it.
								</>,
								<>
									Open the trash with the <strong>Trash</strong> button at the top (the number is how many items are in it).
									<strong> Restore</strong> puts items back in their folder — or in All Media if that folder is gone.
								</>,
								<>
									<strong>Delete forever</strong> and <strong>Empty trash</strong> remove the files from storage too.
									That can’t be undone.
								</>,
								<>
									Items left in the trash are deleted forever automatically after <strong>30 days</strong>.
								</>,
							]}
						/>
						<Note tone='warn'>
							A page, product or blog post that still uses a file you delete forever will show a broken image. Check
							before emptying the trash.
						</Note>
					</Section>

					<Section
						id='shortcuts'
						title='Keyboard shortcuts'>
						<Terms
							head={['Key', 'Action']}
							rows={[
								['Enter', 'Open the selected folder / preview the selected file'],
								['F2', 'Rename the selected item'],
								['Delete or Backspace', 'Move the selection to the trash (in the trash: delete forever)'],
								['⌘ / Ctrl + A', 'Select everything on screen'],
								['Esc', 'Clear the selection, or cancel a rename'],
								['← →', 'Previous / next file in the preview'],
							]}
						/>
					</Section>

					<Section
						id='faq'
						title='Troubleshooting'>
						<Terms
							head={['Symptom', 'Why, and what to do']}
							rows={[
								['“A folder named … already exists here”', 'Rename it to something else, or rename the other folder first.'],
								['An upload failed', 'Press the retry arrow in the upload panel. Files over 50 MB can’t be uploaded.'],
								['I can’t drop a folder into another', 'It’s the folder itself or one of its own sub-folders.'],
								['A deleted file is still showing on the site', 'Deleting only moves it to the trash; pages keep working until it’s deleted forever.'],
								['Buttons are missing', 'Your role needs the image permissions (view, create, edit, delete) on the Roles page.'],
							]}
						/>
					</Section>
				</Box>
			</Grid>
		</Flex>
	);
};

const MediaDocsPage = () => (
	<DocsShell
		current='/docs/media'
		requireLogin>
		<MediaDocs />
	</DocsShell>
);

export default MediaDocsPage;
