'use client';
import { FC } from 'react';
import { InputProps, Checkbox, Grid } from '@chakra-ui/react';
import { Column, FormControl } from '../..';

type VDataMenuProps = InputProps & {
	label: string;
	isRequired?: boolean;
	placeholder?: string;
	value: any;
	helper?: string;
	model?: string;
	dataModel?: any;
	options: any;
};

const VPermissions: FC<VDataMenuProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	model,
	dataModel,
	options,
	...props
}) => {
	const addPermission = (item: string, isChecked: boolean) => {
		if (isChecked) {
			if (value && !value.includes(item)) {
				const newArr = [...value, item];
				if (props.onChange) {
					const event = {
						target: {
							name: props.name,
							value: newArr,
						},
					} as any;
					props.onChange(event); // Call onChange with the synthetic event
				}
			}
		} else {
			const newArr = value && value?.length > 0 ? value?.filter((tag: string) => tag !== item) : [];
			if (props.onChange) {
				const event = {
					target: {
						name: props.name,
						value: newArr,
					},
				} as any;
				props.onChange(event); // Call onChange with the synthetic event
			}
		}
	};

	const renderMenuItems = options?.map((item: any, i: number) => (
		<Checkbox
			key={i}
			defaultChecked={value?.includes(item?.value)}
			id={item?.value}
			onChange={(e: any) => addPermission(item?.value, e.target.checked)}
			size='md'
			colorScheme='brand'>
			{item?.label}
		</Checkbox>
	));

	return (
		<Column>
			<FormControl
				isRequired={isRequired}
				helper={helper}
				label={label}>
				<Grid
					rowGap={2}
					gridTemplateColumns='1fr 1fr 1fr 1fr'
					w='100%'
					overflowY='scroll'>
					{renderMenuItems}
				</Grid>
			</FormControl>
		</Column>
	);
};

export default VPermissions;
