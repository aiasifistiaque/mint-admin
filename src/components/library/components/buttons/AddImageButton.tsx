import { ReactNode, FC } from 'react';
import { Center, FlexProps, Heading } from '@chakra-ui/react';
import { Icon } from '../..';

type AddImageButtonProps = FlexProps & {
	children?: ReactNode;
	h?: string | number;
	w?: string | number;
	size?: string;
};

const DEFAULT_IMAGE_SIZE = '100px';

const AddImageButton: FC<AddImageButtonProps> = ({ children, h, w, size, ...props }) => {
	return (
		<Center
			{...imageCss}
			h={h || size || DEFAULT_IMAGE_SIZE}
			w={w || size || DEFAULT_IMAGE_SIZE}
			{...props}>
			<Icon
				name='add-image'
				size={30}
			/>
			<Heading
				color='#ccc'
				size='xs'>
				{children || 'Add Image'}
			</Heading>
		</Center>
	);
};

const imageCss: FlexProps = {
	cursor: 'pointer',
	flexDir: 'column',
	border: '2px dashed',
	borderColor: 'border.light',
	_dark: {
		borderColor: 'border.dark',
	},
	borderRadius: '8px',
	color: '#ccc',
	userSelect: 'none',
	gap: 2,
};

export default AddImageButton;
