import { FC } from 'react';
import { DynamicIcon } from 'lucide-react/dynamic';
import { useColorModeValue } from '@chakra-ui/react';
import { icons } from 'lucide-react';

type IconProps = {
	size?: number;
	color?: string;
	name: string;
};

const LucideIcon: FC<IconProps> = ({ name, ...props }) => {
	const brandColor = useColorModeValue('brand.light', 'brand.dark');
	const defaultColor = useColorModeValue('#4a4a4a', 'white');

	// Check if the icon exists in the icons object
	const iconExists = name in icons;

	if (!iconExists) {
		console.warn(`Icon "${name}" not found in lucide-react`);
		return (
			<DynamicIcon
				name='circle-alert'
				size={props.size}
				color={props.color || defaultColor}
			/>
		);
	}

	return (
		<DynamicIcon
			name={name as any}
			size={props.size}
			color={props.color || defaultColor}
			{...props}
		/>
	);
};

export default LucideIcon;
