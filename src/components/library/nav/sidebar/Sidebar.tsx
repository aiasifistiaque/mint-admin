'use client';
import { FlexProps, Heading, Stack } from '@chakra-ui/react';
import { ReactNode, FC, useCallback, useEffect, useMemo, useState } from 'react';
import SidebarItem from './SidebarItem';

import { sidebarData as sidebar, useGetQuery, useGetSelfQuery, useAppSelector } from '../..';

import { SidebarBody, SidebarContainer, SidebarLogo, SidebarSection } from './sidebar-components';
import Link from 'next/link';

const COLLAPSED_KEY = 'emint_sidebar_collapsed';

type NavItem = {
	href: string;
	path: string;
	icon: any;
	title: string;
	sectionTitle?: string;
	startOfSection?: boolean;
};

type Section = { title: string; items: NavItem[] };

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
			sections.push({ title: item.sectionTitle, items: [item] });
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
					{lead.length ? <Stack gap={0.5}>{lead.map(renderItem)}</Stack> : null}

					{sections.map(section => {
						const active = isActive(section);
						// The section holding the current page always renders open, so the
						// sidebar can never hide where you actually are.
						const open = active || !collapsed[section.title];

						return (
							<SidebarSection
								key={section.title}
								title={section.title}
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
				</SidebarBody>
			</SidebarContainer>
		</>
	);
};

export default Sidebar;
