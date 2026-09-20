'use client';

import { FC, ReactNode } from 'react';
import { Box, chakra, Collapsible, Flex, Skeleton, Text } from '@chakra-ui/react';
import { ChevronDown } from 'lucide-react';

type SidebarSectionProps = {
	title: string;
	isOpen: boolean;
	onToggle: () => void;
	isLoading?: boolean;
	/** Shows a dot when the section is collapsed but holds the active page. */
	hasActive?: boolean;
	children: ReactNode;
};

/**
 * A collapsible group of sidebar links.
 *
 * The heading used to be a plain label (SidebarHeading); with the CRM's many
 * categories the sidebar scrolls well past the fold, so each group now folds
 * away. Sections are open by default — collapsing is opt-in, so nothing a user
 * relies on disappears on first load.
 *
 * Colours follow SidebarHeading: explicit light values with a `_dark`
 * override, matching the rest of the sidebar.
 */
const SidebarSection: FC<SidebarSectionProps> = ({
	title,
	isOpen,
	onToggle,
	isLoading = false,
	hasActive = false,
	children,
}) => (
	<Collapsible.Root open={isOpen}>
		<Skeleton
			loading={isLoading}
			pr={2}
			mt={4}
			h='20px'
			borderRadius='90px'>
			<chakra.button
				type='button'
				onClick={onToggle}
				aria-expanded={isOpen}
				display='flex'
				w='full'
				alignItems='center'
				justifyContent='space-between'
				gap={2}
				pr={2}
				py={2}
				cursor='pointer'
				borderRadius='md'>
				<Text
					color='sidebar.bodyText.headingLight'
					_dark={{ color: 'sidebar.bodyText.headingDark' }}
					fontSize={{ base: 'md', md: '2xs' }}
					fontWeight='700'
					textTransform='uppercase'
					lineClamp={1}
					textAlign='left'>
					{title}
				</Text>

				<Flex
					align='center'
					gap={1.5}
					flexShrink={0}>
					{/* A dot when the current page is inside a collapsed group, so the
					    sidebar still says where you are. */}
					{!isOpen && hasActive ? (
						<Box
							w='5px'
							h='5px'
							borderRadius='full'
							bg='sidebar.bodyText.selectedLight'
							_dark={{ bg: 'sidebar.bodyText.selectedDark' }}
						/>
					) : null}

					<Box
						as={ChevronDown}
						boxSize='13px'
						color='sidebar.bodyText.headingLight'
						_dark={{ color: 'sidebar.bodyText.headingDark' }}
						transform={isOpen ? 'rotate(0deg)' : 'rotate(-90deg)'}
						transition='transform .18s ease'
					/>
				</Flex>
			</chakra.button>
		</Skeleton>

		<Collapsible.Content>
			<Box pt={2}>{children}</Box>
		</Collapsible.Content>
	</Collapsible.Root>
);

export default SidebarSection;
