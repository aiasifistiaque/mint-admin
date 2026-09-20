import { Flex, FlexProps, Heading, Button, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { FC } from 'react';
import { CreateModal, Icon } from '../..';
import ExportModal from '../modals/export/ExportModal';
import { useColorMode } from '@/components/ui/color-mode';
import { buttonGroupCss, containerCss, headingCss, subHeadingCss } from './style';

type PageHeadingProps = FlexProps & {
	title: string;
	subtitle?: string;
	button?: string;
	href?: string;
	isModal?: boolean;
	path: string;
	data?: any;
	export?: boolean;
	table: any;
};

const PageHeading: FC<PageHeadingProps> = ({
	title,
	subtitle,
	href,
	button,
	isModal = false,
	path,
	table,
	data,
	export: exportData,
	...props
}) => {
	const { colorMode } = useColorMode();
	const iconColor = colorMode === 'light' ? 'text.dark' : 'text.light';

	const btn = (
		<Button size='sm'>
			<Icon
				size={16}
				name='add'
				color={iconColor}
			/>
			{button}
		</Button>
	);

	const exportButton = <ExportModal path={path} />;

	const renderButton = () => {
		if (isModal)
			return (
				<CreateModal
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
			{...containerCss}
			{...props}>
			<Flex
				flexDir='column'
				gap={0.5}
				minW={0}>
				<Heading {...headingCss}>{title}</Heading>
				{subtitle && <Text {...subHeadingCss}>{subtitle}</Text>}
			</Flex>
			<Flex {...buttonGroupCss}>
				<>{Boolean(exportData) && exportButton}</>
				<>{(Boolean(button) || isModal) && renderButton()}</>
			</Flex>
		</Flex>
	);
};

export default PageHeading;
