import { FC, useEffect } from 'react';
import { Flex, Heading, Tooltip, useClipboard } from '@chakra-ui/react';
import { Column, Icon } from '../../..';
import { renderViewItem as renderContent } from '..';
import { SkeletonContent, ViewItemProps } from './utils';

const ViewPageItem: FC<ViewItemProps> = ({
	title,
	type,
	children,
	colorScheme,
	originalType,
	path,
	copy,
	idKey,
	id,
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
		<Column {...props}>
			<SkeletonContent isLoading={isLoading}>
				<Heading size='sm'>{title}:</Heading>
			</SkeletonContent>
			<SkeletonContent isLoading={isLoading}>
				<Flex
					gap={2}
					align='center'>
					{!isLoading &&
						children &&
						renderContent({ type, children, colorScheme, path, isLoading, originalType, id })}
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
		</Column>
	);
};

export default ViewPageItem;
