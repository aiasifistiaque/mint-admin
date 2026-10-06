'use client';

import { FC } from 'react';
import { Link } from '@chakra-ui/react';
import { CircleHelp } from 'lucide-react';
import { DOCS_URL } from '@/components/library/config/lib/constants/panel';

/** "?" on every panel and dialog of the editor: its section of the site builder guide (docs.mintapp.shop/site-builder). */
const SiteGuide: FC<{ section: string; label?: string }> = ({ section, label }) => (
	<Link
		href={`${DOCS_URL}/site-builder#${section}`}
		target='_blank'
		rel='noreferrer'
		aria-label={label || 'How this works'}
		title={label || 'How this works'}
		fontSize='12px'
		color='fg.muted'
		display='inline-flex'
		alignItems='center'
		gap={1}
		_hover={{ color: 'fg' }}>
		<CircleHelp size={14} />
		{label}
	</Link>
);

export default SiteGuide;
