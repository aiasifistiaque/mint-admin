'use client';

import { Flex, Text } from '@chakra-ui/react';
import { 	DetailRow,
Panel, CopyValue } from '@/components/library/cl';

const OverviewTab = ({ project, storefront }: { project: any; storefront?: any }) => (
	<Flex
		direction='column'
		gap={4}>
		{storefront && (
			<Panel title='This project is a live storefront'>
				<Text
					fontSize='13px'
					color='fg.muted'>
					It serves <strong>{storefront.shopName}</strong> and was created by the storefront
					deploy flow, not by hand. Changes here reach real customers, and deleting it from this
					console is refused — remove the storefront from the shop instead.
				</Text>
			</Panel>
		)}

		<Panel title='Project'>
			<Flex
				direction='column'
				gap={3}>
				<DetailRow
					label='Project ID'
					value={<CopyValue value={project.id} />}
				/>
				<DetailRow
					label='Framework'
					value={project.framework}
				/>
				<DetailRow
					label='Repository'
					value={
						project.gitRepo?.url ? (
							<CopyValue
								value={project.gitRepo.url}
								display={`${project.gitRepo.org}/${project.gitRepo.repo}`}
							/>
						) : undefined
					}
				/>
				<DetailRow
					label='Production branch'
					value={project.gitRepo?.productionBranch}
				/>
				<DetailRow
					label='Node version'
					value={project.nodeVersion}
				/>
				<DetailRow
					label='Root directory'
					value={project.rootDirectory || '/'}
				/>
				<DetailRow
					label='Build command'
					value={project.buildCommand || 'Framework default'}
				/>
				<DetailRow
					label='Install command'
					value={project.installCommand || 'Framework default'}
				/>
				<DetailRow
					label='Output directory'
					value={project.outputDirectory || 'Framework default'}
				/>
				<DetailRow
					label='Created'
					value={
						project.createdAt
							? new Date(project.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })
							: undefined
					}
				/>
			</Flex>
		</Panel>
	</Flex>
);

export default OverviewTab;
