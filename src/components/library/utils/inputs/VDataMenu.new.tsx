'use client';
import { FC, useMemo, useRef, useState } from 'react';
import { Box, Button, Combobox, createListCollection, Flex, Portal } from '@chakra-ui/react';
import { MdClose } from 'react-icons/md';
import { CreateModal, CreateServerModal, FormControl, Icon, useGetAllQuery } from '../..';
import { VDataMenuProps } from './VDataMenu/types';

const EMPTY: any[] = [];

// Same field/list surface as VSelect (label, helper, value/name/onChange with
// a native `e.target.value` shape) but backed by a server-fetched, searchable
// list instead of static `<option>` children — Chakra's Combobox, not Select,
// since the trigger itself needs to double as the search input.
const VDataMenu: FC<VDataMenuProps> = ({
	label,
	item,
	isRequired,
	placeholder,
	value,
	helper,
	model,
	dataModel,
	field,
	type = 'value',
	dataKey = '_id',
	menuKey = 'name',
	menuAddOnKey,
	unselect = true,
	name,
	size = 'sm',
	disabled,
	onChange,
	...props
}: any) => {
	const [search, setSearch] = useState('');
	const [open, setOpen] = useState(false);

	const { data } = useGetAllQuery({ path: model, limit: '999', sort: 'name', search });
	const docs: any[] = data?.doc || EMPTY;

	// RTK Query keeps `data` referentially stable across renders when the
	// cache entry hasn't changed, so keying off `docs` directly (rather than a
	// stringified signature) is safe here — unlike VSelect's `children`, which
	// are fresh JSX elements every render.
	const collection = useMemo(
		() =>
			createListCollection({
				items: docs,
				itemToValue: (doc: any) => String(doc?.[dataKey]),
				itemToString: (doc: any) => String(doc?.[menuKey] ?? ''),
			}),
		[docs, dataKey, menuKey]
	);

	const selectedItem = docs.find((doc: any) => String(doc?.[dataKey]) === String(value));
	const selected = useMemo(() => (value ? [String(value)] : []), [value]);

	const emitSelection = (doc: any) => {
		onChange?.({ target: { name, value: type === 'object' ? doc : doc?.[dataKey] } });
		setSearch('');
	};

	const handleUnselect = () => emitSelection({ name: '', _id: undefined });

	const closeAnd = (fn: () => void) => () => {
		fn();
		setOpen(false);
	};

	const btnRef = useRef<any>(null);
	const addItemRef = useRef<any>(null);

	const rowCss = {
		borderRadius: 'l1',
		fontSize: '13px',
		fontWeight: '500',
		px: '2',
		py: '1.5',
		cursor: 'pointer',
		_hover: { bg: 'bg.emphasized/60' },
	};

	return (
		<Flex
			w='full'
			direction='column'>
			{dataModel && (
				<CreateModal
					data={dataModel}
					path={model}
					trigger={
						<Button
							display='none'
							ref={btnRef}>
							Add new {model}
						</Button>
					}
					type='post'
				/>
			)}
			{item?.addItem && (
				<CreateServerModal
					onNewItemAdd={(newItem: any) => emitSelection(newItem)}
					path={model}
					trigger={
						<Button
							display='none'
							ref={addItemRef}>
							Add New Item
						</Button>
					}
				/>
			)}
			<FormControl
				isRequired={isRequired}
				label={label}
				helper={helper}>
				<Combobox.Root
					collection={collection}
					size={size}
					disabled={disabled}
					value={selected}
					open={open}
					openOnClick
					positioning={{ sameWidth: true }}
					onOpenChange={details => setOpen(details.open)}
					onInputValueChange={details => setSearch(details.inputValue)}
					onValueChange={details => {
						if (!details.value.length) {
							handleUnselect();
							return;
						}
						const doc = docs.find((d: any) => String(d?.[dataKey]) === details.value[0]);
						if (doc) emitSelection(doc);
					}}
					{...props}>
					<Combobox.Control>
						<Combobox.Input placeholder={placeholder || `Select ${label}`} />
						<Combobox.IndicatorGroup>
							{unselect && selectedItem && (
								<Combobox.ClearTrigger>
									<MdClose size={16} />
								</Combobox.ClearTrigger>
							)}
							<Combobox.Trigger>
								<Icon name='select' />
							</Combobox.Trigger>
						</Combobox.IndicatorGroup>
					</Combobox.Control>
					<Portal>
						<Combobox.Positioner>
							<Combobox.Content>
								{dataModel && (
									<Box
										{...rowCss}
										onClick={closeAnd(() => btnRef.current?.click())}>
										Add new {model}
									</Box>
								)}
								{item?.addItem && (
									<Box
										{...rowCss}
										fontWeight='700'
										onClick={closeAnd(() => addItemRef.current?.click())}>
										(+) Add New Item
									</Box>
								)}
								<Combobox.Empty>No results</Combobox.Empty>
								{docs.map((doc: any) => (
									<Combobox.Item
										item={doc}
										key={doc?.[dataKey]}>
										<Combobox.ItemText>
											{doc?.[menuKey]} {menuAddOnKey && `(${doc?.[menuAddOnKey]})`}
										</Combobox.ItemText>
										<Combobox.ItemIndicator />
									</Combobox.Item>
								))}
							</Combobox.Content>
						</Combobox.Positioner>
					</Portal>
				</Combobox.Root>
			</FormControl>
		</Flex>
	);
};

export default VDataMenu;
