'use client';

import React from 'react';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { styles, HInputProps } from './util';
import { FiEye, FiEyeOff } from 'react-icons/fi';

import { InputContainer } from '../../';

const ICON_WIDTH = '3rem';
const EYE_COLOR = '#aaa';

const HPassword: React.FC<HInputProps> = ({ label, isRequired, placeholder, value, ...props }) => {
	const [show, setShow] = React.useState<boolean>(false);
	const toggle = () => setShow(!show);
	return (
		<InputContainer
			label={label}
			isRequired={isRequired}>
			<InputGroup>
				<Input
					sx={styles.input}
					placeholder={placeholder ? placeholder : label}
					value={value}
					type={show ? 'text' : 'password'}
					{...props}
				/>
				<InputRightElement width={ICON_WIDTH}>
					{!show ? (
						<FiEyeOff
							color={EYE_COLOR}
							onClick={toggle}
							cursor='pointer'
						/>
					) : (
						<FiEye
							color={EYE_COLOR}
							onClick={toggle}
							cursor='pointer'
						/>
					)}
				</InputRightElement>
			</InputGroup>
		</InputContainer>
	);
};

export default HPassword;
