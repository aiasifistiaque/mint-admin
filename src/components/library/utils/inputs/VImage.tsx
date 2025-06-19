import { FC } from 'react';

import {
	Center,
	FormControl,
	Image,
	Stack,
	InputProps,
	GridProps,
	FlexProps,
} from '@chakra-ui/react';
import { UploadModal, HelperText, Label, ImageContainer } from '../..';

type FormDataType = InputProps &
	GridProps & {
		value: string | undefined;
		onChange: any;
		isRequired?: boolean;
		label?: string;
		helper?: string;
		isDisabled?: boolean;
		style?: any;
		folder?: string;
	};

const VImage: FC<FormDataType> = ({
	value,
	onChange,
	isRequired = false,
	label,
	helper,
	isDisabled = false,
	style,
	folder,
}) => {
	const type = value ? 'edit' : 'add';

	const imageComponent = (
		<ImageContainer
			w='full'
			h='full'>
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
				<Center
					{...imageCss}
					w={style?.w || '200px'}
					h={style?.h || '200px'}>
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

const imageCss: FlexProps = {
	bg: 'transparent',
	position: 'relative',
};

export default VImage;
