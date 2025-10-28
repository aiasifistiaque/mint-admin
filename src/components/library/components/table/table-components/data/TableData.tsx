import {
	Badge,
	BadgeProps,
	Flex,
	TableCellProps,
	Text,
	Tooltip,
	useClipboard,
} from '@chakra-ui/react';
import moment from 'moment';
import { FC } from 'react';
import { CustomTd } from '.';
import { Align, TableObjectDataProps } from '../../../..';
import { Copy as CopyIcon } from 'lucide-react';
import { useColorMode } from '@/components/ui/color-mode';

// Define the type for the props of the TableData component
type TableDataPropsType = TableCellProps &
	TableObjectDataProps & {
		children: any;
		key: string;
		colorPalette?: any;
		item?: any;
		copy?: boolean;
		colorTheme?: any;
	};

const TableData: FC<TableDataPropsType> = ({
	children,
	id,
	copy,
	type,
	colorPalette,
	toLocaleStr,
	tagType,
	imageKey,
	key,
	item,
	...props
}) => {
	const { copy: onCopy, copied: hasCopied } = useClipboard(children);
	const commonProps = {
		toLocaleStr,
		colorPalette,
		key,
		type,
		tagType,
		imageKey,
		...props,
	};
	if (copy) {
		if (!children) return <TableBody {...commonProps}>--</TableBody>;
		return (
			<Tooltip.Root
				openDelay={200}
				closeDelay={100}
				positioning={{ placement: 'top' }}>
				<Tooltip.Trigger asChild>
					<TableBody
						item={item}
						{...commonProps}
						cursor='pointer'
						onClick={onCopy}
						{...props}>
						{children}
						<CopyIcon
							size={16}
							style={{ marginLeft: '8px' }}
						/>
					</TableBody>
				</Tooltip.Trigger>
				<Tooltip.Positioner>
					<Tooltip.Content>{hasCopied ? 'Copied!' : 'Click to Copy'}</Tooltip.Content>
				</Tooltip.Positioner>
			</Tooltip.Root>
		);
	}

	return (
		<TableBody
			item={item}
			{...commonProps}>
			{children}
		</TableBody>
	);
};

const TableBody: FC<TableDataPropsType> = ({
	children,
	id,
	type,
	colorPalette,
	toLocaleStr,
	tagType,
	imageKey,
	key,
	item,
	colorTheme,
	...props
}) => {
	const { colorMode } = useColorMode();
	switch (type) {
		case 'checkbox':
			return (
				<CustomTd>
					<Align gap={2}>
						<Flex
							borderRadius='full'
							h='10px'
							w='10px'
							bg={
								children?.toString() === 'true'
									? colorMode == 'dark'
										? '#50e3c2'
										: '#00a843'
									: colorMode === 'dark'
									? '#fe5f55'
									: '#EE0000'
							}
						/>
						<Text
							fontSize='15px'
							textTransform='capitalize'>
							{item?.displayValue ? item?.displayValue[children?.toString()] : children?.toString()}
						</Text>
					</Align>

					{/* <Badge
						colorPalette={
							colorTheme ? colorTheme[children] : children?.toString() === 'true' ? 'green' : 'red'
						}
						{...badgeCss}>
						{item?.displayValue ? item?.displayValue[children?.toString()] : children?.toString()}
					</Badge> */}
				</CustomTd>
			);

		case 'tag':
			return (
				<CustomTd
					flexWrap='wrap'
					gap={2}>
					{Array.isArray(children)
						? children.map((item: any, i: number) => (
								<Badge
									key={i}
									colorPalette={
										item?.colorTheme
											? item?.colorTheme[item.toLowerCase()]
											: colorPalette
											? colorPalette(children)
											: 'gray'
									}
									{...badgeCss}>
									{item}
								</Badge>
						  ))
						: null}
				</CustomTd>
			);
		case 'number':
			return <CustomTd {...props}>{children?.toLocaleString()}</CustomTd>;

		case 'image-text':
			return (
				<CustomTd
					display='flex'
					alignItems='center'
					type='image-text'
					gap={2}
					src={imageKey}
					{...props}>
					{children}
				</CustomTd>
			);
		case 'time':
			return (
				<CustomTd
					{...dateCss}
					{...props}>
					{children || '--'}
				</CustomTd>
			);
		case 'date-only':
			return (
				<CustomTd
					{...dateCss}
					{...props}>
					{children ? moment(children).format('DD-MM-YYYY') : '--'}
				</CustomTd>
			);
		case 'date':
			return (
				<CustomTd
					{...dateCss}
					{...props}>
					{children ? moment(children).calendar() : '--'}
				</CustomTd>
			);
		case 'boolean':
			return <CustomTd {...props}>{children ? 'Yes' : 'No'}</CustomTd>;
		case 'external-link':
			return (
				<CustomTd
					type={type}
					{...props}>
					{children}
				</CustomTd>
			);
		case 'file':
			return (
				<CustomTd
					type={type}
					{...props}>
					{children}
				</CustomTd>
			);

		default:
			return <CustomTd {...props}>{children}</CustomTd>;
	}
};

const dateCss: any = {
	fontSize: { base: '1rem', md: '.8rem' },
};

const badgeCss: BadgeProps = {
	fontSize: '12px',
	size: 'xs',
};

export default TableData;
