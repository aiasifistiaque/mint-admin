import { FlexChild, sizes, Column } from '../..';
import React, { FC } from 'react';

const Body: FC<FlexChild> = ({ children, ...props }) => {
	return (
		<Column
			pt={{
				base: sizes.NAVBAR_HEIGHT_BASE,
				md: sizes.NAVBAR_HEIGHT,
			}}
			minH={sizes.BODY_MIN_HEIGHT}
			{...props}>
			{children}
		</Column>
	);
};

export default Body;
