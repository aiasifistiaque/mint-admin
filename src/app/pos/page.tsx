import React from 'react';
import { SideDrawer, PosLayout as Layout, Column } from '@/components/library';
import { Grid, Flex, GridItem } from '@chakra-ui/react';
import PosFilters from '@/components/pos/PosFilters';
import PosSearch from '@/components/pos/PosSearch';
import PosCart from '@/components/pos/PosCart';
import PorductListPos from '@/components/pos/PorductListPos';

const page = () => {
	return (
		<>
			{/* <SideDrawer />; */}
			<Layout
				path='pos'
				title='POS'>
				<Grid gridTemplateColumns={'8fr 2fr'}>
					<Column>
						<Flex
							px={4}
							justify='space-between'
							gap={2}
							align='center'>
							<PosSearch />

							<PosFilters
								path='categories'
								filter='category'
							/>
							<PosFilters
								path='brands'
								filter='brand'
							/>
						</Flex>
						<PorductListPos />
					</Column>
					{/* {/* <GridItem> */}
					<PosCart />
					{/* </GridItem> */}
				</Grid>
			</Layout>
		</>
	);
};

export default page;
