import { FC, useEffect } from 'react';
import { Flex, Grid, GridProps, Heading, Tooltip, useClipboard } from '@chakra-ui/react';
import { Icon } from '../../..';
import { renderViewItem as renderContent } from '..';
import { SkeletonContent, ViewItemProps } from './utils';

const ViewItem: FC<ViewItemProps> = ({
	title,
	type,
	children,
	colorScheme,
	path,
	copy,
	isLoading = false,
	...props
}) => {
	const { onCopy, value, setValue, hasCopied } = useClipboard('');

	useEffect(() => {
		if (children && copy) setValue(children.toString());
	}, [children]);

	return (
		<Grid
			{...gridCss(type)}
			{...props}>
			<SkeletonContent isLoading={isLoading}>
				<Heading size='xs'>{title}:</Heading>
			</SkeletonContent>
			<SkeletonContent isLoading={isLoading}>
				<Flex
					gap={2}
					align='center'>
					{!isLoading &&
						children &&
						renderContent({ type, children, colorScheme, path, isLoading })}
					{copy && children && children != 'n/a' && (
						<Tooltip
							label={hasCopied ? 'Copied!' : 'Copy'}
							aria-label='Copy'>
							<Flex
								onClick={onCopy}
								cursor='pointer'>
								<Icon name='copy' />
							</Flex>
						</Tooltip>
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
		px: { base: 4, md: 6 },
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
		borderColor: 'border.light',
		_dark: { borderColor: 'border.dark' },
		_last: { borderBottomWidth: 0 },
	};
};

export default ViewItem;
