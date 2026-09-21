'use client';

import { FC, ReactNode } from 'react';
import { Box, chakra, Collapsible, Flex, Skeleton, Text } from '@chakra-ui/react';
import { ChevronDown } from 'lucide-react';
import { LucideIcon } from '../../../icon';

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
			// No right inset: this wraps the header button, so padding here
			// shortened the row and held the chevron away from the edge.
			pr={0}
			// Categories sit close together; the breathing room that matters is
			// between a heading and the rows it owns, not between one group and
			// the next — that gap was pushing the list well past the fold.
			mt={2.5}
			h='20px'
			borderRadius='90px'>
			<chakra.button
				type='button'
				onClick={onToggle}
				aria-expanded={isOpen}
				// Lets the chevron react to a hover anywhere on the row.
				role='group'
				display='flex'
				w='full'
				alignItems='center'
				justifyContent='space-between'
				gap={1}
				pl='2px'
				// Flush right, so the chevron lands on the same edge the item rows
				// end at instead of floating 16px short of it.
				pr={0}
				py={1.5}
				cursor='pointer'
				borderRadius='md'>
				<Flex
					align='center'
					gap={1}
					minW={0}
					flex='1'
					overflow='hidden'>
					{icon ? (
						// LucideIcon otherwise uses its own hardcoded colours (#4a4a4a
						// light, pure white dark) — in dark mode that put a bright white
						// glyph beside a grey label, so the icon shouted over the name it
						// belongs to. `currentColor` ties it to the heading in both modes.
						<Box
							flexShrink={0}
							display='flex'
							color='sidebar.bodyText.headingLight'
							_dark={{ color: 'sidebar.bodyText.headingDark' }}>
							<LucideIcon
								name={icon}
								size={16}
								color='currentColor'
							/>
						</Box>
					) : null}
					<Text
						color='sidebar.bodyText.headingLight'
						_dark={{ color: 'sidebar.bodyText.headingDark' }}
						fontSize={{ base: 'md', md: 'xs' }}
						fontWeight='700'
						textTransform='uppercase'
						// No tracking. Caps would read better with a little, but at 12px
						// the longest names already fill the 230px column, and even 0.03em
						// pushed "PROJECT MANAGEMENT" onto a second line, where `lineClamp`
						// silently cut it to "PROJECT…". A whole name beats nicer spacing.
						letterSpacing='normal'
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
						boxSize='14px'
						color='sidebar.bodyText.headingLight'
						_dark={{ color: 'sidebar.bodyText.headingDark' }}
						// A control, not content: it recedes so the eye runs down the
						// category names uninterrupted, and comes up on hover.
						opacity={0.45}
						_groupHover={{ opacity: 1 }}
						transform={isOpen ? 'rotate(0deg)' : 'rotate(-90deg)'}
						transition='transform .18s ease, opacity .15s ease'
					/>
				</Flex>
			</chakra.button>
		</Skeleton>

		<Collapsible.Content>
			{/* The rail. It starts under the category's icon and runs the full
			    height of the group, so an expanded section reads as one branch
			    rather than as loose rows. `ml` lines it up with the centre of the
			    14px icon above; `pl` sets the gap between it and the labels. */}
			<Box
				// The heading needs air under it before the branch begins —
				// without it the rail looked welded to the category name.
				mt={2}
				mb={2}
				// Matched, so the rail extends the same distance past the first row
				// as it does past the last. `pt` was absent, which made it start
				// flush with the first label but overhang the last by 4px.
				pt={1}
				pb={1}
				ml={RAIL_INSET}
				pl={RAIL_GAP}
				borderLeftWidth='1px'
				borderColor='sidebar.rail.light'
				_dark={{ borderColor: 'sidebar.rail.dark' }}>
				{children}
			</Box>
		</Collapsible.Content>
	</Collapsible.Root>
);

// Half the icon box, so the rail hangs from the middle of the category glyph.
// Track this with the LucideIcon size above — they drifted apart once already.
const RAIL_INSET = '8px';
// The rail is a grouping cue, not a margin — held close so the labels still
// read as one column rather than as a list indented away from its own line.
const RAIL_GAP = 1;

export default SidebarSection;
