'use client';

import UserGuide from '../_components/UserGuide';
import { A, C, List, Note, P, Section, Terms } from '../../docs/_components/prose';

/**
 * Media for projects. Section ids mirror the platform's media guide (folders,
 * upload, select, move, rename, preview, find, trash, shortcuts) — the media
 * manager's links land here through panel.ts docsPath.
 */

const SECTIONS = [
	{ id: 'what', title: 'What it is' },
	{ id: 'folders', title: 'Folders' },
	{ id: 'upload', title: 'Uploading' },
	{ id: 'select', title: 'Selecting' },
	{ id: 'move', title: 'Moving' },
	{ id: 'rename', title: 'Renaming and copies' },
	{ id: 'preview', title: 'Preview and links' },
	{ id: 'find', title: 'Search, filter, sort' },
	{ id: 'trash', title: 'Trash' },
	{ id: 'shortcuts', title: 'Keyboard shortcuts' },
	{ id: 'faq', title: 'Troubleshooting' },
];

const Media = () => (
	<UserGuide
		href='/user-docs/media'
		sections={SECTIONS}
		open={{ href: '/images', label: 'Open Media' }}>
		<Section
			id='what'
			title='What it is'
			lead='Files → Media library in the sidebar: every image, video and file of the project, in folders.'>
			<P>
				The image and file fields of your models pick from here, and anything uploaded in a form lands here too. Files have
				public links, so your website can show them. The bottom of the page shows how much space it uses. Anyone whose role
				can view records — or build — sees it in the sidebar.
			</P>
			<P>
				Whose library it is is the project’s choice (<A href='/user-docs/projects#media-library'>Media library</A>): its own,
				named after the project at the top of the page, or the organization’s shared one, which every project set to shared
				sees. Your organization’s media is never visible to anyone outside it.
			</P>
		</Section>

		<Section
			id='folders'
			title='Folders'>
			<List
				items={[
					<>
						<strong>New → New folder</strong> makes one in the folder you’re in. Folders can go as deep as you like.
					</>,
					'Click a folder to open it; the path at the top takes you back up.',
					<>
						Two folders side by side can’t share a name — a second “Banners” becomes <C>Banners (2)</C>.
					</>,
				]}
			/>
		</Section>

		<Section
			id='upload'
			title='Uploading'
			lead='Files go into the folder you’re looking at.'>
			<List
				items={[
					'Drag files onto the page — or onto a folder to put them straight in it.',
					<>
						Drag a whole folder, or <strong>New → Upload folder</strong>: its sub-folders come along.
					</>,
					<>
						<strong>New → Upload files</strong> picks files the usual way.
					</>,
					'A panel in the corner shows each upload’s progress; retry a failed one there. Keep working while it runs.',
				]}
			/>
			<P>
				Photos (JPG, PNG…) are converted to WebP to keep pages fast, so <C>photo.png</C> is saved as <C>photo.webp</C>. SVGs,
				GIFs, videos and documents stay as they are. Up to 50 MB per file.
			</P>
		</Section>

		<Section
			id='select'
			title='Selecting'>
			<Terms
				head={['How', 'Does']}
				rows={[
					['Click', 'Opens a folder or previews a file. While items are selected, adds or removes one.'],
					['⌘ / Ctrl + click', 'Selects without opening.'],
					['Shift + click', 'Selects everything between the last click and this one.'],
					['Drag on an empty spot', 'Draws a box around what to select.'],
					['⌘ / Ctrl + A', 'Selects everything on screen.'],
					['Esc', 'Clears the selection.'],
				]}
			/>
			<P>With something selected, a bar offers Move, Download, Copy link, Rename and Delete.</P>
		</Section>

		<Section
			id='move'
			title='Moving'
			lead='All with Undo.'>
			<List
				items={[
					'Drag items onto a folder, or onto the path at the top to move them up.',
					<>
						<strong>Move to…</strong> opens a folder tree; pick a folder (or make one) and press <strong>Move here</strong>.
					</>,
				]}
			/>
		</Section>

		<Section
			id='rename'
			title='Renaming and copies'>
			<P>
				<strong>Rename</strong> (or F2) changes only the name shown here — the file’s link stays the same, so your pages keep
				working. <strong>Make a copy</strong> creates a separate file with its own link.
			</P>
		</Section>

		<Section
			id='preview'
			title='Preview and links'>
			<P>
				Click a file to see it full screen with its type, size, dimensions, folder and link; ← → step through files.{' '}
				<strong>Copy link</strong> puts the file’s public address on your clipboard, to use on your site or anywhere else.{' '}
				<strong>Download</strong> saves the original.
			</P>
		</Section>

		<Section
			id='find'
			title='Search, filter, sort'>
			<P>
				<strong>Search all media</strong> finds files and folders by name in every folder. Filter by type (images, videos,
				documents), sort by name, date, size or type, and switch between a grid and a list.
			</P>
		</Section>

		<Section
			id='trash'
			title='Trash'
			lead='Deleting moves things to the trash first.'>
			<List
				items={[
					<>
						<strong>Delete</strong> moves the selection to the trash, with Undo for a few seconds.
					</>,
					<>
						<strong>Trash</strong> at the top opens it; <strong>Restore</strong> puts items back.
					</>,
					<>
						<strong>Delete forever</strong> and <strong>Empty trash</strong> remove the files for good. Items left in the trash
						are deleted after 30 days.
					</>,
				]}
			/>
			<Note tone='warn'>A record or web page still using a file you delete forever will show a broken image.</Note>
		</Section>

		<Section
			id='shortcuts'
			title='Keyboard shortcuts'>
			<Terms
				head={['Key', 'Action']}
				rows={[
					['Enter', 'Open the folder / preview the file'],
					['F2', 'Rename'],
					['Delete or Backspace', 'Move to the trash (in the trash: delete forever)'],
					['⌘ / Ctrl + A', 'Select everything'],
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
					['An upload failed', 'Press retry in the upload panel. Files over 50 MB can’t be uploaded.'],
					['A deleted file still shows on my site', 'It’s in the trash; it keeps working until it’s deleted forever.'],
					['I can’t upload or delete', 'Your role needs Records: Add (upload), Edit or Delete — or Build, which covers all of media.'],
				]}
			/>
		</Section>
	</UserGuide>
);

export default Media;
