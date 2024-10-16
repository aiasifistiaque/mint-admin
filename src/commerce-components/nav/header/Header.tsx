import React from 'react';

import { HeaderContainer, Logo, HeaderSection, HeaderText, HeaderIcon } from '.';
import { IconNameOptions } from '../..';

type ItemProps = { name: string; href: string };
const headerItems: ItemProps[] = [
	{
		name: 'Home',
		href: '/',
	},
	{
		name: 'Categories',
		href: '/categories',
	},
	{
		name: 'Shop',
		href: '/contact',
	},
];

const headerIcons: {
	name: IconNameOptions;
	href: string;
}[] = [
	{
		name: 'search',
		href: '#',
	},
	{
		name: 'cart',
		href: '#',
	},
	{
		name: 'grid',
		href: '#',
	},
];

const Header = () => {
	return (
		<HeaderContainer>
			<HeaderSection display={{ base: 'none', md: 'flex' }}>
				{headerItems.map((item, i) => (
					<HeaderText
						href={item?.href}
						key={i}>
						{item?.name}
					</HeaderText>
				))}
			</HeaderSection>
			<HeaderSection display={{ base: 'flex', md: 'none' }}>
				<HeaderIcon
					name='menu'
					href='#'
				/>
			</HeaderSection>
			<Logo>MintStore</Logo>
			<HeaderSection
				gap={{ base: 4, md: 8 }}
				justify='flex-end'>
				{headerIcons.map((item, i) => (
					<HeaderIcon
						name={item.name}
						key={i}
						href={item.href}
					/>
				))}
			</HeaderSection>
		</HeaderContainer>
	);
};

export default Header;
