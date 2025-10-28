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
			{data?.map((item: any, i: number) => (
				<Breadcrumb.Item
					{...crumbCss}
					key={i}
					isCurrentPage={i === data.length - 1}>
					<Link href={item?.href}>{item?.title}</Link>
				</Breadcrumb.Item>
			))}
		</Breadcrumb.Root>
	);
};

const crumbCss: any = {
	fontSize: '14px',
	fontWeight: '400',
	textTransform: 'capitalize',
	_last: { fontWeight: '500' },
};

export default Breadcrumbs;
