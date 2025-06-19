import React, { FC } from 'react';

import { Center, FormControl, Image, Stack, InputProps, GridProps } from '@chakra-ui/react';
import { UploadModal, HelperText, Label, ImageContainer } from '../..';

type FormDataType = InputProps &
	GridProps & {
		value: string | undefined;
		onChange: any;
		isRequired?: boolean;
		label?: string;
		helper?: string;
		isDisabled?: boolean;
		folder?: string;
	};

const VImage: FC<FormDataType> = ({
	value,
	onChange,
	isRequired = false,
	label,
	helper,
	folder,
	isDisabled = false,
}) => {
	const type = value ? 'edit' : 'add';

	const imageComponent = (
		<ImageContainer>
			<Image
				h='100%'
				w='100%'
				objectFit='contain'
				src={value}
			/>
		</ImageContainer>
	);

	if (isDisabled) return imageComponent;
	return (
		<FormControl isRequired={isRequired}>
			<Stack w='full'>
				<Label>{label}</Label>
				<Center sx={styles.container}>
					<UploadModal
						type={type}
						handleImage={onChange}
						multiple={true}
						folder={folder}
						fileType='image'
					/>
					{value && imageComponent}
				</Center>
				{helper && <HelperText>{helper}</HelperText>}
			</Stack>
		</FormControl>
	);
};

const styles = {
	container: {
		h: '200px',
		w: '200px',
		bg: 'transparent',
		position: 'relative',
	},
};

export default VImage;
