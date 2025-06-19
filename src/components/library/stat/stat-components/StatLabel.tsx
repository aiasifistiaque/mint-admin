import { StatLabelProps, StatLabel as CStatLabel } from '@chakra-ui/react';
import { ReactNode } from 'react';

const StatLabel = ({ children, ...props }: StatLabelProps & { children: ReactNode }) => {
	return (
		<CStatLabel
			w='full'
			fontSize='1.15rem'
			{...props}>
			{children}
		</CStatLabel>
	);
};

export default StatLabel;
