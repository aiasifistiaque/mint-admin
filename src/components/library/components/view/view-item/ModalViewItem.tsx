import React, { FC, ReactNode, useEffect } from 'react';
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
		if (children && copy) {
			setValue(children.toString());
		}
	}, [children]);

	return (
		<GridContainer
			{...props}
			gridTemplateColumns={{
				base: '1fr',
				md: type == 'textarea' || type == 'section-data-array' ? '1fr' : '2fr 3fr',
			}}
			gap={{
				base: '8px',
				md: type == 'textarea' || type == 'section-data-array' ? '12px' : '32px',
			}}>
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
		</GridContainer>
	);
};

const GridContainer = ({ children, ...props }: GridProps & { children: ReactNode }) => (
	<Grid
		justifyContent='center'
		px={{ base: 4, md: 6 }}
		pb={2}
		gridTemplateColumns='2fr 3fr'
		gap='32px'
		borderBottomWidth={1}
		borderColor='border.light'
		_dark={{ borderColor: 'border.dark' }}
		_last={{ borderBottomWidth: 0 }}
		{...props}>
		{children}
	</Grid>
);

export default ViewItem;
