'use client';
import { FlexProps, Heading, Stack, Text } from '@chakra-ui/react';
import { ReactNode, FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SidebarItem from './SidebarItem';

import { sidebarData as sidebar, useGetQuery, useGetSelfQuery, useAppSelector } from '../..';

import {
	SidebarBody,
	SidebarContainer,
	SidebarLogo,
	SidebarSearch,
	SidebarSection,
} from './sidebar-components';
import Link from 'next/link';

const COLLAPSED_KEY = 'emint_sidebar_collapsed';

type NavItem = {
	href: string;
	path: string;
	icon: any;
	title: string;
	sectionTitle?: string;
	sectionIcon?: string;
	startOfSection?: boolean;
};

type Section = { title: string; icon?: string; items: NavItem[] };

/**
 * Turns the flat link list into sections.
 *
 * `/sidebar/crm/:type` returns one array with `startOfSection` marking where a
 * new category begins, so grouping happens here rather than in the payload.
 * Links before the first marker (Dashboard) keep rendering ungrouped at the top.
 */
const toSections = (items: NavItem[]): { lead: NavItem[]; sections: Section[] } => {
	const lead: NavItem[] = [];
	const sections: Section[] = [];

	for (const item of items) {
		if (item?.startOfSection && item?.sectionTitle) {
			sections.push({ title: item.sectionTitle, icon: item.sectionIcon, items: [item] });
			continue;
		}

		if (sections.length) sections[sections.length - 1].items.push(item);
		else lead.push(item);
	}

	return { lead, sections };
};

const Sidebar: FC<FlexProps & { closeBtn?: ReactNode }> = ({ closeBtn, ...props }) => {
	const sidebarType = process.env.NEXT_PUBLIC_SIDEBAR_TYPE || 'generic';

	const { data } = useGetSelfQuery({});
	const { data: sidebarData, isFetching } = useGetQuery({ path: `/sidebar/crm/${sidebarType}` });

	const { selected } = useAppSelector((state: any) => state.route);

	const title = data?.shop?.name || process.env.NEXT_PUBLIC_STORE_NAME || 'Admin';

	const isLoading = isFetching || !sidebarData;
	const source: NavItem[] = isLoading ? (sidebar as any) : sidebarData;

	const { lead, sections } = useMemo(() => toSections(source ?? []), [source]);

	// Filters the sidebar in place — matches Vercel's project-nav search, which
	// narrows the list itself rather than opening a command palette. That's a
	// separate feature (SearchMenu, still in the navbar for a global jump).
	const [search, setSearch] = useState('');
	const searchInputRef = useRef<HTMLInputElement>(null);
	const query = search.trim().toLowerCase();
	const isSearching = query.length > 0;

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.metaKey || e.ctrlKey || e.altKey || e.key.toLowerCase() !== 'f') return;

			const target = e.target as HTMLElement | null;
			const tag = target?.tagName;
			// Don't steal the letter while the admin is typing anywhere else.
			if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;

			e.preventDefault();
			searchInputRef.current?.focus();
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	const filteredLead = useMemo(() => {
		if (!isSearching) return lead;
		return lead.filter(item => item.title?.toLowerCase().includes(query));
	}, [lead, query, isSearching]);

	const filteredSections = useMemo(() => {
		if (!isSearching) return sections;

		return sections
			.map(section => {
				// A matching category name keeps its whole list, otherwise only
				// the items that actually match survive.
				const sectionMatches = section.title.toLowerCase().includes(query);
				const items = sectionMatches
					? section.items
					: section.items.filter(item => item.title?.toLowerCase().includes(query));

				return { ...section, items };
			})
			.filter(section => section.items.length > 0);
	}, [sections, query, isSearching]);

	const hasResults = filteredLead.length > 0 || filteredSections.length > 0;

	// Only collapsed sections are stored, so a newly added category is open by
	// default rather than inheriting someone's stale "everything closed" state.
	const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

	useEffect(() => {
		try {
			const raw = window.localStorage.getItem(COLLAPSED_KEY);
			if (raw) setCollapsed(JSON.parse(raw));
		} catch {
			// A blocked or corrupt store just means everything starts open.
		}
	}, []);

	const toggle = useCallback((sectionTitle: string) => {
		setCollapsed(prev => {
			const next = { ...prev, [sectionTitle]: !prev[sectionTitle] };
			if (!next[sectionTitle]) delete next[sectionTitle];

			try {
				window.localStorage.setItem(COLLAPSED_KEY, JSON.stringify(next));
			} catch {
				// Preference is a convenience; failing to persist is not an error.
			}

			return next;
		});
	}, []);

	const isActive = useCallback(
		(section: Section) => section.items.some(item => item?.path && item.path === selected),
		[selected]
	);

	const renderItem = (item: NavItem, key: string | number) => (
		<Link
			key={key}
			href={item?.href}>
			<SidebarItem
				isLoading={isLoading}
				href={item?.href}
				path={item?.path}
				icon={item?.icon}>
				{item?.title}
			</SidebarItem>
		</Link>
	);

	return (
		<>
			<SidebarLogo>
				<Heading
					color='sidebar.headerText.light'
					_dark={{ color: 'sidebar.headerText.dark' }}
					size='lg'
					fontFamily='Bebas Neue'>
					{title}
				</Heading>
				{closeBtn && closeBtn}
			</SidebarLogo>

			<SidebarContainer {...props}>
				<SidebarBody>
					<SidebarSearch
						value={search}
						onChange={setSearch}
						inputRef={searchInputRef}
					/>

					{filteredLead.length ? <Stack gap={0.5}>{filteredLead.map(renderItem)}</Stack> : null}

					{filteredSections.map(section => {
						const active = isActive(section);
						// The section holding the current page, or one with a live match,
						// always renders open — collapsing never hides where you are or
						// what you just searched for.
						const open = isSearching || active || !collapsed[section.title];

						return (
							<SidebarSection
								key={section.title}
								title={section.title}
								icon={section.icon}
								isOpen={open}
								hasActive={active}
								isLoading={isLoading}
								onToggle={() => toggle(section.title)}>
								<Stack gap={0.5}>
									{section.items.map((item, i) => renderItem(item, `${section.title}-${i}`))}
								</Stack>
							</SidebarSection>
						);
					})}

					{isSearching && !hasResults ? (
						<Text
							mt={4}
							textAlign='center'
							fontSize='xs'
							color='sidebar.bodyText.light'
							_dark={{ color: 'sidebar.bodyText.dark' }}>
							No matches for &ldquo;{search}&rdquo;
						</Text>
					) : null}
				</SidebarBody>
			</SidebarContainer>
		</>
	);
};

export default Sidebar;
