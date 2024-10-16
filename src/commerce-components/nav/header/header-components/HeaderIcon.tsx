import { Icon, IconNameOptions } from '../../..';
import { Link } from '@chakra-ui/react';
import React from 'react';

const HeaderIcon = ({ name, href }: { name: IconNameOptions; href: string }) => {
	return (
		<Link href={href}>
			<Icon
				name={name}
				size={22}
				color='#676767'
			/>
		</Link>
	);
};

export default HeaderIcon;
