'use client';

import { FC, useState } from 'react';
import NextLink from 'next/link';
import { Box, Flex, Grid, Link, Text } from '@chakra-ui/react';
import { FormInput, getFieldValue, getOnChangeHandler, inputDataOptions } from '@/components/library';
import { getFieldTypeDescriptor } from '@/components/library/fields/registry';
import { INPUTS } from '@/app/builder/_components/inputTypes';
import DocsShell from '../../_components/DocsShell';
import GuideHeader from '../../_components/GuideHeader';
import GuideNav from '../../_components/GuideNav';
import { C, Code, P, Section } from '../_components/ui';
import { LibraryTabs, Variant } from '../_components/LibraryTabs';
import SafeDemo from '../_components/SafeDemo';

/**
 * Every form input the route builder offers — the same list as its input
 * dropdown (INPUTS) — each live in its variations, with what it stores and
 * how the field then shows in a table and on a detail page. Then the inputs
 * only built-in screens use (the rest of inputDataOptions).
 */

type Sample = {
	description: string;
	/** A value for the Filled variation; none, and there isn't one. */
	value?: any;
	/** Plain inputs whose `disabled` state is worth showing. */
	disabled?: boolean;
	options?: { label: string; value: string }[];
	dataModel?: any[];
	model?: string;
};

const STATUS = [
	{ label: 'Pending', value: 'pending' },
	{ label: 'Processing', value: 'processing' },
	{ label: 'Shipped', value: 'shipped' },
];
const CHANNELS = [
	{ label: 'Email', value: 'email' },
	{ label: 'SMS', value: 'sms' },
	{ label: 'Push', value: 'push' },
];
const RICH = '<p>Our <strong>summer sale</strong> starts on Monday.</p>';

const SAMPLES: Record<string, Sample> = {
	text: { description: 'One line of text.', value: 'Acme Trading Ltd', disabled: true },
	textarea: { description: 'Several lines of plain text.', value: 'Leave at the front desk.\nCall on arrival.', disabled: true },
	editor: { description: 'Formatted text with headings, lists, links and images. Saves HTML.', value: RICH },
	'basic-editor': { description: 'Formatted text with the essentials only — bold, italic, lists, links.', value: RICH },
	slug: { description: 'A URL-safe name, lowercased with dashes as you type.', value: 'summer-sale', disabled: true },
	password: { description: 'Hidden as it’s typed, with a button to show it.', value: 'correct-horse', disabled: true },
	'read-only': { description: 'Shown in the form, never editable — a code or number the system sets.', value: 'INV-2026-0042' },
	'view-only': { description: 'Shown as text in the form, not as an input at all.', value: 'Imported from Shopify' },
	number: { description: 'A number, with the keyboard’s number pad on phones.', value: 1250, disabled: true },
	formula: {
		description:
			'Calculated from other number fields (set in Settings → Formula) and shown live as they change. Never typed; it reads 0 here because this example has no fields to add up.',
	},
	slider: { description: 'A number picked on a track, for values in a known range.', value: 40 },
	checkbox: { description: 'Yes or no, as a tick box.', value: true },
	switch: { description: 'Yes or no, as an on/off switch — for settings that take effect.', value: true },
	date: { description: 'A calendar date.', value: '2026-10-01', disabled: true },
	time: { description: 'A time of day.', value: '14:30', disabled: true },
	color: { description: 'A colour, picked or typed as hex.', value: '#3b82f6' },
	select: { description: 'One value from a fixed list of options.', value: 'processing', options: STATUS, disabled: true },
	'select-tag': { description: 'Any number of values from a fixed list of options.', value: ['email', 'sms'], options: CHANNELS },
	tag: { description: 'Free-form tags; typed ones are lowercased.', value: ['summer', 'sale'] },
	'case-tag': { description: 'Free-form tags that keep their capitals.', value: ['NYC', 'Remote'] },
	image: { description: 'One image, uploaded or picked from the media library.', value: '/logo.png' },
	'image-array': { description: 'Several images, in order.', value: ['/logo.png', '/tc-logo.svg'] },
	file: { description: 'One file of any kind, uploaded or picked from the media library.', value: '/tc-logo.svg' },
	'file-array': { description: 'Several files.', value: ['/tc-logo.svg', '/logo.svg'] },
	video: { description: 'A video, uploaded or linked.' },
	icon: { description: 'A Lucide icon, by name (the link opens lucide.dev to find one).', value: 'star' },
	'data-menu': { description: 'One record of another route, searched by name.', model: 'admins' },
	'data-select': { description: 'One record of another route, from a dropdown.', model: 'admins' },
	'data-tag': { description: 'Several records of another route.', model: 'admins' },
	'nested-data-menu': { description: 'One record, stored inside an object field (name like address.city).', model: 'admins' },
	seo: { description: 'Search-engine title, description and keywords, as one object.' },
	'custom-attribute': { description: 'Name/value pairs the editor adds as they go (size: XL, colour: red).' },
	'section-data-array': {
		description: 'Rows of fields you define (Section list) — order lines, schedules. Number columns can be totalled.',
		value: [
			{ item: 'Coffee beans', qty: 2 },
			{ item: 'Filters', qty: 1 },
		],
		dataModel: [
			{ name: 'item', label: 'Item', type: 'text' },
			{ name: 'qty', label: 'Qty', type: 'number' },
		],
	},
	'section-object': {
		description: 'A group of fields stored as one object (Section) — an address, a contact.',
		value: { street: '12 Lake Road', city: 'Dhaka' },
		dataModel: [
			{ name: 'street', label: 'Street', type: 'text' },
			{ name: 'city', label: 'City', type: 'text' },
		],
	},
	'array-string': { description: 'A list of short texts, one per line.', value: ['Free delivery', 'Gift wrap'] },
};

/** Inputs the builder doesn't offer — built-in screens use them. */
const OTHER_NOTES: Record<string, string> = {
	string: 'Plain text; an older name for Text.',
	'nested-string': 'Text stored inside an object field (name like seo.title).',
	'nested-textarea': 'Long text stored inside an object field.',
	'nested-image': 'An image stored inside an object field.',
	'nested-select': 'A select stored inside an object field.',
	'custom-section': 'The older section input, before Section.',
	'custom-section-array': 'The older rows input, before Section list.',
	'category-collection-array': 'Categories and collections for a product.',
	permissions: 'The role editor’s permission grid.',
	'section-tag': 'Tags inside a section row.',
	'model-fields': 'Picks fields of a model — used by the builders.',
	'form-fields': 'Picks form fields — used by the builders.',
	settings: 'Edits a settings object — used by the builders.',
	variant: 'Product variants.',
	font: 'A font, for theme and page editors.',
	'font-weight': 'A font weight, for theme and page editors.',
	'font-size': 'A font size, for theme and page editors.',
	'line-height': 'A line height, for theme and page editors.',
	letterspacing: 'Letter spacing, for theme and page editors.',
	alignment: 'An alignment, for theme and page editors.',
	'flex-justify': 'Flex justification, for theme and page editors.',
	'flex-align': 'Flex alignment, for theme and page editors.',
	'text-align': 'Text alignment, for theme and page editors.',
	opacity: 'An opacity, for theme and page editors.',
};

const GROUPS = [...new Set(INPUTS.map(i => i.group))];
const OTHERS = inputDataOptions.filter((t: string) => !INPUTS.some(i => i.value === t));
const idOf = (type: string) => `input-${type}`;
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const NAV = [
	{ group: 'Start', items: [{ id: 'using', title: 'Using an input' }] },
	...GROUPS.map(g => ({ group: g, items: INPUTS.filter(i => i.group === g).map(i => ({ id: idOf(i.value), title: i.label })) })),
	{ group: 'Built-in screens only', items: [{ id: 'other-inputs', title: 'Other inputs' }] },
];

/** One live input with its own form state. */
const InputDemo: FC<{
	type: string;
	label: string;
	initial?: any;
	isRequired?: boolean;
	helper?: string;
	disabled?: boolean;
	sample?: Sample;
}> = ({ type, label, initial, isRequired = false, helper, disabled, sample }) => {
	const [formData, setFormData] = useState<any>(initial === undefined ? {} : { field: initial });
	const [, setChangedData] = useState({});
	return (
		<SafeDemo name={label}>
			<FormInput
				formData={formData}
				setFormData={setFormData}
				setChangedData={setChangedData}
				isRequired={isRequired}
				name='field'
				label={label}
				type={type}
				value={getFieldValue({ name: 'field', formData })}
				onChange={getOnChangeHandler({ type, key: 'field', formData, setFormData, setChangedData })}
				model={sample?.model}
				placeholder={`Enter ${label.toLowerCase()}`}
				options={sample?.options || []}
				dataModel={sample?.dataModel || []}
				item={{ helper, options: sample?.options, dataModel: sample?.dataModel }}
				{...(disabled && { disabled: true })}
			/>
		</SafeDemo>
	);
};

/** What a field of this input stores, and how its table cell and detail page show it. */
const Facts: FC<{ type: string; data?: string }> = ({ type, data }) => {
	const d = getFieldTypeDescriptor(type);
	const cell = d?.table?.type || 'text';
	const view = d?.view?.type || 'text';
	return (
		<Flex
			gap={4}
			wrap='wrap'
			fontSize='12px'
			color='fg.muted'>
			<Text>
				Type <C>{type}</C>
			</Text>
			{data && (
				<Text>
					Stores <C>{data}</C>
				</Text>
			)}
			<Text>
				Table cell{' '}
				<Link asChild>
					<NextLink href={`/docs/components/tables#cell-${cell}`}>
						<C>{cell}</C>
					</NextLink>
				</Link>
			</Text>
			<Text>
				Detail page{' '}
				<Link asChild>
					<NextLink href={`/docs/components/view#view-${view}`}>
						<C>{view}</C>
					</NextLink>
				</Link>
			</Text>
		</Flex>
	);
};

const InputBlock: FC<{ type: string; label: string; data?: string }> = ({ type, label, data }) => {
	const sample = SAMPLES[type];
	const hasValue = sample?.value !== undefined;
	return (
		<Box
			id={idOf(type)}
			scrollMarginTop='80px'
			py={6}
			borderTopWidth='1px'
			borderColor='border.muted'
			_first={{ borderTopWidth: 0, pt: 2 }}>
			<Text
				as='h3'
				fontSize='md'
				fontWeight='600'
				mb={1}>
				{label}
			</Text>
			{sample?.description && (
				<Text
					fontSize='sm'
					color='fg.muted'
					mb={2}>
					{sample.description}
				</Text>
			)}
			<Facts
				type={type}
				data={data}
			/>
			<Grid
				mt={4}
				templateColumns={{ base: '1fr', md: 'repeat(2, minmax(0, 1fr))' }}
				gap={5}
				p={5}
				borderWidth='1px'
				borderColor='border'
				borderRadius='md'>
				<Variant label='Empty'>
					<InputDemo
						type={type}
						label={label}
						sample={sample}
					/>
				</Variant>
				<Variant label='Required, with helper'>
					<InputDemo
						type={type}
						label={label}
						sample={sample}
						isRequired
						helper='Helper text explains what goes here.'
					/>
				</Variant>
				{hasValue && (
					<Variant label='Filled'>
						<InputDemo
							type={type}
							label={label}
							sample={sample}
							initial={sample.value}
						/>
					</Variant>
				)}
				{hasValue && sample.disabled && (
					<Variant label='Disabled'>
						<InputDemo
							type={type}
							label={label}
							sample={sample}
							initial={sample.value}
							disabled
						/>
					</Variant>
				)}
			</Grid>
		</Box>
	);
};

const InputsDocs = () => (
	<Flex
		direction='column'
		gap={6}
		pb={16}>
		<GuideHeader
			href='/docs/components'
			title='Form inputs'
			description='Every input the form builder offers, live in its variations — what each stores, and how the field then shows in a table and on a detail page.'
			open={{ href: '/builder', label: 'Open the route builder' }}
			mb={0}
		/>
		<LibraryTabs current='/docs/components/inputs' />

		<Grid
			templateColumns={{ base: '1fr', lg: '200px minmax(0, 1fr)' }}
			gap={10}
			alignItems='start'>
			<GuideNav groups={NAV} />

			<Box
				maxW='800px'
				minW={0}>
				<Section
					id='using'
					title='Using an input'
					lead='Pick it for a field in the route builder, or render it yourself with FormInput.'>
					<P>
						In the route builder, a field&apos;s input is set under <strong>Settings → Input</strong>; the form
						shows it wherever the field is placed. The list there is grouped exactly as below. In code, every input
						goes through <C>FormInput</C>, which looks the type up in the field registry and renders its component.
					</P>
					<Code label='tsx'>{`import { FormInput, getFieldValue, getOnChangeHandler } from '@/components/library';

<FormInput
	type='select'
	name='status'
	label='Status'
	isRequired
	options={[{ label: 'Pending', value: 'pending' }]}
	item={{ helper: 'Where the order is now' }}
	formData={formData}
	setFormData={setFormData}
	setChangedData={setChangedData}
	value={getFieldValue({ name: 'status', formData })}
	onChange={getOnChangeHandler({ type: 'select', key: 'status', formData, setFormData, setChangedData })}
/>`}</Code>
					<P>
						Each example below has its own form state — type into them. <strong>Filled</strong> starts with a
						sample value; <strong>Disabled</strong> appears for the plain inputs where it applies.
					</P>
				</Section>

				{GROUPS.map(group => (
					<Section
						key={group}
						id={`group-${slug(group)}`}
						title={group}>
						{INPUTS.filter(i => i.group === group).map(i => (
							<InputBlock
								key={i.value}
								type={i.value}
								label={i.label}
								data={i.data}
							/>
						))}
					</Section>
				))}

				<Section
					id='other-inputs'
					title='Other inputs'
					lead='Registered inputs the route builder doesn’t offer. Built-in screens — theme and page editors, the role and builder screens — use them; a few are older names kept working for existing settings.'>
					<Grid
						templateColumns={{ base: '1fr', md: 'repeat(2, minmax(0, 1fr))' }}
						gap={5}>
						{OTHERS.map((type: string) => (
							<Box
								key={type}
								id={idOf(type)}
								scrollMarginTop='80px'
								p={4}
								borderWidth='1px'
								borderColor='border'
								borderRadius='md'
								minW={0}>
								<Text
									fontSize='13px'
									fontWeight='600'
									mb={1}>
									<C>{type}</C>
								</Text>
								<Text
									fontSize='12px'
									color='fg.muted'
									mb={3}>
									{OTHER_NOTES[type] || 'Used by built-in screens.'}
								</Text>
								<InputDemo
									type={type}
									label={type}
								/>
							</Box>
						))}
					</Grid>
				</Section>
			</Box>
		</Grid>
	</Flex>
);

const InputsDocsPage = () => (
	<DocsShell
		current='/docs/components'
		requireLogin>
		<InputsDocs />
	</DocsShell>
);

export default InputsDocsPage;
