import React from 'react';
import { Tag, TagLabel } from '@chakra-ui/react';

const TagButton = ({ children, ...props }: any & { children: React.ReactNode }) => {
	return (
		<Tag.Root
			cursor='pointer'
			size='md'
			bg='transparent'
			borderWidth={1}
			{...props}>
			<Tag.Label>{children}</Tag.Label>
		</Tag.Root>
	);
};
export default TagButton;
