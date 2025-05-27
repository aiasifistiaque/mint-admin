import React from 'react';
import { useAddVideoMutation } from '@/store/services/uploadApi';
import { Button, Center, Heading, Progress, Text } from '@chakra-ui/react';

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
	const inputRef = React.useRef<HTMLInputElement>(null);

	const [trigger, result] = useAddVideoMutation();

	const handleUpload = () => {
		inputRef.current?.click();
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setImage(file);
			// Create a new FormData object
			const formData = new FormData();

			// Append the file to the FormData object
			formData.append('image', file);
			formData.append('folder', folder || 'uploads');

			// Trigger the mutation with the FormData object
			trigger({ body: formData, type: fileType });
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
				borderRadius='30px'
				isIndeterminate
			/>
		</Center>
	) : result?.isSuccess ? (
		<Text>Success</Text>
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
			<Heading
				size='lg'
				mb={2}>
				Upload Photo Here
			</Heading>
			<Button
				size='sm'
				onClick={handleUpload}>
				Upload
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
			border='2px dashed #ddd'
			gap={2}>
			{body}
		</Center>
	);
};

export default UploadImage;
