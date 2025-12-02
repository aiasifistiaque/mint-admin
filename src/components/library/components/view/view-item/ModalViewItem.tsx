import { FC, useEffect } from 'react';
import { Flex, Grid, GridProps, Heading, Tooltip, useClipboard } from '@chakra-ui/react';
import { Icon } from '../../..';
import { renderViewItem as renderContent } from '..';
import { SkeletonContent, ViewItemProps } from './utils';
import { useColorMode } from '@/components/ui/color-mode';

const ViewItem: FC<ViewItemProps> = ({
	title,
	type,
	children,
	colorPalette,
	path,
	copy,
	isLoading = false,
	...props
}) => {
	const { copy: onCopy, value, setValue, copied: hasCopied } = useClipboard();

	useEffect(() => {
		if (children && copy) setValue(children.toString());
	}, [children]);

	return (
		<Grid
			{...gridCss(type)}
			{...props}>
			<SkeletonContent isLoading={isLoading}>
				<Heading
					size='sm'
					color='heading.lightMuted'
					_dark={{ color: 'heading.darkMuted' }}>
					{title}:
				</Heading>
			</SkeletonContent>
			<SkeletonContent isLoading={isLoading}>
				<Flex
					gap={2}
					align='center'>
					{!isLoading &&
						children &&
						renderContent({ type, children, colorPalette, path, isLoading })}
					{copy && children && children != 'n/a' && (
						<Tooltip.Root
							openDelay={200}
							closeDelay={100}
							positioning={{ placement: 'top' }}>
							<Tooltip.Trigger asChild>
								<Flex
									onClick={onCopy}
									cursor='pointer'>
									<Icon name='copy' />
								</Flex>
							</Tooltip.Trigger>
							<Tooltip.Positioner>
								<Tooltip.Content>{hasCopied ? 'Copied!' : 'Copy'}</Tooltip.Content>
							</Tooltip.Positioner>
						</Tooltip.Root>
					)}
				</Flex>
			</SkeletonContent>
		</Grid>
	);
};

const GRID_COLUMNS = '1fr 3fr';

const gridCss = (type: string = 'string'): GridProps => {
	return {
		justifyContent: 'center',
		px: { base: 4, md: 4 },
		pb: 2,
		gridTemplateColumns: {
			base: '1fr',
			md: type == 'textarea' || type == 'section-data-array' ? '1fr' : GRID_COLUMNS,
		},
		gap: {
			base: 2,
			md: type == 'textarea' || type == 'section-data-array' ? 3 : 8,
		},
		borderBottomWidth: 1,
		borderColor: { base: 'border.light', _dark: 'border.dark' },
		_last: { borderBottomWidth: 0 },
	};
};

export default ViewItem;
