'use client';

import DocsShell from '../_components/DocsShell';
import { FC, ReactNode, useEffect } from 'react';
import { Box, Flex, Grid, Link, Table, Text } from '@chakra-ui/react';
import GuideNav from '../_components/GuideNav';
import GuideHeader from '../_components/GuideHeader';

/**
 * PDF templates, explained for the people who design invoices, bills and
 * receipts (backend docs/pdf-templates). Linked from the list, the dialogs
 * and every designer panel (`/docs/pdf-templates#<section>`), in a new tab.
 * The tenant panel links the same anchors in mint-docs /pdf-templates.
 */

const SECTIONS = [
	{ id: 'what', title: 'What it is' },
	{ id: 'start', title: 'Making a template' },
	{ id: 'match', title: 'Matching your fields' },
	{ id: 'business', title: 'Business details' },
	{ id: 'texts', title: 'Saved texts' },
	{ id: 'designer', title: 'The designer' },
	{ id: 'blocks', title: 'Blocks' },
	{ id: 'layout', title: 'Rows and filling space' },
	{ id: 'moving', title: 'Moving, copy and paste' },
	{ id: 'free', title: 'Placed freely' },
	{ id: 'tokens', title: 'Fields in text' },
	{ id: 'filters', title: 'Formats' },
	{ id: 'lists', title: 'Lists from other pages' },
	{ id: 'conditions', title: 'Show only when' },
	{ id: 'page', title: 'Paper and look' },
	{ id: 'download', title: 'Downloading' },
	{ id: 'ai', title: 'Build with your AI' },
	{ id: 'preview', title: 'Preview' },
	{ id: 'gallery', title: 'The gallery' },
	{ id: 'access', title: 'Who can do what' },
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

const Terms: FC<{ head?: [string, string]; rows: [ReactNode, ReactNode][] }> = ({ head = ['Option', 'What it does'], rows }) => (
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


const PdfTemplatesDocs = () => {
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
				href='/docs/pdf-templates'
				title='PDF templates'
				description='Design the invoices, bills and receipts your records download as PDFs.'
				open={{ href: '/pdf-templates', label: 'Open PDF Templates' }}
				mb={2}
			/>

			<Grid
				templateColumns={{ base: '1fr', lg: '200px minmax(0, 1fr)' }}
				gap={10}
				alignItems='start'>
				<GuideNav sections={SECTIONS} />

				<Box minW={0}>
					<Section
						id='what'
						title='What it is'
						lead='A designed document for a page’s records — an invoice for a bill, a receipt for a payment.'>
						<P>
							A PDF template lays out a page: your logo and details, the record’s number and dates, a table of its line items,
							the totals. Each piece of data is a field of the record, written as <C>{'{{bill.total | money}}'}</C>. When someone
							presses <b>Download PDF</b> on a record, the server fills the template with that record and hands back the file.
						</P>
						<P>
							Start from a design in the gallery, build one from nothing, or describe it to AI. A page can have several templates
							(an invoice and a delivery note); one is its default.
						</P>
					</Section>

					<Section
						id='start'
						title='Making a template'
						lead='PDF Templates → New template.'>
						<List
							ordered
							items={[
								'Pick a starting point: a design from the gallery, Blank, or Build with your AI.',
								'Pick the page it prints (Bills, Invoices, Payments…) and give it a name.',
								'For a design from the gallery, match what it shows to your fields (next section).',
								'It opens in the designer. The first template of a page becomes its default.',
							]}
						/>
					</Section>

					<Section
						id='match'
						title='Matching your fields'
						lead='Every design prints things like “Total” or “Customer name”; your page calls them something else.'>
						<P>
							Each row is one thing the design shows, with our guess at your field beside it — guessed from the names and the kind
							of field (a date for “Due date”, a number for “Total”). Change any guess, or leave it blank: a blank one prints
							nothing until you put a field there in the designer.
						</P>
						<P>
							<b>Line items</b> come from rows inside the record (a list of items on the bill itself) or from another page whose
							records point at this one (Invoice items whose Invoice is this one). Pick which, then match the columns.
						</P>
					</Section>

					<Section
						id='business'
						title='Business details'
						lead='Set once, used by every template.'>
						<Terms
							rows={[
								['Name, logo, address, phone, email, website, tax number', <>Printed with <C>{'{{business.name}}'}</C>, <C>{'{{business.logo}}'}</C>…</>],
								['Note', <>Bank details or payment terms — <C>{'{{business.note}}'}</C>.</>],
								['Currency', 'The symbol money shows, the word amounts in words end with (Taka, Dollars), decimals, and 1,234,567 or 12,34,567 grouping.'],
								['Date format', '13 Oct 2026, 13/10/2026… used wherever a date is printed.'],
								['Time zone', 'Leave empty to print dates in each reader’s zone; set one so every copy shows the same day.'],
							]}
						/>
						<P>
							<b>Business details</b> on the PDF Templates page, or <b>Upload logo</b> / <b>Add address</b> on the designer’s page, opens it. <b>Upload logo</b> picks from the media library, uploads a new one or takes a link. In a project they’re the project’s business details (Project settings shows the same); in this panel, its own.
						</P>
					</Section>

					<Section
						id='texts'
						title='Saved texts'
						lead='Terms and conditions, a return policy — written once, printed by any template.'>
						<P>
							Business details → <b>Saved texts</b>. Name a text (Terms &amp; conditions), write it, and every template prints it
							with its field — <C>{'{{texts.terms_conditions}}'}</C>; the copy button next to each gives it. Change the words
							once and every template printing them changes. <b>**bold**</b> and new lines work, and fields too: “Pay within 7 days
							of <C>{'{{bill.issueDate | date}}'}</C>” prints each record’s date. One click adds a ready one — Terms &amp;
							conditions, Computer generated (“no signature is required”), Payment instructions, Return policy, Thank you.
						</P>
						<P>
							Words that belong to one template only — a heading, “This invoice is computer generated” on just this design — are
							plain text blocks instead (see the designer).
						</P>
					</Section>

					<Section
						id='designer'
						title='The designer'
						lead='A full-page tool: what to add on the left, the page in the middle, the selected block on the right.'>
						<List
							items={[
								'It fills the window: the sidebar folds away behind the menu button. One toolbar on top — undo / redo, what the page shows (a record or Sample data), Fields, zoom, Business details, Your AI, Preview, Real PDF and Save.',
								'Left, three tabs: “Blocks” — text, rows, table, columns, box, row, image, line, space, page break; “Ready-made” — pieces (Logo & business, Signature, Push to bottom, Computer note “…no signature is required”, Terms, Bank details, PAID stamp, Thank you) and your saved texts; a click puts it after the selected block. “Layers” — the blocks as a tree; drag to move them, into columns and boxes too. Tiles can also be dragged straight onto the page.',
								'Middle: the page. Click a block to select it; its bar on the page moves it up or down (left or right in a row), duplicates, copies or deletes it, and ↖ selects the block around it (the whole signature, not just its words). Drag blocks on the page to move them. A selected image or logo has a handle on each corner: drag one to make it bigger or smaller — it keeps its shape; hold ⇧ to change the shape too. Empty business details show as “+ Add phone”, “+ Upload logo” — click one to fill it in.',
								'Right: the selected block’s settings — or, with nothing selected, the document: its name, page, paper, look and lists.',
								'Sample data fills every field, like Preview; your business details and saved texts show as they are. Fields switches to which field goes where.',
								'Undo / redo (⌘Z, ⇧⌘Z), Delete removes the selected block, Esc unselects, ⌘S saves. Nothing changes for anyone until you save.',
							]}
						/>
					</Section>

					<Section
						id='blocks'
						title='Blocks'>
						<Terms
							head={['Block', 'Use it for']}
							rows={[
								['Text', 'Headings and paragraphs. **bold** inside; a new line is a new line.'],
								['Label + value rows', 'Invoice no. / Date / Due, and the totals: rows can be bold, big, a filled band, or have a line above. “Hide rows with no value” drops empty ones.'],
								['Table', 'One row per line item, payment… Columns have a heading, a value ({{item.…}}), a width share and alignment. Pick its own font (or the page’s) like any text. Look: heading fill and text colour, lines between rows or a grid, and the lines’ colour. Splits across pages, repeating its heading.'],
								['Columns', 'Blocks side by side; widths are shares (2 and 1 = two thirds and one third).'],
								['Box', 'A shaded or framed group, with padding and round corners. Its blocks sit one under another (a stack) or side by side (a row) — see Rows and filling space.'],
								['Row', 'A box with nothing drawn and its blocks side by side, each as wide as it needs — a logo and a title on one line, a signature on the right.'],
								['Image', 'A logo, a signature, a photo field — an address or a field.'],
								['Line, Space, Page break', 'A rule, blank room (which can fill the free space), and “start a new page here”.'],
							]}
						/>
						<P>
							The <b>header</b> and <b>footer</b> repeat on every page — put “Page {'{{page}}'} of {'{{pages}}'}” in the footer.
							The <b>body</b> flows over as many pages as it needs.
						</P>
					</Section>

					<Section
						id='layout'
						title='Rows and filling space'
						lead='Boxes work like flexbox: a stack or a row, and blocks that take the room left.'>
						<P>
							Select a box and set <b>Layout → Blocks</b> to <b>Row</b> (or add a <b>Row</b> from Add). In a row every block is as wide
							as its content — text its longest line, an image its size — unless you change its <b>Width in the row</b>: <b>Fill the
							free space</b> or a <b>Fixed width</b> in pt. Label + value rows, tables, lines and columns have no width of their own, so
							they share the free width.
						</P>
						<Terms
							head={['Setting', 'What it does']}
							rows={[
								['Gap', 'The room between the blocks (pt).'],
								['Align', 'Top, middle or bottom of the row — or Stretch, so boxes in it are all as tall as the tallest. Each is an icon, like Figma’s; hover one to see what it does.'],
								['Spread', 'Where the blocks go when nothing fills: from the left, centred, to the right, or space between them.'],
								['Min height', 'The box is at least this tall; a block set to fill takes the height the others leave.'],
							]}
						/>
						<P>
							A <b>Space</b> set to <b>Fill the free space</b> takes the room left: in a row it pushes what follows to the right (logo ·
							space · INVOICE); in a box with a min height it pushes what follows down; in the body it takes the room left on the page,
							so what follows — a signature, the terms — sits at the bottom of the page. <b>Push to the bottom</b> in Add is exactly
							that. The header and footer have no spare room, so a Space there keeps its own size. In the designer a filling Space is
							hatched.
						</P>
						<P>
							More for boxes: <b>Top & bottom</b> and <b>Left & right</b> padding (over the all-round padding), <b>Lines on</b> — a
							border on some sides only (a rule above and below, a bar on the left) — and, for a box sitting straight in the header,
							body or footer, <b>Full-width background</b>: its colour runs to the page’s edges (the header’s first block up to the
							top edge, the footer’s last down to the bottom edge) while what’s inside stays within the margins. Set the page’s top
							and bottom margins to 0 for bands that touch the edges — Invoice — Banner and Quotation — Modern in the gallery do.
						</P>
						<P>
							In a <b>Columns</b> block each column has its own Top / Middle / Bottom and <b>One under another</b> or <b>Side by
							side</b> for the blocks in it.
						</P>
					</Section>

					<Section
						id='moving'
						title='Moving, copy and paste'
						lead='Drag blocks on the page; copy one and paste it inside a box.'>
						<List
							items={[
								'Drag a block on the page: a line shows where it lands — above or below another block, left or right of one in a row, or inside a box or a column (an empty one lights up). The Add panel’s tiles drag onto the page too.',
								'Near a box’s edge the drop goes beside the box; further in, it goes inside.',
								'⌘C copies the selected block, ⌘X cuts it, ⌘V pastes: inside the selected box (at its end) or columns block (its first empty column), otherwise after the selected block. The block bar has Copy and, on a box with something copied, Paste inside.',
								'What you copy is on your clipboard, so it pastes into another template too.',
								'Several at once, like Figma: ⇧ or ⌘ click more blocks (on the page or in Layers). Drag any of them and they all move — into a box or a column too. ⌘G puts them in a box, ⇧⌘G in a row side by side; ⌘C / Delete act on all of them.',
								'In Layers, drop a block on a box or columns row and it goes inside.',
							]}
						/>
					</Section>

					<Section
						id='free'
						title='Placed freely'
						lead='Like Canva: put a stamp, a signature or a watermark exactly where you want it.'>
						<List
							items={[
								'Select a block and press Place freely (under its name on the right) — it leaves the flow and stays where it was on the page. Or switch Add to Place freely and drop a tile anywhere on the page.',
								'Drag it anywhere. It snaps to the page’s edges, margins and middle, and to other placed blocks — pink lines show what it snapped to; hold ⌥ not to snap. Drag the small handle on its right to change its width; arrow keys nudge it 1pt, ⇧ 10pt.',
								'On the right: from the left, from the top, width, turn (degrees — a tilted PAID stamp), opacity, which page (first, every or last), and Behind the content for a watermark.',
								'Back into the flow puts it at the end of the body again.',
								'Tables, totals and anything that grows with the record belong in the flow: only the flow moves on to the next page when it runs out of room.',
							]}
						/>
					</Section>

					<Section
						id='tokens'
						title='Fields in text'
						lead='Any text can hold fields: “Bill to {{bill.client.name}}”.'>
						<P>
							Use the <b>Field</b> button beside a text box: it inserts the field where the cursor is, with a format guessed from it. Its menu goes in layers — this record, this row, a list, the business, a saved text, the page and date — and a linked record (Client) opens into its own fields; search looks through all of them. In the box a field shows as a chip in words (“Saved text · Invoice terms”); click a chip to change it. Turn on <b>Keys</b> to see and type the raw keys instead.
							The record is named after its page (<C>bill</C> for Bills; see Page → Record as). Linked records open up:
							<C>{'{{bill.client.address}}'}</C>.
						</P>
						<Terms
							head={['Name', 'What it is']}
							rows={[
								[<C key='a'>{'{{bill.…}}'}</C>, 'The record being printed (also {{record.…}}).'],
								[<C key='b'>{'{{item.…}}'}</C>, 'Inside a table’s columns: the row. {{index}} is its number.'],
								[<C key='c'>{'{{business.…}}'}</C>, 'Your business details.'],
								[<C key='d'>{'{{today}}'}</C>, 'Today’s date. {{page}} and {{pages}} in the header and footer.'],
							]}
						/>
					</Section>

					<Section
						id='filters'
						title='Formats'
						lead='After the field, a | and a format: {{bill.total | money}}.'>
						<Terms
							head={['Format', 'Prints']}
							rows={[
								['money', '৳86,250.00 — with your currency. money:$ for another symbol.'],
								['number, number:2', '1,234 · 1,234.50'],
								['date, datetime', 'In your date format; date:\'DD/MM/YYYY\' for another.'],
								['words', '“Eighty Six Thousand Two Hundred Fifty Taka Only”'],
								['upper, lower, title', 'UPPER, lower, Title Case'],
								['default:\'—\'', 'What to print when the field is empty.'],
								['count, sum:amount, join', 'How many in a list, a list added up, a list joined with commas.'],
								['plus:, minus:, times:, divide:', 'Arithmetic with a number or another field: {{bill.total | minus:bill.paid | money}}.'],
							]}
						/>
					</Section>

					<Section
						id='lists'
						title='Lists from other pages'
						lead='An invoice’s payments, a client’s orders — records of another page that point at this one.'>
						<P>
							In Page → Lists from other pages, add one: pick the page and the field there that points back, give it a short name
							(<C>payments</C>), an order and a limit. Then show it in a table (One row per → payments) or use it in text:
							<C>{'{{payments | count}}'}</C>, <C>{'{{payments | sum:amount | money}}'}</C>. It is only filled for people who can
							read that page.
						</P>
					</Section>

					<Section
						id='conditions'
						title='Show only when'
						lead='Print a block only for some records.'>
						<P>
							Every block has <b>Show only when</b>: a PAID band when the status is paid, a “Due date” row only when there is one.
							In the designer such a block is drawn faded when the record on screen doesn’t meet it.
						</P>
					</Section>

					<Section
						id='page'
						title='Paper and look'>
						<P>
							Page → Paper: A4, Letter, Legal or A5, portrait or landscape, and the margins (in points; 72 points = 1 inch).
							Look: the font (Geist, Geist Mono, Helvetica, Times, Courier), text size and line height, and the colours every block
							starts from — any block can override them. Bangla and other characters a font doesn’t have are printed in Noto Sans
							Bengali automatically.
						</P>
					</Section>

					<Section
						id='download'
						title='Downloading'>
						<List
							items={[
								'A record’s page: Download PDF beside Edit (a menu when the page has several templates).',
								<>A row’s menu: page builder → Table → Row menu → <b>Download PDF</b> (a template, or the page’s default), with Show only when like any item.</>,
								'Several records at once: tick them, Print / PDF — each template is an option, one file with a page set per record.',
							]}
						/>
					</Section>

					<Section
						id='ai'
						title='Build with your AI'>
						<P>
							Your own AI — Claude, ChatGPT, Cursor or any MCP client, on your own subscription — builds templates through the
							builder MCP’s PDF tools (connect it once on Connect your AI). <b>Build with your AI</b> writes the prompt to paste:
							pick the page, say what it should look like, copy. Your AI reads the format and the page’s fields, shows its plan and
							saves the template; every save is checked like the designer’s. <b>Show what it made</b> refreshes the list.
						</P>
						<P>
							In the designer, <b>Change with your AI</b> does the same for the open template (its id is in the prompt). Save your
							own edits first — your AI changes the saved copy — then <b>Load its changes</b>.
						</P>
					</Section>

					<Section
						id='preview'
						title='Preview'>
						<P>
							The eye on a template’s card (yours or the gallery’s), or <b>Preview</b> in the designer, opens the PDF itself in a new
							tab with every field filled with sample data: a customer, three line items whose amounts add up to the total, paid and
							due, dates. Your business details and saved texts print where you have them; the empty ones get a stand-in (a “YOUR
							LOGO” badge), so you see the whole layout. From the designer it shows your unsaved changes. <b>Download</b> keeps
							the file. To see one of your own records instead, pick it above the designer’s page and press <b>Real PDF</b>.
						</P>
					</Section>

					<Section
						id='gallery'
						title='The gallery'
						lead='The designs every project starts from — kept by the super admin.'>
						<P>
							Until the super admin adds any, the gallery shows the built-in starters — invoices (Classic, Modern, Minimal, Banner,
							Bill), receipts (Receipt, Compact, Money receipt) and quotations (Quotation, Quotation — Modern). On the Gallery tab,
							<b>Add the built-in starters</b> makes them your own templates to edit; when a new starter ships later, the same place
							offers <b>Add N new built-in starters</b>. Any of your templates goes in the gallery with Page → <b>In the gallery for
							every project</b>; give it sample data so its card isn’t blank. Projects copy a gallery template — later changes to
							yours don’t reach their copies.
						</P>
						<P>
							<b>Categories</b> — Invoices, Receipts and Quotations to start with — are what the gallery is browsed by. The super
							admin adds, renames, reorders and deletes them with Gallery → <b>Categories</b> (a deleted one’s templates show under
							Other), and sets a template’s category in its designer (Document → Category). Your own AI can do both over the
							builder MCP: <C>save_pdf_category</C> and <C>publish_pdf_template</C>.
						</P>
					</Section>

					<Section
						id='access'
						title='Who can do what'>
						<Terms
							head={['Who', 'Can']}
							rows={[
								['Anyone who can read a page', 'Download its records as PDFs, and see its templates.'],
								['Builders (edit-builder; in a project, build)', 'Make, change and delete templates, set the default, edit the business details.'],
								['The super admin', 'Decide what’s in the gallery and its categories.'],
							]}
						/>
						<P>
							A template can only print what the reader could open anyway: passwords and hidden fields never print, and a list
							from a page they can’t read stays empty.
						</P>
					</Section>

					<Section
						id='faq'
						title='Troubleshooting'>
						<Terms
							head={['Problem', 'Fix']}
							rows={[
								['A field prints blank', 'Show fields: is the token one of this page’s fields? Fix it with the Field button. Or the record has no value.'],
								['The logo doesn’t show', 'Use an https address of a PNG, JPG, WebP or SVG under 5 MB.'],
								['Dates are a day off', 'Set the time zone in Business details.'],
								['“This page has no PDF template yet”', 'Make one for that page, or pick a template in the row menu item.'],
								['Real PDF looks different from the page', 'The page is a close drawing; the PDF is exact. Page breaks only exist in the PDF.'],
							]}
						/>
					</Section>
				</Box>
			</Grid>
		</Flex>
	);
};

const PdfTemplatesDocsPage = () => (
	<DocsShell
		current='/docs/pdf-templates'
		requireLogin>
		<PdfTemplatesDocs />
	</DocsShell>
);

export default PdfTemplatesDocsPage;
