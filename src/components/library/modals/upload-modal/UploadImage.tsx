import React from 'react';

import { Button, Center, Heading, Progress, Text } from '@chakra-ui/react';
import { useAddVideoMutation } from '../../store';

const UploadImage = ({
	handleSelect,
	fileType = 'image',
	folder,
}: {
	handleSelect: any;
	fileType?: string;
	folder?: string;
}) => {
	const [image, setImage] = React.useState<any>(null);
	const [isDragOver, setIsDragOver] = React.useState(false);
	const inputRef = React.useRef<HTMLInputElement>(null);

	const [trigger, result] = useAddVideoMutation();

	const handleUpload = () => {
		inputRef.current?.click();
	};

	const handleFileUpload = (file: File) => {
		setImage(file);
		// Create a new FormData object
		const formData = new FormData();

		// Append the file to the FormData object
		formData.append('image', file);
		formData.append('folder', folder || 'uploads');

		// Trigger the mutation with the FormData object
		trigger({ body: formData, type: fileType });
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			handleFileUpload(file);
		}
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);

		const files = e.dataTransfer.files;
		if (files && files[0]) {
			handleFileUpload(files[0]);
		}
	};

	React.useEffect(() => {
		if (!result?.isLoading && result?.isSuccess) {
			handleSelect(result?.data?.data?.url);
		}
	}, [result?.isLoading]);

	const body = result?.isLoading ? (
		<Center
			gap={4}
			flexDir='column'
			flex={1}
			h='full'
			w='400px'>
			<Heading size='md'>Uploading...</Heading>
			<Progress
				colorScheme='brand'
				w='100%'
				size='sm'
				borderRadius='40px'
				isIndeterminate
			/>
		</Center>
	) : result?.isSuccess ? (
		<Text>Image Uploaded Successfully</Text>
	) : result?.isError ? (
		<Text>{JSON.stringify((result as any)?.error)}</Text>
	) : (
		<>
			<input
				type='file'
				ref={inputRef}
				style={{ display: 'none' }}
				onChange={handleFileChange}
			/>
			<Heading size='md'>{isDragOver ? 'Drop Image Here' : 'Drag and drop an image here'}</Heading>
			<Text
				textAlign='center'
				my={1}>
				Or
			</Text>

			<Button
				size='sm'
				colorScheme='gray'
				onClick={handleUpload}>
				Upload From Device
			</Button>
		</>
	);

	return (
		<Center
			flexDir='column'
			flex={1}
			h='full'
			py='16px'
			w='100%'
			borderRadius='8px'
			border={isDragOver ? '2px dashed #4A90E2' : '2px dashed #ddd'}
			backgroundColor={isDragOver ? 'blue.50' : 'transparent'}
			gap={2}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			transition='all 0.2s ease'>
			{body}
		</Center>
	);
};

export default UploadImage;
