'use client';

import { FormInput, getFieldValue, getOnChangeHandler } from '@/components/library';
import { Center, Flex, FlexProps, Text, TextProps } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';

const generateLabel = (slug: string) => {
	const words = slug?.split('-');
	return words?.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const IconPage = () => {
	const { id } = useParams<any>();

	return (
		<Flex {...bodyCss}>
			<Item name={id} />
		</Flex>
	);
};

const Item = ({ name }: { name: string }) => {
	const [formData, setFormData] = useState<any>({});
	const [changedData, setChangedData] = useState({});
	return (
		<Center {...iconBox}>
			<FormInput
				formData={formData}
				setFormData={setFormData}
				setChangedData={setChangedData}
				isRequired={true}
				name={name}
				label={generateLabel(name)}
				type={name}
				value={getFieldValue({ name: name, formData })}
				onChange={getOnChangeHandler({
					type: name,
					key: name,
					formData,
					setFormData,
					setChangedData,
				})}
				model={'products'}
				placeholder={'Placeholder'}
				options={selectOptions}
				dataModel={[]}
				item={{
					value: formData[name] as any,
					helper: 'Helper text goes here (Optional)',
				}}
			/>
			<Text {...textCss}>Type: {name}</Text>
			<Text {...textCss}>Value: {JSON.stringify(formData)}</Text>
		</Center>
	);
};

const bodyCss: FlexProps = {
	flex: 1,
	bg: '#fafafa',
	w: '100vw',
	minH: '100vh',
	py: '32px',
	px: { base: '16px', md: '64px' },
	flexWrap: 'wrap',
	gap: 4,
};

const iconBox: FlexProps = {
	w: { base: '100%', md: '600px' },
	// h: '300px',
	bg: 'white',
	flexDir: 'column',
	p: 4,
	gap: 4,
	boxShadow: 'md',
	borderRadius: 8,
};

const textCss: TextProps = {
	fontSize: '12px',
	textAlign: 'center',
	fontWeight: 'semibold',
};

const selectOptions = [
	{ label: 'Option 1', value: 'option1' },
	{ label: 'Option 2', value: 'option2' },
	{ label: 'Option 3', value: 'option3' },
];

export default IconPage;
