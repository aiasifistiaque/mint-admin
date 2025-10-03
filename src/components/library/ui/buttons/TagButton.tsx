import React from 'react';
import { Tag, TagLabel, TagProps } from '@chakra-ui/react';

const TagButton = ({ children, ...props }: TagProps & { children: React.ReactNode }) => {
	return (
		<Tag
			cursor='pointer'
			size='md'
			bg='transparent'
			borderWidth={1}
			{...props}>
			<TagLabel>{children}</TagLabel>
		</Tag>
	);
};
export default TagButton;
