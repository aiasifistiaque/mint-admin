import React, { FC } from 'react';

import {
	Center,
	FormControl,
	Image,
	Stack,
	InputProps,
	GridProps,
	Flex,
	Text,
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
	limit,
}) => {
	const type = value ? 'edit' : 'add';
	const length = value?.length || 0;

	return (
		<FormControl isRequired={isRequired}>
			<Stack w='full'>
				<Label>{label}</Label>
				<Flex
					gap={2}
					flexWrap='wrap'>
					{value?.map((image: string, i: number) => (
						<Center
							key={i}
							sx={styles.container}>
							<UploadModal
								type='delete'
								handleImage={onChange}
								handleDelete={() => onChange(image, 'delete')}
								multiple={true}
							/>
							<ImageContainer>
								<Image
									h='100%'
									w='100%'
									objectFit='contain'
									src={image}
								/>
							</ImageContainer>
						</Center>
					))}
					<Center sx={styles.container}>
						<UploadModal
							type='add'
							handleImage={onChange}
							multiple={true}
						/>
					</Center>
				</Flex>

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

export default VImageArray;
