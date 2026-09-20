import { FC, useRef } from 'react';
import { Box, Button, Flex, Image, Text } from '@chakra-ui/react';
import { useUploadSignatureMutation } from '../store';

type SignatureUploadProps = {
	value?: string;
	onChange: (url: string) => void;
	helper?: string;
};

// Dedicated uploader for the admin's signature. Unlike the generic image
// picker, this never browses or saves into the shared media library — it
// uploads straight to S3 (see POST /upload/signature) and only ever hands
// back a URL for the admin's own `signature` field.
const SignatureUpload: FC<SignatureUploadProps> = ({ value, onChange, helper }) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [uploadSignature, result] = useUploadSignatureMutation();

	const handlePick = () => inputRef.current?.click();

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		e.target.value = '';
		if (!file) return;

		const formData = new FormData();
		formData.append('image', file);

		const res: any = await uploadSignature(formData);
		const url = res?.data?.data?.url;
		if (url) onChange(url);
	};

	return (
		<Flex
			align='center'
			gap={4}
			wrap='wrap'>
			<Box
				border='1px dashed'
				borderColor={{ _light: 'border.light', _dark: 'border.dark' }}
				borderRadius='md'
				w='200px'
				h='100px'
				display='flex'
				alignItems='center'
				justifyContent='center'
				bg='transparent'
				overflow='hidden'>
				{value ? (
					<Image
						src={value}
						alt='signature'
						h='100%'
						w='100%'
						objectFit='contain'
					/>
				) : (
					<Text
						fontSize='.8rem'
						color='text.500'>
						No signature
					</Text>
				)}
			</Box>
			<Flex
				direction='column'
				gap={1}>
				<input
					ref={inputRef}
					type='file'
					accept='image/*'
					style={{ display: 'none' }}
					onChange={handleFileChange}
				/>
				<Button
					size='xs'
					px={3}
					loading={result?.isLoading}
					onClick={handlePick}>
					{value ? 'Replace Signature' : 'Upload Signature'}
				</Button>
				{helper && (
					<Text
						fontSize='.75rem'
						color='text.500'
						maxW='260px'>
						{helper}
					</Text>
				)}
			</Flex>
		</Flex>
	);
};

export default SignatureUpload;
