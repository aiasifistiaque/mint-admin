'use client';

import { FC } from 'react';
import { Link } from '@chakra-ui/react';
import { ExternalLink } from 'lucide-react';

/**
 * "How this works ↗" — a section of the Organizations & projects guide
 * (/docs/tenancy), in a new tab so it reads beside the page. Section ids are
 * the guide's SECTIONS; rename one there too.
 */
const GuideLink: FC<{ section: string; label?: string }> = ({ section, label = 'How this works' }) => (
	<Link
		href={`/docs/tenancy#${section}`}
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
