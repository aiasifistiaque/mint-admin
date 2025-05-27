'use client';

import React, { FC, useRef } from 'react';
import { Button, InputProps, Input, Link } from '@chakra-ui/react';
import { FormControl } from '../';
import { Icon } from '../../../';
import {
	useAddFileMutation,
	useAddUploadMutation,
} from '@/components/library/store/services/uploadApi';

type InputContainerProps = InputProps & {
	label: string;
	isRequired?: boolean;
	helper?: string;
	value: string;
	placeholder?: any;
};

const VFile: FC<InputContainerProps> = ({
	label,
	isRequired,
	placeholder,
	value,
	helper,
	...props
}) => {
	const ref = useRef(null);
	const [trigger, result] = useAddFileMutation();
	const [filee, setFile] = React.useState<any>(null);
	const onRefClick = () => {
		if (ref.current) {
			(ref.current as any).click();
		}
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setFile(file);
			// Create a new FormData object
			const formData = new FormData();

			// Append the file to the FormData object
			formData.append('file', file);
			formData.append('folder', 'products');

			// Trigger the mutation with the FormData object
			trigger(formData);
		}
	};

	React.useEffect(() => {
		if (!result?.isLoading && result?.isSuccess) {
			if (props.onChange) {
				const event = {
					target: {
						name: props?.name,
						value: result?.data?.data?.url,
					},
				} as any;
				props.onChange(event); // Call onChange with the synthetic event
			}
		}
	}, [result?.isLoading]);

	return (
		<FormControl
			isRequired={isRequired}
			label={label}
			helper={helper}>
			<Button
				isDisabled={result?.isLoading}
				isLoading={result?.isLoading}
				loadingText='Uploading'
				spinnerPlacement='start'
				onClick={onRefClick}
				variant='white'
				leftIcon={<Icon name='copy' />}>
				{value ? 'Change File' : 'Upload File'}
			</Button>
			{value && (
				<Link
					mt={2}
					fontSize='12px'
					color='blue.500'
					isExternal
					href={value ? value : '#'}>
					{value}
				</Link>
			)}
			<Input
				ref={ref}
				display='none'
				type='file'
				size='sm'
				px={3}
				placeholder={placeholder ? placeholder : label}
				// value={value}
				// {...props}
				onChange={handleFileChange}
			/>
		</FormControl>
	);
};

export default VFile;
