import { Flex, FlexProps, Heading, Button, Text, Skeleton } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
// import { BackendCreateModal, Icon } from '../..';

import ExportModal from '../modals/export/ExportModal';
import { buttonGroupCss, containerCss, headingCss, subHeadingCss, wrapperCss } from './style';
import { BackendCreateModal } from '../../modals';
import { Icon } from '../../icon';
import { useIsMobile } from '../../hooks';
import { radius, sizes } from '../../config';

type PageHeadingProps = FlexProps & {
	title: string;
	button?: string;
	href?: string;
	isModal?: boolean;
	path: string;
	data?: any;
	export?: boolean;
	table: any;
	isLoading?: boolean;
};

const ServerPageHeading: React.FC<PageHeadingProps> = ({
	title,
	href,
	button,
	isModal = false,
	path,
	table,
	data,
	isLoading = false,
	export: exportData,
	...props
}) => {
	const isMobile = useIsMobile();
	const btn = (
		<Button size='sm'>
			<Icon
				size={18}
				name='add'
			/>
			{!isMobile && button}
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
				{isLoading ? (
					// One bar the size of the <Heading> it stands in for. This was a
					// `SkeletonText noOfLines={3}`, where `h` applies per line — so a
					// single 30px title loaded in behind a 300x144 slab.
					<Skeleton
						w='140px'
						h={HEADING_HEIGHT}
						borderRadius='full'
					/>
				) : (
					<Heading {...headingCss}>{title}</Heading>
				)}

				{isLoading ? (
					<Skeleton
						w='124px'
						h={sizes.CONTROL_HEIGHT}
						borderRadius={radius.BUTTON}
					/>
				) : (
					<Flex {...buttonGroupCss}>
						<>{Boolean(exportData) && exportButton}</>
						<>{(Boolean(button) || isModal) && renderButton()}</>
					</Flex>
				)}
			</Flex>
			{(table?.subTitle || table?.guideHref) && (
				<Flex
					align='center'
					gap={2}
					wrap='wrap'>
					{table?.subTitle && <Text {...subHeadingCss}>{table?.subTitle}</Text>}
					{table?.guideHref && (
						<Link href={table.guideHref}>
							<Text
								{...subHeadingCss}
								color='accent.fg'
								textDecoration='underline'>
								{table?.guideLabel || 'View the guide'}
							</Text>
						</Link>
					)}
				</Flex>
			)}
		</Flex>
	);
};

// `headingCss` is 1.375rem/1.5rem at lineHeight 1.25, so the rendered <h2> box
// is 27.5px on mobile and 30px from md up.
const HEADING_HEIGHT = { base: '28px', md: '30px' };

export default ServerPageHeading;
