import { FC } from 'react';
import { Breadcrumb } from '@chakra-ui/react';
import Link from 'next/link';

type BreadcrumbsProps = {
	data: {
		href: string;
		title: string;
	}[];
};

const Breadcrumbs: FC<BreadcrumbsProps> = ({ data }) => {
	return (
		<Breadcrumb.Root>
			<Breadcrumb.List>
				{data?.map((item: any, i: number) => (
					<>
						<Breadcrumb.Item
							{...crumbCss}
							key={i}
							isCurrentPage={i === data.length - 1}>
							<Link href={item?.href}>{item?.title}</Link>
						</Breadcrumb.Item>
						{data?.length - 1 !== i && (
							<Breadcrumb.Separator
								color='heading.lightMuted'
								_dark={{ color: 'heading.darkMuted' }}>
								/
							</Breadcrumb.Separator>
						)}
					</>
				))}
			</Breadcrumb.List>
		</Breadcrumb.Root>
	);
};

const crumbCss: any = {
	fontSize: '14px',
	fontWeight: '400',
	color: 'heading.lightMuted',
	_dark: {
		color: 'heading.darkMuted',
	},
	textTransform: 'capitalize',
	_last: { fontWeight: '500' },
};

export default Breadcrumbs;
