import { Flex, FlexProps, Heading, Button, useColorModeValue, TextProps } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { BackendCreateModal, createFormFields, Icon } from '../..';
import ExportModal from '../modals/export/ExportModal';

type PageHeadingProps = FlexProps & {
	title: string;
	button?: string;
	href?: string;
	isModal?: boolean;
	path: string;
	data?: any;
	export?: boolean;
	table: any;
	layout: any;
	schema: any;
};

const BackendPageHeading: React.FC<PageHeadingProps> = ({
	title,
	href,
	button,
	isModal = false,
	path,
	table,
	data,
	schema,
	layout,
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

	const formFields = createFormFields({ schema, layout });

	const exportButton = <ExportModal path={path} />;
	const renderButton = () => {
		if (isModal)
			return (
				<BackendCreateModal
					trigger={btn}
					type='post'
					path={path}
					data={formFields}
					invalidate={table?.invalidate}
					prompt={table?.button?.prompt}
				/>
			);
		else if (href) return <Link href={href}>{btn}</Link>;
		else return btn;
	};

	return (
		<Flex
			{...containerCss}
			{...props}>
			<Heading {...headingCss}>{title}</Heading>
			<Flex {...buttonGroupCss}>
				<>{Boolean(exportData) && exportButton}</>
				<>{(Boolean(button) || isModal) && renderButton()}</>
			</Flex>
		</Flex>
	);
};

const containerCss: FlexProps = {
	flexDir: { base: 'column', md: 'row' },
	gap: 2,
	justify: 'space-between',
	align: { base: 'flex-start', md: 'center' },
	pt: 4,
};

const headingCss: TextProps = {
	fontSize: { base: '1.5rem', md: '1.75rem' },
};

const buttonGroupCss: FlexProps = {
	gap: 2,
	w: 'full',
	justify: 'flex-end',
};

export default BackendPageHeading;
