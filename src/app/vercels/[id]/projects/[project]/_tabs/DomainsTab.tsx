'use client';

import { useState } from 'react';
import { Badge, Button, Flex, IconButton, Input, Menu, Portal, Text } from '@chakra-ui/react';
import { MoreHorizontal } from 'lucide-react';
import {
	Toast,
	radius,
	useGetVercelDomainsQuery,
	useAddVercelDomainMutation,
	useVerifyVercelDomainMutation,
	useRemoveVercelDomainMutation,
} from '@/components/library';
import {
	Panel,
	StatusDot,
	DataTable,
	ConfirmAction,
	CopyValue,
	EmptyState,
	ErrorState,
	TableSkeleton,
	Column,
} from '@/components/library/cl';

type Props = {
	id: string;
	projectRef: string;
	projectName: string;
	team: string;
	storefront?: any;
};

const DomainsTab = ({ id, projectRef, projectName, team, storefront }: Props) => {
	const [name, setName] = useState('');
	const [removing, setRemoving] = useState<any>(null);

	const { data, isFetching, isError, error, refetch } = useGetVercelDomainsQuery({
		id,
		project: projectRef,
		team,
	});

	const [add, addResult] = useAddVercelDomainMutation();
	const [verify, verifyResult] = useVerifyVercelDomainMutation();
	const [remove, removeResult] = useRemoveVercelDomainMutation();

	const domains = data?.domains || [];
	const unverified = domains.filter((d: any) => !d.verified);

	const columns: Column<any>[] = [
		{
			key: 'name',
			label: 'Domain',
			render: row => (
				<Text
					fontSize='13px'
					fontFamily='mono'>
					{row.name}
				</Text>
			),
		},
		{
			key: 'status',
			label: 'Status',
			width: '150px',
			render: row => (
				<StatusDot
					tone={row.verified ? 'running' : 'pending'}
					label={row.verified ? 'verified' : 'unverified'}
				/>
			),
		},
		{
			key: 'redirect',
			label: 'Redirect',
			render: row => (
				<Text
					fontSize='13px'
					color='fg.muted'>
					{row.redirect || '—'}
				</Text>
			),
		},
		{
			key: 'branch',
			label: 'Branch',
			width: '140px',
			render: row => (
				<Text
					fontSize='13px'
					color='fg.muted'>
					{row.gitBranch || 'production'}
				</Text>
			),
		},
	];

	return (
		<Flex
			direction='column'
			gap={4}>
			<Panel title='Add a domain'>
				<Flex
					gap={2}
					align='center'
					flexWrap='wrap'>
					<Input
						size='sm'
						width='280px'
						fontFamily='mono'
						borderRadius={radius.INPUT}
						placeholder='shop.example.com'
						value={name}
						onChange={event => setName(event.target.value.trim().toLowerCase())}
					/>
					<Button
						size='sm'
						loading={addResult.isLoading}
						disabled={!name}
						onClick={async () => {
							await add({ id, project: projectRef, name, team });
							setName('');
						}}>
						Add
					</Button>
				</Flex>
			</Panel>

			{/* The records to create are the only reason anyone opens this tab on
				an unverified domain, so they are on screen rather than behind a
				click. */}
			{unverified.map((domain: any) => (
				<Panel
					key={domain.name}
					title={`${domain.name} needs a DNS record`}
					subtitle='Create this at your DNS provider, then verify. Propagation can take a while.'
					actions={
						<Button
							size='xs'
							variant='outline'
							loading={verifyResult.isLoading}
							onClick={() => verify({ id, project: projectRef, domain: domain.name, team })}>
							Verify
						</Button>
					}>
					<Flex
						direction='column'
						gap={2}>
						{(domain.verification || []).map((record: any, index: number) => (
							<Flex
								key={index}
								direction='column'
								gap={1}>
								<Text
									fontSize='xs'
									color='fg.muted'>
									{record.type} record on {record.domain}
								</Text>
								<CopyValue value={record.value} />
							</Flex>
						))}

						{!domain.verification?.length && (
							<Text
								fontSize='13px'
								color='fg.muted'>
								{domain.config?.misconfigured === false
									? 'DNS looks correct. Try verifying again.'
									: 'Point this domain at Vercel with an A record to 76.76.21.21, or a CNAME to cname.vercel-dns.com.'}
							</Text>
						)}
					</Flex>
				</Panel>
			))}

			<Panel
				title='Domains'
				flush>
				{isFetching && !domains.length ? (
					<TableSkeleton rows={3} />
				) : isError ? (
					<ErrorState
						error={error}
						onRetry={refetch}
					/>
				) : !domains.length ? (
					<EmptyState
						title='No domains'
						description='This project is reachable at its .vercel.app address only.'
					/>
				) : (
					<DataTable<any>
						columns={columns}
						rows={domains}
						rowKey={row => row.name}
						rowActions={row => (
							<Menu.Root>
								<Menu.Trigger asChild>
									<IconButton
										size='xs'
										variant='ghost'
										aria-label='Actions'>
										<MoreHorizontal size={15} />
									</IconButton>
								</Menu.Trigger>
								<Portal>
									<Menu.Positioner>
										<Menu.Content>
											{!row.verified && (
												<Menu.Item
													value='verify'
													onClick={() =>
														verify({ id, project: projectRef, domain: row.name, team })
													}>
													Verify
												</Menu.Item>
											)}
											<Menu.Item
												value='remove'
												color='fg.error'
												onClick={() => setRemoving(row)}>
												Remove
											</Menu.Item>
										</Menu.Content>
									</Menu.Positioner>
								</Portal>
							</Menu.Root>
						)}
					/>
				)}
			</Panel>

			<ConfirmAction
				isOpen={!!removing}
				onClose={() => setRemoving(null)}
				onConfirm={async () => {
					await remove({
						id,
						project: projectRef,
						domain: removing.name,
						team,
						...(storefront ? { confirm: projectName } : {}),
					});
					setRemoving(null);
				}}
				title='Remove this domain'
				consequence={
					storefront
						? `${removing?.name} stops serving ${storefront.shopName}. Anyone with that address bookmarked gets an error until it is added back.`
						: `${removing?.name} stops resolving to this project immediately.`
				}
				confirmLabel='Remove'
				destructive
				isLoading={removeResult.isLoading}
				typeToConfirm={storefront ? projectName : undefined}
			/>

			<Toast
				isError={addResult.isError || verifyResult.isError || removeResult.isError}
				error={addResult.error || verifyResult.error || removeResult.error}
			/>
			<Toast
				isSuccess={verifyResult.isSuccess}
				successTitle='Checked'
				successText={verifyResult.data?.message}
			/>
		</Flex>
	);
};

export default DomainsTab;
