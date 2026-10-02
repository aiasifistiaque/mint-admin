'use client';

import { FC } from 'react';
import { Link } from '@chakra-ui/react';
import { ExternalLink } from 'lucide-react';

/**
 * "How this works ↗" on the tenant panel's own pages — a section of the user
 * guides (/user-docs), in a new tab so it reads beside the page. `section` is
 * the anchor; which guide it's in is looked up here. Rename an anchor in its
 * guide and here together.
 */
const GUIDE_OF: Record<string, string> = {
	organizations: 'organization',
	members: 'organization',
	invitations: 'organization',
	roles: 'organization',
	ownership: 'organization',
	switching: 'organization',
	invited: 'organization',
	'project-access': 'organization',
	projects: 'projects',
	'media-library': 'projects',
	'public-api': 'public-api',
	customers: 'customers',
	widget: 'customers',
	websites: 'websites',
	analytics: 'analytics',
	'connect-ai': 'connect-ai',
};

const GuideLink: FC<{ section: string; label?: string }> = ({ section, label = 'How this works' }) => (
	<Link
		href={`/user-docs/${GUIDE_OF[section] || ''}#${section}`}
		target='_blank'
		rel='noreferrer'
		fontSize='12px'
		color='fg.muted'
		display='inline-flex'
		alignItems='center'
		gap={1}
		whiteSpace='nowrap'
		_hover={{ color: 'fg' }}>
		{label}
		<ExternalLink size={11} />
	</Link>
);

export default GuideLink;
