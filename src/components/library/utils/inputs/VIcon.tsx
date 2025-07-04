import { FC } from 'react';

import { FormControl, InputProps, GridProps, Flex } from '@chakra-ui/react';
import { HelperText, Label, IconModal, LucideIcon } from '../..';

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

const VIcon: FC<FormDataType> = ({
	value,
	onChange,
	isRequired = false,
	label,
	helper,
	folder,
}) => {
	const type = value ? 'edit' : 'add';

	return (
		<FormControl isRequired={isRequired}>
			<Flex
				flexDir='column'
				gap={2}
				w='full'>
				<Label>{label}</Label>

				<Flex
					align='center'
					gap={4}>
					{value && (
						<LucideIcon
							size={44}
							name={value}
						/>
					)}
					<IconModal
						type={type}
						handleImage={onChange}
						multiple={true}
						folder={folder}
						fileType='image'
					/>
				</Flex>
				{helper && <HelperText>{helper}</HelperText>}
			</Flex>
		</FormControl>
	);
};

export default VIcon;
