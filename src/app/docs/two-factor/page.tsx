'use client';

import { FC, ReactNode, useEffect } from 'react';
import { Box, Flex, Grid, Link, Table, Text } from '@chakra-ui/react';
import { ShieldCheck } from 'lucide-react';

/**
 * Two-factor authentication, explained for the people who sign in to the
 * admin. Public (no Layout, so no login wall): it's linked from the sign-in
 * step itself, where the reader isn't signed in yet — and from every part of
 * Settings → Two-factor authentication (`/docs/two-factor#<section>`), in a
 * new tab.
 *
 * Section ids are link targets in app/auth/login/_components/TwoFactorStep
 * and app/settings/_components/TwoFactorCard; rename one there too.
 */

const SECTIONS = [
	{ id: 'overview', title: 'What it is' },
	{ id: 'turn-on', title: 'Turning it on' },
	{ id: 'email', title: 'Email codes' },
	{ id: 'passkeys', title: 'Passkeys' },
	{ id: 'backup-codes', title: 'Backup codes' },
	{ id: 'signing-in', title: 'Signing in' },
	{ id: 'another-browser', title: 'On another browser or device' },
	{ id: 'turn-off', title: 'Turning it off' },
	{ id: 'devices', title: 'Signed-in devices' },
	{ id: 'all-sessions', title: 'Everyone’s sessions' },
	{ id: 'locked-out', title: 'Locked out' },
	{ id: 'faq', title: 'Troubleshooting' },
];

const Section: FC<{ id: string; title: string; lead?: ReactNode; children: ReactNode }> = ({ id, title, lead, children }) => (
	<Box
		as='section'
		id={id}
		scrollMarginTop='24px'
		pt={8}
		pb={2}
		borderTopWidth='1px'
		borderColor='border.muted'
		_first={{ borderTopWidth: 0, pt: 0 }}>
		<Text
			as='h2'
			fontSize='lg'
			fontWeight='600'
			mb={lead ? 1 : 3}>
			<Link
				href={`#${id}`}
				color='fg'
				_hover={{ textDecoration: 'none', color: 'fg.muted' }}>
				{title}
			</Link>
		</Text>
		{lead && (
			<Text
				fontSize='sm'
				color='fg.muted'
				mb={4}>
				{lead}
			</Text>
		)}
		<Flex
			direction='column'
			gap={3}>
			{children}
		</Flex>
	</Box>
);

const P: FC<{ children: ReactNode }> = ({ children }) => (
	<Text
		fontSize='sm'
		lineHeight='1.7'>
		{children}
	</Text>
);

const C: FC<{ children: ReactNode }> = ({ children }) => (
	<Box
		as='code'
		fontFamily='mono'
		fontSize='0.85em'
		px={1}
		py={0.5}
		borderRadius='sm'
		bg='bg.muted'>
		{children}
	</Box>
);

const List: FC<{ items: ReactNode[]; ordered?: boolean }> = ({ items, ordered }) => (
	<Box
		as={ordered ? 'ol' : 'ul'}
		pl={5}
		fontSize='sm'
		lineHeight='1.7'
		listStyleType={ordered ? 'decimal' : 'disc'}>
		{items.map((item, i) => (
			<Box
				as='li'
				key={i}
				mb={1}>
				{item}
			</Box>
		))}
	</Box>
);

const Note: FC<{ children: ReactNode; tone?: 'warn' }> = ({ children, tone }) => (
	<Box
		px={4}
		py={3}
		borderLeftWidth='3px'
		borderColor={tone === 'warn' ? 'orange.solid' : 'border.emphasized'}
		bg='bg.subtle'
		borderRadius='sm'
		fontSize='sm'
		lineHeight='1.7'>
		{children}
	</Box>
);

const Terms: FC<{ head?: [string, string]; rows: [ReactNode, ReactNode][] }> = ({ head = ['Term', 'What it means'], rows }) => (
	<Box
		borderWidth='1px'
		borderColor='border'
		borderRadius='md'
		overflowX='auto'>
		<Table.Root
			size='sm'
			variant='line'>
			<Table.Header>
				<Table.Row bg='bg.subtle'>
					{head.map(h => (
						<Table.ColumnHeader
							key={h}
							fontSize='11px'
							fontWeight='500'
							letterSpacing='0.04em'
							textTransform='uppercase'
							color='fg.muted'>
							{h}
						</Table.ColumnHeader>
					))}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{rows.map(([term, def], i) => (
					<Table.Row
						key={i}
						bg='transparent'>
						<Table.Cell
							fontSize='sm'
							fontWeight='500'
							verticalAlign='top'
							w='34%'
							minW='150px'>
							{term}
						</Table.Cell>
						<Table.Cell
							fontSize='sm'
							color='fg.muted'
							lineHeight='1.6'>
							{def}
						</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	</Box>
);

const TwoFactorDocs = () => {
	useEffect(() => {
		const id = decodeURIComponent(window.location.hash.slice(1));
		if (id) document.getElementById(id)?.scrollIntoView();
	}, []);

	return (
		<Box
			minH='100vh'
			bg='bg'
			px={{ base: 4, md: 10 }}
			py={{ base: 6, md: 10 }}>
			<Flex
				align='center'
				gap={3}
				mb={8}
				maxW='1040px'
				mx='auto'>
				<Flex
					w='36px'
					h='36px'
					align='center'
					justify='center'
					borderRadius='lg'
					bg='bg.muted'>
					<ShieldCheck size={18} />
				</Flex>
				<Box>
					<Text
						fontSize='xl'
						fontWeight='600'
						letterSpacing='-0.01em'>
						Two-factor authentication
					</Text>
					<Text
						fontSize='sm'
						color='fg.muted'>
						A second step after your password — email code, passkey or backup code — and the devices you’re signed in on.{' '}
						<Link href='/settings#two-factor'>Open your settings</Link>
					</Text>
				</Box>
			</Flex>

			<Grid
				templateColumns={{ base: '1fr', lg: '200px minmax(0, 1fr)' }}
				gap={10}
				maxW='1040px'
				mx='auto'>
				<Box
					as='nav'
					display={{ base: 'none', lg: 'block' }}>
					<Text
						fontSize='11px'
						fontWeight='500'
						letterSpacing='0.04em'
						textTransform='uppercase'
						color='fg.muted'
						mb={2}>
						On this page
					</Text>
					<Flex
						direction='column'
						gap={1}>
						{SECTIONS.map(s => (
							<Link
								key={s.id}
								href={`#${s.id}`}
								fontSize='sm'
								color='fg.muted'
								_hover={{ color: 'fg', textDecoration: 'none' }}>
								{s.title}
							</Link>
						))}
					</Flex>
				</Box>

				<Box
					maxW='760px'
					minW={0}>
					<Section
						id='overview'
						title='What it is'
						lead='Your password, plus one more thing only you have.'>
						<P>
							With two-factor authentication on, a correct password isn’t enough to sign in. The admin then asks for a
							second step, which can be any of these:
						</P>
						<Terms
							head={['Way', 'What you do']}
							rows={[
								['Passkey', 'Touch ID, Face ID, Windows Hello, your phone or a security key — one touch, nothing to type.'],
								['Email code', 'A 6-digit code sent to your account’s email. It works for 10 minutes.'],
								['Backup code', 'One of 10 single-use codes you save when you turn it on, for when the others aren’t available.'],
							]}
						/>
						<P>
							It’s set per person: turning it on for your account doesn’t change anyone else’s. Find it under{' '}
							<Link href='/settings#two-factor'>Settings → Two-factor authentication</Link>.
						</P>
					</Section>

					<Section
						id='turn-on'
						title='Turning it on'>
						<List
							ordered
							items={[
								<>Open <strong>Settings</strong> and find <strong>Two-factor authentication</strong>.</>,
								<>Press <strong>Turn on</strong> and enter your current password.</>,
								<>Email codes are switched on for you, and 10 backup codes appear. Copy or download them before you close the window — they’re shown only once.</>,
								<>Optional, and recommended: <strong>Add passkey</strong>, so signing in is one touch.</>,
							]}
						/>
						<Note>You’ll get an email whenever two-factor is turned on or off, a passkey is added or removed, or a backup code is used — so you’d notice if someone else did it.</Note>
					</Section>

					<Section
						id='email'
						title='Email codes'
						lead='Always available as long as the switch is on and you can read your email.'>
						<List
							items={[
								'The code has 6 digits and works for 10 minutes. Only the newest code works.',
								'You can ask for a new code every 30 seconds.',
								'After 5 wrong tries for one code, send a new one.',
								<>Email codes can be switched off in Settings only while you have a passkey — otherwise there’d be no way to finish signing in.</>,
							]}
						/>
						<Note tone='warn'>Nobody from MINT will ever ask you for this code. If you get one you didn’t ask for, someone knows your password — change it.</Note>
					</Section>

					<Section
						id='passkeys'
						title='Passkeys'
						lead='A passkey is a key your device keeps for you. Nothing to type or remember.'>
						<P>
							Press <strong>Add passkey</strong> in Settings, give it a name (we suggest one, like “Chrome on macOS”), and
							follow your browser’s prompt. Where it’s saved depends on your device:
						</P>
						<Terms
							head={['Where', 'What happens']}
							rows={[
								['Apple Keychain (Safari, iPhone, iPad, Mac)', 'Saved in iCloud Keychain and available on your other Apple devices.'],
								['Google Password Manager (Chrome)', 'Saved to your Google account, available in Chrome on your other devices and Android.'],
								['This browser / Windows Hello', 'Saved on this computer only.'],
								['A phone', 'Choose “use a phone or tablet” and scan the QR code; the passkey stays on the phone.'],
								['A security key', 'Plug in or tap a key like a YubiKey.'],
							]}
						/>
						<P>
							A passkey marked <strong>Synced</strong> is kept by a password manager that copies it to your other
							devices. You can add several passkeys, rename them, and remove one you no longer use. Removing it here
							stops it signing you in; the passkey itself stays in your password manager until you delete it there.
						</P>
					</Section>

					<Section
						id='backup-codes'
						title='Backup codes'
						lead='For the day you have neither your passkey nor your email.'>
						<List
							items={[
								<>10 codes like <C>k7dm-q2xa</C>. Each works once; capital letters and spaces don’t matter.</>,
								'Keep them in a password manager, or print them and store them somewhere safe.',
								'Settings shows how many are left. When you’re down to 3, make new ones.',
								<><strong>Make new codes</strong> (with your password) gives you 10 fresh codes; the old ones stop working at once.</>,
							]}
						/>
					</Section>

					<Section
						id='signing-in'
						title='Signing in'
						lead='Enter your email and password as usual — then one more step.'>
						<List
							ordered
							items={[
								<>If you have a passkey, you’ll see <strong>Continue with passkey</strong>. Press it and confirm with your fingerprint, face, PIN or phone.</>,
								<>Otherwise we email you a code straight away. Type it in (or paste it) — it’s checked as soon as all 6 digits are there.</>,
								<>Need a different way? Press <strong>Try another way</strong> and choose email, passkey or a backup code.</>,
							]}
						/>
						<Note>The second step has to be finished within 10 minutes of entering your password, and allows 10 wrong codes. After that, start over from your password.</Note>
					</Section>

					<Section
						id='another-browser'
						title='On another browser or device'
						lead='Your passkey may not be on this browser — that’s what “Try another way” is for.'>
						<P>
							A passkey saved in Chrome on your laptop isn’t in Safari, or on a colleague’s computer. When you press{' '}
							<strong>Continue with passkey</strong> there, the browser may offer to use a phone (scan the QR code with
							the phone that has it), or say there’s no passkey. Either way you can press <strong>Try another way</strong>{' '}
							and choose <strong>Email me a code</strong> — we’ll send one to your email.
						</P>
						<P>You can add a passkey for this browser too, once you’re signed in.</P>
					</Section>

					<Section
						id='turn-off'
						title='Turning it off'>
						<P>
							Press <strong>Turn off</strong> in Settings and enter your password. Your password alone will sign you in
							again. Your backup codes stop working; your passkeys stay in the list, ready for when you turn it back on.
						</P>
					</Section>

					<Section
						id='devices'
						title='Signed-in devices'
						lead='Every browser or phone your account is signed in on, in Settings.'>
						<P>
							<Link href='/settings#devices'>Settings → Signed-in devices</Link> lists each one: the browser and
							system (“Chrome on macOS”), its IP address, when it signed in and how (password, email code, passkey…), and
							when it was last active. The device you’re using is marked <strong>This device</strong>.
						</P>
						<List
							items={[
								<><strong>Sign out</strong> on a row signs that device out straight away. The next thing it does takes it to the login page, with a note that it was signed out.</>,
								<><strong>Sign out other devices</strong> signs out everything except the device you’re on — useful after using a shared computer or if you don’t recognise one.</>,
								<><strong>Logout</strong> in your account menu signs this device out the same way, so it disappears from the list.</>,
								'“Last active” updates about once a minute while the device is being used.',
							]}
						/>
						<Note tone='warn'>
							A device you don’t recognise means someone else has your password: sign it out, change your password, and
							turn on two-factor authentication.
						</Note>
					</Section>

					<Section
						id='all-sessions'
						title='Everyone’s sessions'
						lead='For super admins: every admin’s signed-in devices on one page.'>
						<P>
							<strong>Admin Sidebar → Login Sessions</strong> (<C>/sessions</C>) shows who is signed in where, when each
							device was last active (a green dot means within the last 5 minutes), and the history of signed-out sessions
							— who signed them out and when. Search by an admin’s name or email, a browser, or an IP address.
						</P>
						<List
							items={[
								<>The <strong>sign-out</strong> icon on a row signs that one device out.</>,
								<>The <strong>red person</strong> icon signs out every device of that admin — for someone who left, or a lost laptop.</>,
								<>Other roles can be given the <strong>Login sessions</strong> permission on the Roles page: <strong>View</strong> to see the page, <strong>Delete</strong> to sign devices out.</>,
							]}
						/>
						<Note>
							A signed-out device can’t be signed back in from here — its owner signs in again with their password (and
							two-factor, if it’s on).
						</Note>
					</Section>

					<Section
						id='locked-out'
						title='Locked out'
						lead='Lost the device with your passkey, can’t get into your email, and no backup codes left?'>
						<P>
							Ask an administrator. Someone with access to the server can switch two-factor off for your account, after
							which your password signs you in and you can set it up again:
						</P>
						<Box
							as='pre'
							fontFamily='mono'
							fontSize='xs'
							p={3}
							borderRadius='md'
							bg='bg.muted'
							overflowX='auto'>
							node scripts/resetTwoFactor.js you@company.com
						</Box>
						<P>
							Add <C>--remove-passkeys</C> to remove your passkeys as well (for a lost or stolen device).
						</P>
					</Section>

					<Section
						id='faq'
						title='Troubleshooting'>
						<Terms
							head={['Problem', 'Why, and what to do']}
							rows={[
								['The code email didn’t arrive', 'Check spam, wait a minute, then press “Send a new code”. Only the newest code works.'],
								['“That code has expired”', 'Codes last 10 minutes. Send a new one.'],
								['“This sign-in has expired”', 'The second step took more than 10 minutes, or had too many wrong codes. Enter your password again.'],
								['The passkey prompt says there’s no passkey', 'It’s saved on another browser or device. Use your phone via the QR code, or Try another way.'],
								['“Add passkey” is greyed out', 'This browser doesn’t support passkeys. Use a current Chrome, Safari, Edge or Firefox.'],
								['I can’t switch email codes off', 'Add a passkey first — otherwise there’d be no way to finish signing in.'],
								['I can’t remove my last passkey', 'Turn email codes on first, or turn two-factor off.'],
							]}
						/>
					</Section>
				</Box>
			</Grid>
		</Box>
	);
};

export default TwoFactorDocs;
