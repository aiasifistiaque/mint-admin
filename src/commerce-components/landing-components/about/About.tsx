import { Column, SubHeading, Title, Button, sizes } from '../..';
import { Grid, Image, Box } from '@chakra-ui/react';
import React from 'react';

const SRC =
	'https://images.pexels.com/photos/179909/pexels-photo-179909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

const About = () => {
	return (
		<Grid
			py={16}
			gap={16}
			w='full'
			gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}>
			<Image
				w='full'
				borderRadius={sizes.RADIUS}
				h={{ base: '40vh', md: '70vh' }}
				objectFit='cover'
				src={SRC}
				alt='About Us Image'
			/>
			<Column
				flex={1}
				justify='center'
				px={{ base: 4, md: 0 }}
				gap={{ base: 8, md: 12 }}
				textAlign={{ base: 'center', md: 'left' }}>
				<Title type='h3'>Transform Your Workout Experience</Title>
				<SubHeading fontSize='1.1rem'>
					At Mint Fashion, we specialize in blending style with sustainability. Our unique designs
					are crafted from premium, eco-friendly materials, ensuring comfort and quality. We focus
					on timeless fashion that reflects your individuality, making every piece a statement of
					personal expression and environmental consciousness.
				</SubHeading>
				<Box>
					<Button variant='primary'>Shop Now</Button>
				</Box>
			</Column>
		</Grid>
	);
};

export default About;
