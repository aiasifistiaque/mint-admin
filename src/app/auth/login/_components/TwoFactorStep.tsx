'use client';

import { FC, FormEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { Box, Button, Center, Flex, Heading, Input, Link, Text } from '@chakra-ui/react';
import { ArrowLeft, ExternalLink, KeyRound, LifeBuoy, Mail, ShieldCheck } from 'lucide-react';
import {
	TwoFactorChallenge,
	useSendTwoFactorCodeMutation,
	useTwoFactorPasskeyOptionsMutation,
	useVerifyTwoFactorCodeMutation,
	useVerifyTwoFactorPasskeyMutation,
} from '@/components/library';
import { passkeyError, passkeysSupported, startAuthentication } from '@/components/library/utils/functions/passkeys';
import { docsPath } from '@/components/library/config/lib/constants/panel';

type Method = 'passkey' | 'email' | 'backup';
type View = Method | 'choose';

const GUIDE = docsPath('/docs/two-factor');

/** "How this works ↗", to a section of the guide in a new tab. */
const DocLink: FC<{ anchor: string; children?: ReactNode }> = ({ anchor, children }) => (
	<Link
		href={`${GUIDE}#${anchor}`}
		target='_blank'
		rel='noreferrer'
		fontSize='12px'
		color='fg.muted'
		display='inline-flex'
		alignItems='center'
		gap={1}
		_hover={{ color: 'fg' }}>
		{children || 'How this works'}
		<ExternalLink size={11} />
	</Link>
);

const OPTIONS: { method: Method; icon: ReactNode; label: string; hint: (email: string) => string }[] = [
	{ method: 'passkey', icon: <KeyRound size={18} />, label: 'Use a passkey', hint: () => 'Touch ID, Face ID, Windows Hello, your phone or a security key' },
	{ method: 'email', icon: <Mail size={18} />, label: 'Email me a code', hint: email => `A 6-digit code to ${email}` },
	{ method: 'backup', icon: <LifeBuoy size={18} />, label: 'Use a backup code', hint: () => 'One of the codes you saved when you turned this on' },
];

const errorOf = (e: any) => e?.data?.message || e?.message || 'Something went wrong — try again.';
const isOver = (e: any) => ['ticket_expired', 'ticket_locked'].includes(e?.data?.code);

/**
 * The second step of signing in when two-factor authentication is on: the
 * password earned a ticket, and this trades it for the session with a
 * passkey, an emailed code or a backup code. A passkey comes first when the
 * account has one; "Try another way" is for a browser that doesn't have it.
 */
const TwoFactorStep: FC<{ challenge: TwoFactorChallenge; onToken: (token: string) => void; onRestart: () => void }> = ({
	challenge,
	onToken,
	onRestart,
}) => {
	const { ticket, methods, email } = challenge;
	const available = OPTIONS.filter(o => methods[o.method]);
	const first: View = methods.passkey && passkeysSupported() ? 'passkey' : methods.email ? 'email' : methods.backup ? 'backup' : 'choose';

	const [view, setView] = useState<View>(first);
	const [error, setError] = useState<{ message: string; over: boolean } | null>(null);
	const [code, setCode] = useState('');
	const [sentTo, setSentTo] = useState('');
	const [wait, setWait] = useState(0);

	const [sendCode, sending] = useSendTwoFactorCodeMutation();
	const [verifyCode, verifying] = useVerifyTwoFactorCodeMutation();
	const [passkeyOptions] = useTwoFactorPasskeyOptionsMutation();
	const [verifyPasskey] = useVerifyTwoFactorPasskeyMutation();
	const [passkeyBusy, setPasskeyBusy] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const fail = (e: any) => setError({ message: errorOf(e), over: isOver(e) });

	// The resend countdown.
	useEffect(() => {
		if (wait <= 0) return;
		const t = setTimeout(() => setWait(w => w - 1), 1000);
		return () => clearTimeout(t);
	}, [wait]);

	const emailCode = async () => {
		setError(null);
		try {
			const r = await sendCode({ ticket }).unwrap();
			setSentTo(r.sentTo);
			setWait(r.resendIn);
		} catch (e: any) {
			// A code sent a moment ago is still good: say so, don't fail.
			if (e?.data?.code === 'resend_wait') {
				setSentTo(email);
				setWait(Number(String(e.data.message).match(/\d+/)?.[0]) || 30);
			} else fail(e);
		}
	};

	const go = (next: View) => {
		setError(null);
		setCode('');
		setView(next);
		if (next === 'email' && !sentTo) emailCode();
	};

	// Opening straight on the email step sends the code.
	useEffect(() => {
		if (first === 'email') emailCode();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (view === 'email' || view === 'backup') inputRef.current?.focus();
	}, [view]);

	const signInWithPasskey = async () => {
		setError(null);
		setPasskeyBusy(true);
		try {
			const options = await passkeyOptions({ ticket }).unwrap();
			const response = await startAuthentication(options);
			const r = await verifyPasskey({ ticket, response }).unwrap();
			onToken(r.token);
		} catch (e: any) {
			setError({ message: passkeyError(e), over: isOver(e) });
		} finally {
			setPasskeyBusy(false);
		}
	};

	const verify = async (method: 'email' | 'backup', value: string) => {
		setError(null);
		try {
			const r = await verifyCode({ ticket, method, code: value }).unwrap();
			onToken(r.token);
		} catch (err: any) {
			fail(err);
			setCode('');
			inputRef.current?.focus();
		}
	};

	const submitCode = (e?: FormEvent) => {
		e?.preventDefault();
		if (view === 'email' || view === 'backup') verify(view, code);
	};

	// Six digits typed (or pasted from the email): check them straight away.
	const onEmailCode = (value: string) => {
		const digits = value.replace(/\D/g, '').slice(0, 6);
		setCode(digits);
		if (digits.length === 6 && !verifying.isLoading) verify('email', digits);
	};

	const titles: Record<View, string> = {
		passkey: 'Use your passkey',
		email: 'Check your email',
		backup: 'Enter a backup code',
		choose: 'Choose another way',
	};

	const others = available.filter(o => o.method !== view);

	return (
		<Center
			w='100vw'
			minH='100vh'
			flex={1}
			px={4}
			bg='sidebar.light'
			_dark={{ bg: 'container.dark' }}>
			<Flex
				as='form'
				onSubmit={submitCode as any}
				direction='column'
				gap={5}
				w={{ base: 'full', md: '420px' }}
				p={{ base: 5, md: 8 }}
				bg='bg.panel'
				_dark={{ bg: 'sidebar.dark' }}
				borderWidth={1}
				borderColor='border'
				borderRadius='24px'
				boxShadow='lg'>
				<Flex
					direction='column'
					align='center'
					textAlign='center'
					gap={3}>
					<Center
						w='44px'
						h='44px'
						borderRadius='full'
						bg='bg.muted'
						color='fg'>
						<ShieldCheck
							size={22}
							strokeWidth={1.75}
						/>
					</Center>
					<Box>
						<Text
							fontSize='12px'
							fontWeight='600'
							letterSpacing='0.06em'
							textTransform='uppercase'
							color='fg.muted'>
							Two-step verification
						</Text>
						<Heading
							size='lg'
							mt={1}>
							{titles[view]}
						</Heading>
					</Box>
				</Flex>

				{view === 'passkey' && (
					<Flex
						direction='column'
						gap={3}>
						<Text
							fontSize='14px'
							color='fg.muted'
							textAlign='center'>
							Your browser will ask for the passkey saved in Apple Keychain, Google Password Manager, this browser, your phone or a security key.
						</Text>
						<Button
							type='button'
							size='lg'
							autoFocus
							loading={passkeyBusy}
							loadingText='Waiting for your passkey'
							onClick={signInWithPasskey}>
							<KeyRound size={17} />
							Continue with passkey
						</Button>
					</Flex>
				)}

				{view === 'email' && (
					<Flex
						direction='column'
						gap={3}>
						<Text
							fontSize='14px'
							color='fg.muted'
							textAlign='center'>
							{sending.isLoading && !sentTo ? `Sending a code to ${email}…` : `We sent a 6-digit code to ${sentTo || email}. It expires in 10 minutes.`}
						</Text>
						<Input
							ref={inputRef}
							value={code}
							onChange={e => onEmailCode(e.target.value)}
							inputMode='numeric'
							autoComplete='one-time-code'
							placeholder='000000'
							aria-label='6-digit code'
							size='lg'
							h='56px'
							textAlign='center'
							fontSize='24px'
							fontWeight='600'
							letterSpacing='0.4em'
							fontVariantNumeric='tabular-nums'
						/>
						<Button
							type='submit'
							size='lg'
							disabled={code.length !== 6}
							loading={verifying.isLoading}>
							Verify
						</Button>
						<Button
							type='button'
							variant='ghost'
							size='sm'
							alignSelf='center'
							disabled={wait > 0 || sending.isLoading}
							onClick={emailCode}>
							{wait > 0 ? `Send a new code in ${wait}s` : 'Send a new code'}
						</Button>
					</Flex>
				)}

				{view === 'backup' && (
					<Flex
						direction='column'
						gap={3}>
						<Text
							fontSize='14px'
							color='fg.muted'
							textAlign='center'>
							Enter one of the backup codes you saved when you turned on two-factor. Each code works once.
						</Text>
						<Input
							ref={inputRef}
							value={code}
							onChange={e => setCode(e.target.value.slice(0, 20))}
							autoComplete='off'
							autoCapitalize='off'
							spellCheck={false}
							placeholder='xxxx-xxxx'
							aria-label='Backup code'
							size='lg'
							h='52px'
							textAlign='center'
							fontFamily='mono'
							fontSize='20px'
							letterSpacing='0.1em'
						/>
						<Button
							type='submit'
							size='lg'
							disabled={code.replace(/[^a-z0-9]/gi, '').length < 8}
							loading={verifying.isLoading}>
							Verify
						</Button>
					</Flex>
				)}

				{view === 'choose' && (
					<Flex
						direction='column'
						gap={2}>
						{available.map(o => (
							<Button
								key={o.method}
								type='button'
								variant='outline'
								onClick={() => go(o.method)}
								h='auto'
								justifyContent='flex-start'
								gap={3}
								p={3}
								textAlign='left'
								whiteSpace='normal'
								fontWeight='400'
								borderRadius='xl'>
								<Center
									w='36px'
									h='36px'
									flexShrink={0}
									borderRadius='lg'
									bg='bg.muted'>
									{o.icon}
								</Center>
								<Box minW={0}>
									<Text
										fontSize='14px'
										fontWeight='600'>
										{o.label}
									</Text>
									<Text
										fontSize='12px'
										color='fg.muted'>
										{o.hint(email)}
									</Text>
								</Box>
							</Button>
						))}
						{!available.length && (
							<Text
								fontSize='14px'
								color='fg.muted'
								textAlign='center'>
								This account has no way to finish signing in. Ask an administrator to reset its two-factor authentication.
							</Text>
						)}
					</Flex>
				)}

				{error && (
					<Box
						role='alert'
						px={3}
						py={2.5}
						borderRadius='lg'
						bg='red.subtle'
						color='red.fg'
						fontSize='13px'>
						{error.message}
						{error.over && (
							<Button
								type='button'
								size='xs'
								variant='outline'
								ml={2}
								onClick={onRestart}>
								Start over
							</Button>
						)}
					</Box>
				)}

				<Flex
					direction='column'
					align='center'
					gap={2}
					pt={1}
					borderTopWidth={1}
					borderColor='border.muted'>
					{view !== 'choose' && others.length > 0 && (
						<Button
							type='button'
							variant='plain'
							size='sm'
							mt={2}
							onClick={() => go('choose')}>
							Try another way
						</Button>
					)}
					{view === 'choose' && available.length > 0 && view !== first && (
						<Button
							type='button'
							variant='plain'
							size='sm'
							mt={2}
							onClick={() => go(first)}>
							Back
						</Button>
					)}
					<Flex
						w='full'
						justify='space-between'
						align='center'
						mt={view === 'choose' ? 2 : 0}>
						<Button
							type='button'
							variant='plain'
							size='xs'
							color='fg.muted'
							px={0}
							onClick={onRestart}>
							<ArrowLeft size={13} />
							Use a different account
						</Button>
						<DocLink anchor='signing-in' />
					</Flex>
				</Flex>
			</Flex>
		</Center>
	);
};

export default TwoFactorStep;
