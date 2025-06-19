import { Badge, BadgeProps, TableCellProps, Tooltip, useClipboard } from '@chakra-ui/react';
import moment from 'moment';
import { FC } from 'react';
import { CustomTd } from '.';
import { TableObjectDataProps } from '../../../..';
import { CopyIcon } from '@chakra-ui/icons';

// Define the type for the props of the TableData component
type TableDataPropsType = TableCellProps &
	TableObjectDataProps & {
		children: any;
		key: string;
		colorScheme?: any;
		item?: any;
		copy?: boolean;
		colorTheme?: any;
	};

const TableData: FC<TableDataPropsType> = ({
	children,
	id,
	copy,
	type,
	colorScheme,
	toLocaleStr,
	tagType,
	imageKey,
	key,
	item,
	...props
}) => {
	const { onCopy, hasCopied } = useClipboard(children);
	const commonProps = {
		toLocaleStr,
		colorScheme,
		key,
		type,
		tagType,
		imageKey,
		...props,
	};
	if (copy) {
		if (!children) return <TableBody {...commonProps}>--</TableBody>;
		return (
			<Tooltip label={hasCopied ? 'Copied!' : 'Click to Copy'}>
				<TableBody
					{...commonProps}
					cursor='pointer'
					onClick={onCopy}
					{...props}>
					{children}
					{<CopyIcon ml={2} />}
				</TableBody>
			</Tooltip>
		);
	}

	return <TableBody {...commonProps}>{children}</TableBody>;
};

const TableBody: FC<TableDataPropsType> = ({
	children,
	id,
	type,
	colorScheme,
	toLocaleStr,
	tagType,
	imageKey,
	key,
	item,
	colorTheme,
	...props
}) => {
	switch (type) {
		case 'checkbox':
			return (
				<CustomTd>
					<Badge
						colorScheme={
							colorTheme ? colorTheme[children] : children?.toString() === 'true' ? 'green' : 'red'
						}
						{...badgeCss}>
						{children?.toString()}
					</Badge>
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
									colorScheme={
										item?.colorTheme
											? item?.colorTheme[item.toLowerCase()]
											: colorScheme
											? colorScheme(children)
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
					{children ? moment(children).format('hh:mm A') : '--'}
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
	fontSize: { base: '1rem', md: '.7rem' },
};

const badgeCss: BadgeProps = {
	fontSize: '12px',
	size: '2xs',
};

export default TableData;
