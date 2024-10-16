import { ButtonChild } from '../..';
import React, { FC, ReactNode } from 'react';
import { PrimaryButton, SecondaryButton } from '..';
import Link from 'next/link';

type ButtonProps = ButtonChild & {
	href?: string;
};

const Button: FC<ButtonProps> = ({ children, href, ...props }) => {
	const { variant, ...rest } = props;

	const btn = () => {
		switch (variant) {
			case 'primary':
				return <PrimaryButton {...rest}>{children}</PrimaryButton>;
			case 'secondary':
				return <SecondaryButton {...rest}>{children}</SecondaryButton>;
			default:
				return <PrimaryButton {...rest}>{children}</PrimaryButton>;
		}
	};

	return <Container href={href}>{btn()}</Container>;
};

const Container = ({ children, href }: { children: ReactNode; href: string | undefined }) => {
	if (href) {
		return <Link href={href}>{children}</Link>;
	}
	return <>{children}</>;
};

export default Button;
