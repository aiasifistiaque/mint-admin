import { Text, FlexProps, Grid, GridProps } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';
import { Column } from '../';

type DetailItemProps = FlexProps & {
	title: string;
	children: ReactNode;
	row?: boolean;
};

const DetailItem: FC<DetailItemProps> = ({ title, children, row, ...props }) => {
	if (row)
		return (
			<Grid
				gap={2}
				gridTemplateColumns='1fr 3fr'>
				<Text fontWeight='700'>{title}</Text>
				<Text>{children}</Text>
			</Grid>
		);
	return (
		<Column {...props}>
			<Text fontWeight='700'>{title}</Text>
			<Text>{children}</Text>
		</Column>
	);
};

export default DetailItem;
