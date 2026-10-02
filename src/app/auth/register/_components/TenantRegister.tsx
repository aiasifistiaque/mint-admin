'use client';

import { FC, FormEvent, useState } from 'react';
import NextLink from 'next/link';
import { Box, Button, Field, Flex, Input, Link as ChakraLink, Text } from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';
import { LoginContainer, VInput, VPassword, login, useAppDispatch, useTenantRegisterMutation } from '@/components/library';
import { Dropdown } from '@/components/library/cl';
import { GOALS, HEARD_FROM, INDUSTRIES, TEAM_SIZES } from '@/components/library/tenant/onboarding';

/**
 * Sign-up for the tenant platform, in two steps on the sign-in card: the
 * account and its organization, then a few questions about the business and
 * how they heard of us (all optional). One request creates the user, the
 * organization (them as owner) and the session — POST /tenant/api/auth/register.
 */

type Chip = { value: string; label: string };

/** Pick-one or pick-several as a row of pills — quicker than a list for a handful of answers. */
const Chips: FC<{ items: Chip[]; value: string[]; onChange: (v: string[]) => void; multiple?: boolean; label: string }> = ({
	items,
	value,
	onChange,
	multiple,
	label,
}) => (
	<Flex
		role='group'
		aria-label={label}
		wrap='wrap'
		gap={1.5}>
		{items.map(c => {
			const on = value.includes(c.value);
			return (
				<Box
					key={c.value}
					as='button'
					// @ts-ignore — Box as button
					type='button'
					aria-pressed={on}
					onClick={() => onChange(multiple ? (on ? value.filter(v => v !== c.value) : [...value, c.value]) : on ? [] : [c.value])}
					px={2.5}
					h='28px'
					borderRadius='full'
					borderWidth='1px'
					borderColor={on ? 'accent.solid' : 'border'}
					bg={on ? 'accent.solid' : 'bg.panel'}
					color={on ? 'accent.contrast' : 'fg'}
					fontSize='12.5px'
					fontWeight='500'
					cursor='pointer'
					_hover={on ? undefined : { bg: 'bg.muted' }}>
					{c.label}
				</Box>
			);
		})}
	</Flex>
);

const Label: FC<{ children: string; optional?: boolean }> = ({ children, optional }) => (
	<Text
		fontSize='13px'
		fontWeight='600'
		mb={1.5}>
		{children}
		{optional && (
			<Text
				as='span'
				fontWeight='400'
				color='fg.muted'>
				{' '}
				· optional
			</Text>
		)}
	</Text>
);

const TenantRegister: FC = () => {
	const dispatch = useAppDispatch();
	const [register, { isLoading, error }] = useTenantRegisterMutation();
	const [step, setStep] = useState<1 | 2>(1);
	const [account, setAccount] = useState({ name: '', email: '', password: '', organization: '' });
	const [about, setAbout] = useState({
		industry: '',
		teamSize: '',
		role: '',
		website: '',
		country: '',
		heardFrom: '',
		heardFromOther: '',
		goals: [] as string[],
	});

	const setA = (k: keyof typeof account) => (e: any) => setAccount(a => ({ ...a, [k]: e.target.value }));
	const accountReady =
		account.name.trim() && /\S+@\S+\.\S+/.test(account.email) && account.password.length >= 8 && account.organization.trim();

	const submit = async (e: FormEvent) => {
		e.preventDefault();
		if (step === 1) {
			if (accountReady) setStep(2);
			return;
		}
		const res = await register({
			name: account.name.trim(),
			email: account.email.trim(),
			password: account.password,
			organization: account.organization.trim(),
			onboarding: {
				businessName: account.organization.trim(),
				...Object.fromEntries(Object.entries(about).filter(([, v]) => (Array.isArray(v) ? v.length : v))),
			},
		});
		if ('data' in res && res.data?.token) dispatch(login({ token: res.data.token }));
	};

	const message = (error as any)?.data?.message;

	return (
		<LoginContainer
			title={step === 1 ? 'Create your account' : 'Tell us about your business'}
			subtitle={step === 1 ? 'Start building apps and websites — free.' : 'It helps us set things up for you. Skip anything you like.'}
			submitLabel={step === 1 ? 'Continue' : 'Create account'}
			isLoading={isLoading}
			handleSubmit={submit}
			footer={
				step === 1 ? (
					<>
						Already have an account?{' '}
						<ChakraLink
							as={NextLink}
							href='/auth/login'
							color='fg'
							fontWeight='600'>
							Sign in
						</ChakraLink>
					</>
				) : (
					<Button
						type='button'
						variant='ghost'
						size='xs'
						color='fg.muted'
						onClick={() => setStep(1)}>
						<ArrowLeft size={14} />
						Back
					</Button>
				)
			}>
			{step === 1 ? (
				<>
					<VInput
						label='Your name'
						isRequired
						size='md'
						autoComplete='name'
						autoFocus
						placeholder='Full name'
						value={account.name}
						onChange={setA('name')}
						name='name'
					/>
					<VInput
						label='Work email'
						isRequired
						size='md'
						type='email'
						autoComplete='email'
						placeholder='you@company.com'
						value={account.email}
						onChange={setA('email')}
						name='email'
					/>
					<VPassword
						label='Password'
						isRequired
						size='md'
						placeholder='At least 8 characters'
						value={account.password}
						onChange={setA('password')}
						name='password'
						helper={account.password && account.password.length < 8 ? 'Use at least 8 characters.' : undefined}
					/>
					<VInput
						label='Organization'
						isRequired
						size='md'
						autoComplete='organization'
						placeholder='Your company or team'
						value={account.organization}
						onChange={setA('organization')}
						name='organization'
					/>
				</>
			) : (
				<>
					<Box>
						<Label optional>Industry</Label>
						<Dropdown
							value={about.industry}
							onChange={v => setAbout(a => ({ ...a, industry: v }))}
							items={INDUSTRIES}
							placeholder='Choose one'
						/>
					</Box>
					<Box>
						<Label optional>Team size</Label>
						<Chips
							label='Team size'
							items={TEAM_SIZES}
							value={about.teamSize ? [about.teamSize] : []}
							onChange={v => setAbout(a => ({ ...a, teamSize: v[0] || '' }))}
						/>
					</Box>
					<Flex
						gap={3}
						direction={{ base: 'column', sm: 'row' }}>
						<Field.Root flex={1}>
							<Field.Label
								fontSize='13px'
								fontWeight='600'>
								Your role · <Text as='span' fontWeight='400' color='fg.muted'>optional</Text>
							</Field.Label>
							<Input
								size='md'
								value={about.role}
								placeholder='e.g. Founder'
								onChange={e => setAbout(a => ({ ...a, role: e.target.value }))}
							/>
						</Field.Root>
						<Field.Root flex={1}>
							<Field.Label
								fontSize='13px'
								fontWeight='600'>
								Country · <Text as='span' fontWeight='400' color='fg.muted'>optional</Text>
							</Field.Label>
							<Input
								size='md'
								value={about.country}
								autoComplete='country-name'
								onChange={e => setAbout(a => ({ ...a, country: e.target.value }))}
							/>
						</Field.Root>
					</Flex>
					<Field.Root>
						<Field.Label
							fontSize='13px'
							fontWeight='600'>
							Website · <Text as='span' fontWeight='400' color='fg.muted'>optional</Text>
						</Field.Label>
						<Input
							size='md'
							value={about.website}
							placeholder='https://'
							autoComplete='url'
							onChange={e => setAbout(a => ({ ...a, website: e.target.value }))}
						/>
					</Field.Root>
					<Box>
						<Label optional>What do you want to build?</Label>
						<Chips
							label='What do you want to build'
							multiple
							items={GOALS}
							value={about.goals}
							onChange={v => setAbout(a => ({ ...a, goals: v }))}
						/>
					</Box>
					<Box>
						<Label optional>How did you hear about us?</Label>
						<Dropdown
							value={about.heardFrom}
							onChange={v => setAbout(a => ({ ...a, heardFrom: v }))}
							items={HEARD_FROM}
							placeholder='Choose one'
						/>
						{about.heardFrom === 'other' && (
							<Input
								mt={2}
								size='md'
								value={about.heardFromOther}
								placeholder='Where?'
								onChange={e => setAbout(a => ({ ...a, heardFromOther: e.target.value }))}
							/>
						)}
					</Box>
				</>
			)}
			{message && (
				<Text
					role='alert'
					fontSize='13px'
					color='red.fg'>
					{message}
				</Text>
			)}
		</LoginContainer>
	);
};

export default TenantRegister;
