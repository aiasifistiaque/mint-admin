'use client';

import { Center, Spinner } from '@chakra-ui/react';
import { Layout } from '@/components/library';
import { EmptyState } from '@/components/library/cl';
import { useWorkspace } from '@/components/library/tenant';
import { useSiteBuilderManifestQuery } from '@/components/library/store/services/siteBuilderApi';
import SiteBuilder from './_components/SiteBuilder';

/**
 * The site builder (tenant panel, website projects; backend docs/site-builder
 * SB-05): /<project>/site-builder. The panel deploys before the backend, so a
 * backend without the builder (its manifest 404s) gets a plain message here.
 */
export default function SiteBuilderPage() {
	const { project, can, isLoading } = useWorkspace();
	const isWebsite = project?.type === 'website';
	const manifest = useSiteBuilderManifestQuery(undefined, { skip: !isWebsite });
	const status = (manifest.error as any)?.status;

	let body: React.ReactNode;
	if (isLoading || (isWebsite && manifest.isLoading))
		body = (
			<Center h='full'>
				<Spinner size='sm' />
			</Center>
		);
	else if (!isWebsite)
		body = (
			<EmptyState
				title='Only website projects have a site builder'
				description='Start a website project to build a site visually.'
			/>
		);
	else if (status === 404)
		body = (
			<EmptyState
				title='The site builder needs the latest backend'
				description='This panel is newer than the server it talks to. It will work once the backend is updated.'
			/>
		);
	else if (status === 403)
		body = (
			<EmptyState
				title='Your role can’t open the site builder'
				description='Ask someone who builds the project.'
			/>
		);
	else if (manifest.error)
		body = (
			<EmptyState
				title='The site builder didn’t load'
				description='Check your connection and reload the page.'
			/>
		);
	else body = <SiteBuilder readOnly={!can('build')} />;

	return (
		<Layout
			title='Site builder'
			path='site-builder'
			fullBleed>
			{body}
		</Layout>
	);
}
