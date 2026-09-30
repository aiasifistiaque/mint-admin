'use client';

import { FC, ReactNode } from 'react';
import { Box, chakra, Collapsible, Flex, Skeleton, Text } from '@chakra-ui/react';
import { ChevronDown } from 'lucide-react';
import { LucideIcon } from '../../../icon';
import { ICON_GAP_PX, ICON_SIZE_PX, RAIL_GAP_PX, RAIL_X_PX, ROW_INSET_PX } from '../SidebarItem';

type SidebarSectionProps = {
	title: string;
	icon?: string;
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
 * The heading reads as the parent row of a tree: an outline icon, the name in
 * title case at the link size, and a chevron that points right when folded
 * and down when open. Its links hang off a thin rail from the icon's centre,
 * their labels level with the heading's. Sections are open by default —
 * collapsing is opt-in, so nothing a user relies on disappears on first load.
 */
const SidebarSection: FC<SidebarSectionProps> = ({
	title,
	icon,
	isOpen,
	onToggle,
	isLoading = false,
	hasActive = false,
	children,
}) => (
	<Collapsible.Root open={isOpen}>
		<Skeleton
			loading={isLoading}
			h='34px'
			borderRadius='8px'>
			<chakra.button
				type='button'
				onClick={onToggle}
				aria-expanded={isOpen}
				// Lets the chevron react to a hover anywhere on the row.
				role='group'
				display='flex'
				w='full'
				h='34px'
				alignItems='center'
				justifyContent='space-between'
				gap={2}
				pl={`${ROW_INSET_PX}px`}
				pr={2}
				cursor='pointer'
				borderRadius='8px'
				transition='background-color .12s ease'
				_hover={{ bg: 'sidebar.itemHover.light' }}
				_dark={{ _hover: { bg: 'sidebar.itemHover.dark' } }}>
				<Flex
					align='center'
					gap={`${ICON_GAP_PX}px`}
					minW={0}
					flex='1'
					overflow='hidden'>
					<Box
						flexShrink={0}
						display='flex'
						boxSize={`${ICON_SIZE_PX}px`}
						color='sidebar.bodyText.light'
						_dark={{ color: 'sidebar.bodyText.dark' }}
						opacity={0.85}>
						{icon ? (
							// `currentColor`: the glyph takes the muted colour above
							// rather than LucideIcon's own hardcoded one.
							<LucideIcon
								name={icon}
								size={ICON_SIZE_PX}
								color='currentColor'
							/>
						) : null}
					</Box>
					<Text
						color='sidebar.bodyText.headingLight'
						_dark={{ color: 'sidebar.bodyText.headingDark' }}
						fontSize={{ base: '15px', md: '14px' }}
						fontWeight='500'
						lineHeight='1.3'
						lineClamp={1}
						textAlign='left'>
						{title}
					</Text>
				</Flex>

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
						boxSize='16px'
						strokeWidth={1.75}
						color='sidebar.bodyText.light'
						_dark={{ color: 'sidebar.bodyText.dark' }}
						opacity={0.6}
						_groupHover={{ opacity: 1 }}
						transform={isOpen ? 'rotate(0deg)' : 'rotate(-90deg)'}
						transition='transform .18s ease, opacity .15s ease'
					/>
				</Flex>
			</chakra.button>
		</Skeleton>

		<Collapsible.Content>
			{/* The rail, from under the heading icon's centre down the group. */}
			<Box
				display='flex'
				flexDirection='column'
				gap='2px'
				mt='2px'
				mb={1}
				ml={`${RAIL_X_PX}px`}
				pl={`${RAIL_GAP_PX}px`}
				borderLeftWidth='1px'
				borderColor='sidebar.rail.light'
				_dark={{ borderColor: 'sidebar.rail.dark' }}>
				{children}
			</Box>
		</Collapsible.Content>
	</Collapsible.Root>
);

export default SidebarSection;
