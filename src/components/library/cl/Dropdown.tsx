'use client';

import { Children, isValidElement, ReactElement, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { createListCollection, Portal, Select } from '@chakra-ui/react';
import { ChevronDown } from 'lucide-react';

/**
 * The one dropdown — Chakra's `Select`, not the browser's native one, so the
 * list looks the same on every OS and matches the rest of the admin.
 *
 * It takes the `<option>` / `<optgroup>` children a native select would
 * (read into the collection `Select` needs), or `items`, and reports the new
 * value as a plain string — a native select converts in a line:
 *
 *   <NativeSelect.Field value={v} onChange={e => set(e.target.value)}>…
 *   <Dropdown value={v} onChange={set}>…
 *
 * An option with `value=''` is a real choice ("From the data type", "Any"),
 * shown as the current value when selected; with no such option, an empty
 * value shows `placeholder`.
 *
 * The list is portalled so a Panel's `overflow: hidden` can't clip it — to
 * the body, or, inside a Dialog, to the dialog itself: portalled outside it,
 * the dialog's focus trap would keep the keyboard out of the list.
 */

export type DropdownItem = { value: string; label: ReactNode; disabled?: boolean; group?: string };

export type DropdownProps = Omit<Select.RootProps, 'collection' | 'value' | 'onValueChange' | 'onChange' | 'children'> & {
	value: string | number | null | undefined;
	onChange: (value: string) => void;
	children?: ReactNode;
	items?: DropdownItem[];
	placeholder?: string;
	portalled?: boolean;
	/** Just the chevron — for a preset picker beside an input that already shows the value. */
	hideValue?: boolean;
};

/** `{n} lines` is ['5', ' lines'] — join plain text so the closed trigger can show it. */
const textOf = (label: ReactNode): ReactNode =>
	Array.isArray(label) && label.every(x => typeof x === 'string' || typeof x === 'number') ? label.join('') : label;

const itemsFrom = (children: ReactNode, group?: string): DropdownItem[] => {
	const out: DropdownItem[] = [];
	Children.forEach(children, child => {
		if (!isValidElement(child)) return;
		const el = child as ReactElement<any>;
		if (el.type === 'optgroup') return out.push(...itemsFrom(el.props.children, el.props.label));
		if (el.type !== 'option') return out.push(...itemsFrom(el.props.children, group)); // fragments
		out.push({
			value: String(el.props.value ?? (typeof el.props.children === 'string' ? el.props.children : '')),
			label: textOf(el.props.children),
			disabled: !!el.props.disabled,
			group,
		});
	});
	return out;
};

const signature = (items: DropdownItem[]) =>
	items.map(i => `${i.group || ''}\u0001${i.value}\u0001${typeof i.label === 'string' ? i.label : ''}\u0001${i.disabled ? 1 : 0}`).join('\u0002');

const Dropdown = ({
	value,
	onChange,
	children,
	items: given,
	placeholder = 'Select…',
	portalled = true,
	hideValue,
	size = 'sm',
	...props
}: DropdownProps) => {
	const rootRef = useRef<HTMLDivElement>(null);
	const dialogRef = useRef<HTMLElement | null>(null);
	const [inDialog, setInDialog] = useState(false);
	useEffect(() => {
		dialogRef.current = rootRef.current?.closest<HTMLElement>('[role="dialog"], [role="alertdialog"]') || null;
		setInDialog(!!dialogRef.current);
	}, []);

	const read = given || itemsFrom(children);
	// Children are new objects every render; keying on their content keeps the
	// collection stable, which Select's state machine needs (a new collection
	// each render is an external change it keeps reacting to).
	const key = signature(read);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const items = useMemo(() => read, [key]);
	const collection = useMemo(() => createListCollection({ items }), [items]);

	const current = value === null || value === undefined ? '' : String(value);
	const selected = useMemo(() => (items.some(i => i.value === current) ? [current] : []), [items, current]);

	const groups = useMemo(() => {
		const map = new Map<string, DropdownItem[]>();
		items.forEach(i => map.set(i.group || '', [...(map.get(i.group || '') || []), i]));
		return [...map.entries()];
	}, [items]);

	const content = (
		<Select.Positioner>
			<Select.Content
				maxH='300px'
				overflowY='auto'>
				{groups.map(([group, list]) => {
					const rows = list.map(item => (
						<Select.Item
							key={item.value}
							item={item}>
							<Select.ItemText>{item.label}</Select.ItemText>
							<Select.ItemIndicator />
						</Select.Item>
					));
					return group ? (
						<Select.ItemGroup key={group}>
							<Select.ItemGroupLabel>{group}</Select.ItemGroupLabel>
							{rows}
						</Select.ItemGroup>
					) : (
						rows
					);
				})}
			</Select.Content>
		</Select.Positioner>
	);

	return (
		<Select.Root
			// The option list is built only while open: a settings row holds
			// several dropdowns, and every closed list kept in the DOM was
			// re-rendered on each change to the page.
			lazyMount
			unmountOnExit
			ref={rootRef}
			collection={collection}
			size={size}
			value={selected}
			onValueChange={d => d.value[0] !== undefined && onChange(d.value[0])}
			positioning={{ sameWidth: false, fitViewport: true }}
			{...props}>
			{/* The native twin only matters for a form post, and it writes every
			    option into the page — 2,000+ nodes on a settings page. */}
			{props.name && <Select.HiddenSelect />}
			<Select.Control>
				<Select.Trigger>
					{!hideValue && <Select.ValueText placeholder={placeholder} />}
				</Select.Trigger>
				<Select.IndicatorGroup>
					<Select.Indicator>
						<ChevronDown size={14} />
					</Select.Indicator>
				</Select.IndicatorGroup>
			</Select.Control>
			{portalled ? <Portal container={inDialog ? (dialogRef as any) : undefined}>{content}</Portal> : content}
		</Select.Root>
	);
};

export default Dropdown;
