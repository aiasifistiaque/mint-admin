import { TextChild } from '../..';
import React, { FC } from 'react';
import { Heading } from '@chakra-ui/react';

type TypeProps = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const FS_BASE = {
	h1: '2.5rem',
	h2: '2rem',
	h3: '1.75rem',
	h4: '1.5rem',
	h5: '1.25rem',
	h6: '1rem',
};
const FS_MD = {
	h1: '5rem',
	h2: '4rem',
	h3: '3rem',
	h4: '2.5rem',
	h5: '2rem',
	h6: '1.5rem',
};

const Title: FC<TextChild & { type?: TypeProps }> = ({ children, ...props }) => {
	return (
		<Heading
			fontSize={{
				base: FS_BASE[props.type || 'h1'],
				md: FS_MD[props.type || 'h1'],
			}}
			color='etext.600'
			{...props}>
			{children}
		</Heading>
	);
};

export default Title;
