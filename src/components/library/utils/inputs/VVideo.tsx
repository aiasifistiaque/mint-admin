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
	};

const VVideo: FC<FormDataType> = ({
	value,
	onChange,
	isRequired = false,
	label,
	helper,
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
						title='Insert Video'
						type={type}
						fileType='video'
						handleImage={onChange}
						multiple={true}
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

export default VVideo;
