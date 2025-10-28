'use client';

import { FC, memo } from 'react';
import { DynamicIcon } from 'lucide-react/dynamic';
import { useColorMode } from '@/components/ui/color-mode';

type IconProps = {
	size?: number;
	color?: string;
	name: string;
};

const LucideIcon: FC<IconProps> = ({ name, ...props }) => {
	const { colorMode } = useColorMode();
	const brandColor = colorMode === 'light' ? 'brand.light' : 'brand.dark';
	const defaultColor = colorMode === 'light' ? '#4a4a4a' : 'white';

	// Check if the icon exists in the icons object
	// const iconExists = name in icons;

	// if (!iconExists) {
	// 	console.warn(`Icon "${name}" not found in lucide-react`);
	// 	return (
	// 		<DynamicIcon
	// 			name='circle-alert'
	// 			size={props.size}
	// 			color={props.color || defaultColor}
	// 		/>
	// 	);
	// }

	return (
		<DynamicIcon
			name={name as any}
			size={props.size}
			color={props?.color || defaultColor}
			{...props}
		/>
	);
};

export default memo(LucideIcon);
