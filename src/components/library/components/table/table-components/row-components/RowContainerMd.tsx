import { FC, useState, ReactNode } from 'react';
import { Tr, TextProps } from '@chakra-ui/react';

type RowContainerMdProps = TextProps & {
	children: ReactNode;
};

const RowContainerMd: FC<RowContainerMdProps> = ({ children, ...props }) => {
	// const [bg, setBg] = useState('transparent');
	// const handleMouseEnter = () => {
	// 	setBg('#ddd');
	// };
	// const handleMouseLeave = () => {
	// 	setBg('transparent');
	// };
	return (
		<Tr
			_notLast={{
				borderBottom: '1px solid',
				borderBottomColor: 'table.innerBorder.light',
				_dark: {
					borderBottomColor: 'table.innerBorder.dark',
				},
			}}
			// border='1px solid red'
			// onMouseEnter={handleMouseEnter}
			// onMouseLeave={handleMouseLeave}
			{...props}>
			{children}
		</Tr>
	);
};

export default RowContainerMd;
