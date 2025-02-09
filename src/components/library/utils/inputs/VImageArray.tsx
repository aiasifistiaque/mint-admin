import React, { FC } from 'react';

import {
	Center,
	FormControl,
	Image,
	Stack,
	InputProps,
	GridProps,
	FlexProps,
	ImageProps,
	Wrap,
} from '@chakra-ui/react';

import { UploadModal, HelperText, Label, ImageContainer } from '../..';

type FormDataType = InputProps &
	GridProps & {
		value: string[] | undefined;
		onChange: any;
		isRequired?: boolean;
		label?: string;
		helper?: string;
		isDisabled?: boolean;
		limit?: number;
	};

const VImageArray: FC<FormDataType> = ({
	value,
	onChange,
	isRequired = false,
	label,
	helper,
	isDisabled = false,
	limit = 999,
}) => {
	const type = value ? 'edit' : 'add';
	const length = value?.length || 0;

	return (
		<FormControl isRequired={isRequired}>
			<Stack w='full'>
				<Label>{label}</Label>
				<Wrap gap={2}>
					{value?.map((image: string, i: number) => (
						<Center
							key={i}
							{...containerCSS}>
							<UploadModal
								type='delete'
								handleImage={onChange}
								handleDelete={() => onChange(image, 'delete')}
								multiple={true}
							/>
							<ImageContainer>
								<Image
									{...imageCss}
									src={image}
								/>
							</ImageContainer>
						</Center>
					))}
					{value && value?.length >= limit ? null : (
						<Center {...containerCSS}>
							<UploadModal
								type='add'
								handleImage={onChange}
								multiple={true}
							/>
						</Center>
					)}
				</Wrap>

				{helper && <HelperText>{helper}</HelperText>}
			</Stack>
		</FormControl>
	);
};

const containerCSS: FlexProps = {
	h: '200px',
	w: '200px',
	bg: 'transparent',
	position: 'relative',
};

const imageCss: ImageProps = {
	h: '100%',
	w: '100%',
	objectFit: 'contain',
};

export default VImageArray;
