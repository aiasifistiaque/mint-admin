import React, { FC, useRef } from 'react';

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

	const videoRef = useRef<any>(null);

	const handleMouseEnter = () => {
		videoRef.current?.play();
	};

	const handleMouseLeave = () => {
		videoRef.current?.pause();
		videoRef.current.currentTime = 0;
	};

	const imageComponent = (
		<ImageContainer
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}>
			<video
				muted
				key={value}
				ref={videoRef}
				playsInline
				loop
				style={{ width: '100%', height: '60%', objectFit: 'contain' }}>
				<source
					src={value}
					type='video/mp4'
				/>
				Your browser does not support the video tag.
			</video>
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
