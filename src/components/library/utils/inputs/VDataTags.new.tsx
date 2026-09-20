'use client';
import { FC, useMemo, useState } from 'react';
import { Combobox, createListCollection, Portal, Tag, Wrap } from '@chakra-ui/react';
import { MdClose } from 'react-icons/md';
import { FormControl, Icon, useGetSelectDataQuery } from '../..';

const EMPTY: any[] = [];

type InputContainerProps = any & {
	label: string;
	isRequired?: boolean;
	helper?: string;
	value: string[];
	model: string;
	placeholder?: any;
	item?: any;
	name?: string;
	size?: 'sm' | 'md' | 'lg' | 'xs';
	onChange?: (e: { target: { name?: string; value: string[] } }) => void;
};

// Multi-select sibling of VDataMenu — same Combobox shell, `multiple` turned
// on, and the selected values rendered as removable Tags underneath instead
// of a single value in the trigger. `useGetSelectDataQuery` already fetches
// the full (up to 1000-item) list in one shot, so filtering as the user
// types happens locally against that list rather than re-querying per key.
const VDataTags: FC<InputContainerProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	model,
	item,
	name,
	size = 'sm',
	disabled,
	onChange,
	...props
}: any) => {
	const [search, setSearch] = useState('');
	const { data } = useGetSelectDataQuery(model);
	const docs: any[] = data?.doc || EMPTY;

	// WO-05: valueKey is what createFormFields emits; valKey kept as a deprecated fallback.
	const valueKey = item?.valueKey || item?.valKey || '_id';
	const labelKey = item?.labelKey || 'name';

	const displayLabel = (doc: any) => {
		const addOn = item?.modelAddOn && doc?.[item.modelAddOn];
		return `${doc?.[labelKey] ?? ''}${addOn ? ` (${addOn})` : ''}`;
	};

	const allCollection = useMemo(
		() =>
			createListCollection({
				items: docs,
				itemToValue: (doc: any) => String(doc?.[valueKey]),
				itemToString: displayLabel,
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[docs, valueKey, labelKey, item?.modelAddOn]
	);

	const collection = useMemo(
		() =>
			search
				? allCollection.filter(itemString => itemString.toLowerCase().includes(search.toLowerCase()))
				: allCollection,
		[allCollection, search]
	);

	const selected = useMemo(() => value || EMPTY, [value]);

	const selectedDocs = useMemo(
		() =>
			selected
				.map((id: string) => docs.find((doc: any) => String(doc?.[valueKey]) === String(id)))
				.filter(Boolean),
		[selected, docs, valueKey]
	);

	const emit = (nextValue: string[]) => onChange?.({ target: { name, value: nextValue } });

	const removeTag = (id: string) => emit(selected.filter((v: string) => v !== id));

	return (
		<FormControl
			isRequired={isRequired}
			label={label}
			helper={helper}>
			<Combobox.Root
				collection={collection}
				size={size}
				disabled={disabled}
				multiple
				value={selected}
				openOnClick
				positioning={{ sameWidth: true }}
				onInputValueChange={details => setSearch(details.inputValue)}
				onValueChange={details => {
					emit(details.value);
					setSearch('');
				}}
				{...props}>
				<Combobox.Control>
					<Combobox.Input placeholder={placeholder || `Select ${label}`} />
					<Combobox.IndicatorGroup>
						<Combobox.Trigger>
							<Icon name='select' />
						</Combobox.Trigger>
					</Combobox.IndicatorGroup>
				</Combobox.Control>
				<Portal>
					<Combobox.Positioner>
						<Combobox.Content>
							<Combobox.Empty>No results</Combobox.Empty>
							{collection.items.map((doc: any) => (
								<Combobox.Item
									item={doc}
									key={doc?.[valueKey]}>
									<Combobox.ItemText>{displayLabel(doc)}</Combobox.ItemText>
									<Combobox.ItemIndicator />
								</Combobox.Item>
							))}
						</Combobox.Content>
					</Combobox.Positioner>
				</Portal>
			</Combobox.Root>
			{selectedDocs.length > 0 && (
				<Wrap
					gap={1.5}
					pt={2}>
					{selectedDocs.map((doc: any) => (
						<Tag.Root
							key={doc?.[valueKey]}
							size='sm'
							colorPalette='gray'
							variant='surface'
							borderRadius='l1'
							px={2.5}
							py={1.5}>
							<Tag.Label>{displayLabel(doc)}</Tag.Label>
							{/* The default CloseTrigger icon collapses to 0x0 in this theme
							    (its recipe never sizes the button or an inner _icon selector,
							    unlike startElement/endElement) — sizing the icon explicitly
							    sizes the flex button around it too. */}
							<Tag.CloseTrigger onClick={() => removeTag(String(doc?.[valueKey]))}>
								<MdClose size={12} />
							</Tag.CloseTrigger>
						</Tag.Root>
					))}
				</Wrap>
			)}
		</FormControl>
	);
};

export default VDataTags;
