import React from 'react';
import { Column } from '@/components/library';

const Container = ({ children }: { children: React.ReactNode }) => (
	<Column
		w='full'
		pr={3}
		py={2}
		borderTop='1px dashed'
		borderTopColor='#bbb'
		_dark={{ borderTopColor: 'stroke.deepD' }}>
		{children}
	</Column>
);

export default Container;
