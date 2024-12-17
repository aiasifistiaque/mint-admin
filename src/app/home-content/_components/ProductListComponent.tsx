import React, { FC, ReactNode } from 'react';
import { Heading, Text, Flex } from '@chakra-ui/react';
import {
	Column,
	Button,
	AddProductListModal,
	SpaceBetween,
	DeleteProductListModal,
	EditProductListModal,
	ViewProductContainer,
	sortDataByPriority,
} from '@/components/library';
import { HomeContentProps, CollectionDetails } from '.';

const ProductListComponent: FC<HomeContentProps> = ({ dataModel, content }) => {
	const productList = sortDataByPriority(content?.productList);

	const editButton = (
		<Button
			size='sm'
			colorScheme='gray'>
			Edit
		</Button>
	);

	const deleteButton = (
		<Button
			size='sm'
			colorScheme='red'>
			Delete
		</Button>
	);

	return (
		<ViewProductContainer
			title='Product List'
			path='nexa'
			edit={false}
			data={content?.productList}
			dataModel={dataModel}>
			{productList?.length <= 0 && <Text>No product list found</Text>}
			<Column gap={4}>
				{productList?.map((item: any, i: number) => (
					<Container key={i}>
						<HeadingContainer>
							<Column>
								<Heading>{item.title}</Heading>
								<Text>{item.subTitle}</Text>
							</Column>
							<Flex gap={2}>
								<EditProductListModal
									id={item?._id}
									dataModel={dataModel}
									data={{ ...item }}>
									{editButton}
								</EditProductListModal>

								<DeleteProductListModal
									id={item?._id}
									title={item?.title}>
									{deleteButton}
								</DeleteProductListModal>
							</Flex>
						</HeadingContainer>

						<CollectionDetails
							id={item?.id}
							type={item.type}
						/>
					</Container>
				))}
			</Column>

			<AddProductListModal dataModel={dataModel}>
				<Button size='sm'>Add Product</Button>
			</AddProductListModal>
		</ViewProductContainer>
	);
};

const Container = ({ children }: { children: ReactNode }) => (
	<Column
		p={4}
		borderRadius='lg'
		border='1px dashed'>
		{children}
	</Column>
);

const HeadingContainer = ({ children }: { children: ReactNode }) => (
	<SpaceBetween
		w='full'
		borderBottom='1px dashed'
		py={4}>
		{children}
	</SpaceBetween>
);

export default ProductListComponent;
