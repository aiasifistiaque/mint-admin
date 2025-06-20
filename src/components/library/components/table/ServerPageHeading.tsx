import { Flex, FlexProps, Heading, Button, useColorModeValue, Text } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { BackendCreateModal, Icon } from '../..';
import ExportModal from '../modals/export/ExportModal';
import { buttonGroupCss, containerCss, headingCss, subHeadingCss, wrapperCss } from './style';

type PageHeadingProps = FlexProps & {
	title: string;
	button?: string;
	href?: string;
	isModal?: boolean;
	path: string;
	data?: any;
	export?: boolean;
	table: any;
};

const ServerPageHeading: React.FC<PageHeadingProps> = ({
	title,
	href,
	button,
	isModal = false,
	path,
	table,
	data,
	export: exportData,
	...props
}) => {
	const iconColor = useColorModeValue('#fafafa', '#171717');
	const btn = (
		<Button
			size='sm'
			pl={3}
			leftIcon={
				<Icon
					size={18}
					name='add'
					color={iconColor}
				/>
			}>
			{button}
		</Button>
	);

	const exportButton = <ExportModal path={path} />;
	const renderButton = () => {
		if (isModal)
			return (
				<BackendCreateModal
					trigger={btn}
					type='post'
					path={path}
					data={data}
					invalidate={table?.invalidate}
					prompt={table?.button?.prompt}
				/>
			);
		else if (href) return <Link href={href}>{btn}</Link>;
		else return btn;
	};

	return (
		<Flex
			{...wrapperCss}
			{...props}>
			<Flex {...containerCss}>
				<Heading {...headingCss}>{title}</Heading>

				<Flex {...buttonGroupCss}>
					<>{Boolean(exportData) && exportButton}</>
					<>{(Boolean(button) || isModal) && renderButton()}</>
				</Flex>
			</Flex>
			{table?.subTitle && <Text {...subHeadingCss}>{table?.subTitle}</Text>}
		</Flex>
	);
};

export default ServerPageHeading;
