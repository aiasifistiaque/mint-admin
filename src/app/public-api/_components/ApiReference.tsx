'use client';

import { FC, ReactNode, useState } from 'react';
import { Badge, Box, Button, Flex, Text } from '@chakra-ui/react';
import { ChevronDown, ChevronRight, Lock, Play } from 'lucide-react';
import { CopyValue, Panel } from '@/components/library/cl';
import GuideLink from '@/components/library/tenant/GuideLink';
import {
	AUTH_ENDPOINTS,
	ApiInfo,
	ApiModel,
	Endpoint,
	FILTERABLE,
	METHOD_TONE,
	SITE_ENDPOINTS,
	endpointsOf,
	exampleRecord,
} from './api';

/**
 * Every endpoint of the project's public API, generated from what the API
 * says it offers (so it always matches the switches above): parameters, body
 * fields, an example response, and "Try" to load it into the tester.
 */

const json = (v: any) => JSON.stringify(v, null, 2);

const Code: FC<{ children: string }> = ({ children }) => (
	<Box
		as='pre'
		m={0}
		p={3}
		fontSize='12px'
		fontFamily='mono'
		bg='bg.subtle'
		borderWidth='1px'
		borderColor='border.muted'
		borderRadius='md'
		overflowX='auto'
		whiteSpace='pre'>
		{children}
	</Box>
);

const Label: FC<{ children: ReactNode }> = ({ children }) => (
	<Text
		fontSize='11.5px'
		fontWeight='600'
		color='fg.muted'
		textTransform='uppercase'
		letterSpacing='0.04em'
		mb={1.5}>
		{children}
	</Text>
);

/** Rows of name · kind · notes. */
const Params: FC<{ rows: [string, string, string][] }> = ({ rows }) => (
	<Box
		borderWidth='1px'
		borderColor='border.muted'
		borderRadius='md'
		overflow='hidden'
		fontSize='12.5px'>
		{rows.map(([name, kind, note]) => (
			<Flex
				key={name}
				gap={3}
				px={3}
				py={1.5}
				borderTopWidth='1px'
				borderColor='border.muted'
				_first={{ borderTopWidth: 0 }}>
				<Text
					fontFamily='mono'
					minW='120px'>
					{name}
				</Text>
				<Text
					color='fg.muted'
					minW='80px'>
					{kind}
				</Text>
				<Text color='fg.muted'>{note}</Text>
			</Flex>
		))}
	</Box>
);

export const MethodBadge: FC<{ method: Endpoint['method'] }> = ({ method }) => (
	<Badge
		size='sm'
		variant='subtle'
		colorPalette={METHOD_TONE[method]}
		fontFamily='mono'
		minW='54px'
		justifyContent='center'>
		{method}
	</Badge>
);

/** What an endpoint takes and returns. */
const details = (e: Endpoint, model?: ApiModel): ReactNode => {
	const parts: ReactNode[] = [];
	if (model && e.method === 'GET' && !e.path.endsWith(':id')) {
		const filters = model.fields.filter(f => FILTERABLE.has(f.kind));
		parts.push(
			<Box key='q'>
				<Label>Query</Label>
				<Params
					rows={[
						['page', 'number', 'Page, from 1'],
						['limit', 'number', '1–100 per page (default 20)'],
						['sort', 'text', `A field, newest first with a minus: -createdAt (default)${model.fields[0] ? `, ${model.fields[0].key}` : ''}`],
						...filters.map(f => [f.key, f.kind, `Only records whose ${f.label} equals this${f.options?.length ? ` (${f.options.join(', ')})` : ''}`] as [string, string, string]),
					]}
				/>
			</Box>
		);
	}
	if (model && (e.method === 'POST' || e.method === 'PUT')) {
		parts.push(
			<Box key='b'>
				<Label>Body (JSON)</Label>
				<Params
					rows={model.fields
						.filter(f => f.kind !== 'formula')
						.map(f => [
							f.key,
							f.kind,
							[e.method === 'POST' && f.required ? 'Required' : '', f.options?.length ? `One of: ${f.options.join(', ')}` : '', f.kind === 'reference' ? 'The linked record’s _id' : '']
								.filter(Boolean)
								.join(' · ') || f.label,
						])}
				/>
				<Text
					fontSize='12px'
					color='fg.muted'
					mt={1.5}>
					Other keys are ignored. Calculated fields are worked out by the server.
				</Text>
			</Box>
		);
	}
	if (!model && e.body)
		parts.push(
			<Box key='b'>
				<Label>Body (JSON)</Label>
				<Code>{json(e.body)}</Code>
			</Box>
		);
	let response: any = null;
	if (model) {
		const record = exampleRecord(model);
		response =
			e.method === 'DELETE'
				? { message: 'Deleted' }
				: e.method === 'GET' && !e.path.endsWith(':id')
				? { doc: [record], total: 1, page: 1, limit: 20, totalPages: 1 }
				: record;
	} else if (e.path.startsWith('/auth/')) {
		const customer = { _id: '66f0c1d2e3a4b5c6d7e8f902', name: 'Ada Lovelace', email: 'ada@example.com', phone: '', createdAt: '2026-10-02T09:30:00.000Z' };
		response = e.path === '/auth/logout-everywhere' ? { message: 'Signed out everywhere' } : e.method === 'POST' ? { token: '<customer token>', customer } : customer;
	}
	if (response)
		parts.push(
			<Box key='r'>
				<Label>{e.method === 'POST' && model ? 'Response · 201' : 'Response · 200'}</Label>
				<Code>{json(response)}</Code>
			</Box>
		);
	return parts;
};

const EndpointRow: FC<{ e: Endpoint; model?: ApiModel; onTry: (e: Endpoint) => void }> = ({ e, model, onTry }) => {
	const [open, setOpen] = useState(false);
	const body = details(e, model);
	const hasDetails = Array.isArray(body) && body.length > 0;
	return (
		<Box
			borderTopWidth='1px'
			borderColor='border.muted'>
			<Flex
				align='center'
				gap={3}
				px={4}
				py={2}
				cursor={hasDetails ? 'pointer' : 'default'}
				_hover={{ bg: 'bg.subtle' }}
				onClick={() => hasDetails && setOpen(o => !o)}>
				<Box
					color='fg.muted'
					w='14px'>
					{hasDetails && (open ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
				</Box>
				<MethodBadge method={e.method} />
				<Text
					fontFamily='mono'
					fontSize='12.5px'
					truncate>
					{e.path}
				</Text>
				<Text
					fontSize='12.5px'
					color='fg.muted'
					flex={1}
					truncate
					display={{ base: 'none', md: 'block' }}>
					{e.summary}
				</Text>
				{e.customer && (
					<Flex
						align='center'
						gap={1}
						fontSize='11.5px'
						color='fg.muted'
						title='Needs a signed-in customer: Authorization: Bearer <token>'>
						<Lock size={12} />
						<Text display={{ base: 'none', sm: 'block' }}>Customer</Text>
					</Flex>
				)}
				<Button
					size='2xs'
					variant='outline'
					onClick={ev => {
						ev.stopPropagation();
						onTry(e);
					}}>
					<Play size={11} />
					Try
				</Button>
			</Flex>
			{open && (
				<Flex
					direction='column'
					gap={3}
					px={4}
					pb={4}
					pl={{ base: 4, md: '52px' }}>
					{body}
				</Flex>
			)}
		</Box>
	);
};

const Group: FC<{ title: string; note?: ReactNode; children: ReactNode }> = ({ title, note, children }) => (
	<Box
		borderTopWidth='1px'
		borderColor='border'>
		<Flex
			align='baseline'
			gap={2}
			px={4}
			pt={3.5}
			pb={2}
			wrap='wrap'>
			<Text
				fontSize='13.5px'
				fontWeight='600'>
				{title}
			</Text>
			{note && (
				<Text
					fontSize='12px'
					color='fg.muted'>
					{note}
				</Text>
			)}
		</Flex>
		{children}
	</Box>
);

const ApiReference: FC<{ base: string; info: ApiInfo | null; error?: string; onTry: (e: Endpoint) => void }> = ({ base, info, error, onTry }) => {
	const models = info?.models || [];
	const customers = models.some(m => m.auth === 'customer');
	return (
		<Panel
			title='API reference'
			subtitle='Every endpoint your site or app can call — it follows the switches above.'
			actions={<GuideLink section='reference' />}
			flush>
			<Flex
				direction='column'
				gap={3}
				p={4}>
				<Box>
					<Label>Base address</Label>
					<CopyValue value={base} />
				</Box>
				<Text
					fontSize='12.5px'
					color='fg.muted'
					lineHeight='1.6'>
					Requests and responses are JSON. An error answers with a status and <code>{'{ "message": "…" }'}</code>: 400 a value
					isn’t valid, 401 the endpoint needs a signed-in customer, 404 not found (or not public), 429 too many requests — wait a
					moment. Endpoints marked <em>Customer</em> need <code>Authorization: Bearer &lt;token&gt;</code>, the token from sign-in.
					{models.some(m => m.ownerOnly) && ' On “own records” models each customer only reaches the records they created.'}
				</Text>
			</Flex>

			{error && (
				<Text
					px={4}
					pb={4}
					fontSize='12.5px'
					color='red.fg'>
					{error}
				</Text>
			)}

			{models.map(m => (
				<Group
					key={m.route}
					title={m.title}
					note={m.auth === 'customer' ? (m.ownerOnly ? 'Signed-in customers · own records' : 'Signed-in customers') : 'Open to anyone'}>
					{endpointsOf(m).map(e => (
						<EndpointRow
							key={`${e.method} ${e.path}`}
							e={e}
							model={m}
							onTry={onTry}
						/>
					))}
				</Group>
			))}

			{info && !models.length && (
				<Text
					px={4}
					pb={4}
					fontSize='13px'
					color='fg.muted'>
					No public models yet — switch one on above and its endpoints show here.
				</Text>
			)}

			<Group
				title='Customer sign-in'
				note={customers ? 'For the models marked Customer' : 'For models open to signed-in customers'}>
				{AUTH_ENDPOINTS.map(e => (
					<EndpointRow
						key={`${e.method} ${e.path}`}
						e={e}
						onTry={onTry}
					/>
				))}
			</Group>

			{info?.type === 'website' && (
				<Group
					title='Website'
					note='Settings, menu and published pages'>
					{SITE_ENDPOINTS.map(e => (
						<EndpointRow
							key={`${e.method} ${e.path}`}
							e={e}
							onTry={onTry}
						/>
					))}
				</Group>
			)}
		</Panel>
	);
};

export default ApiReference;
