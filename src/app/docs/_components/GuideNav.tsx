'use client';

import { FC, useEffect, useMemo, useState } from 'react';
import { Box, Flex, Link, Text } from '@chakra-ui/react';

type Item = { id: string; title: string };
type Group = { group: string; items: Item[] };

/** Where the list sticks: below the admin's fixed navbar (56px) and a little air. */
export const GUIDE_NAV_TOP = 'calc(56px + 16px)';

/**
 * A guide's "On this page" list — shared by every /docs guide. It stays in
 * place while the page scrolls (sticky, just under the navbar), scrolls on
 * its own when it's taller than the screen, and marks the section being read.
 *
 * Pass `sections` for one list, or `groups` for headed lists (the component
 * library).
 */
const GuideNav: FC<{ sections?: Item[]; groups?: Group[]; title?: string }> = ({ sections, groups, title = 'On this page' }) => {
	const lists: Group[] = useMemo(() => groups || [{ group: title, items: sections || [] }], [groups, sections, title]);
	const ids = useMemo(() => lists.flatMap(g => g.items.map(i => i.id)), [lists]);
	const [active, setActive] = useState(ids[0] || '');

	// The section being read: the last one whose heading has passed a line a
	// little below the navbar. At the very bottom, the last section.
	useEffect(() => {
		let frame = 0;
		const update = () => {
			frame = 0;
			const line = 140;
			let current = ids[0] || '';
			for (const id of ids) {
				const el = document.getElementById(id);
				if (el && el.getBoundingClientRect().top <= line) current = id;
			}
			const doc = document.scrollingElement || document.documentElement;
			if (doc.scrollTop + window.innerHeight >= doc.scrollHeight - 4) current = ids[ids.length - 1] || current;
			setActive(current);
		};
		const onScroll = () => {
			// A hidden tab runs no animation frames; update at once there.
			if (document.visibilityState === 'hidden') return update();
			if (!frame) frame = requestAnimationFrame(update);
		};
		update();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('hashchange', update);
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('hashchange', update);
			if (frame) cancelAnimationFrame(frame);
		};
	}, [ids]);

	return (
		<Box
			as='nav'
			aria-label={title}
			display={{ base: 'none', lg: 'block' }}
			position='sticky'
			top={GUIDE_NAV_TOP}
			// A grid item stretched to the row's full height has nowhere to stick.
			alignSelf='start'
			maxH={`calc(100vh - ${GUIDE_NAV_TOP} - 16px)`}
			overflowY='auto'
			pr={2}
			css={{ scrollbarWidth: 'thin' }}>
			{lists.map(g => (
				<Box
					key={g.group}
					mb={groups ? 6 : 0}>
					<Text
						fontSize='11px'
						fontWeight='500'
						letterSpacing='0.04em'
						textTransform='uppercase'
						color='fg.muted'
						mb={2}>
						{g.group}
					</Text>
					<Flex
						direction='column'
						gap={0.5}
						borderLeftWidth='1px'
						borderColor='border.muted'>
						{g.items.map(s => {
							const on = s.id === active;
							return (
								<Link
									key={s.id}
									href={`#${s.id}`}
									aria-current={on ? 'location' : undefined}
									fontSize='sm'
									lineHeight='1.4'
									py={1}
									pl={3}
									ml='-1px'
									borderLeftWidth='2px'
									borderColor={on ? 'fg' : 'transparent'}
									color={on ? 'fg' : 'fg.muted'}
									fontWeight={on ? '500' : '400'}
									transition='color 120ms, border-color 120ms'
									_hover={{ color: 'fg', textDecoration: 'none' }}>
									{s.title}
								</Link>
							);
						})}
					</Flex>
				</Box>
			))}
		</Box>
	);
};

export default GuideNav;
