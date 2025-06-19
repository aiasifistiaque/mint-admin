import { IconButton as IButton, IconButtonProps, Tooltip } from '@chakra-ui/react';
import { Icon } from '..';

const IconButton = ({
	color,
	iconName,
	iconSize,
	tooltip,
	...props
}: IconButtonProps & { iconName: any; color?: string; iconSize?: number; tooltip?: string }) => {
	const Container = ({ children }: any) => {
		if (tooltip)
			return (
				<Tooltip
					label={tooltip}
					aria-label={tooltip}>
					{children}
				</Tooltip>
			);
		return <>{children}</>;
	};
	return (
		<Container>
			<IButton
				icon={
					<Icon
						name={iconName}
						color={color || 'inherit'}
						size={iconSize}
					/>
				}
				{...props}
			/>
		</Container>
	);
};

export default IconButton;
