'use client';

import UserGuide from '../_components/UserGuide';
import { A, C, H3, List, Note, P, Section, Terms } from '../../docs/_components/prose';

/**
 * Your account: profile, password, two-factor sign-in, devices, appearance.
 * Section ids are link targets from the settings screens (two-factor,
 * devices, appearance) via panel.ts docsPath — keep them.
 */

const SECTIONS = [
	{ id: 'profile', title: 'Profile' },
	{ id: 'password', title: 'Password' },
	{ id: 'overview', title: 'Two-factor sign-in' },
	{ id: 'turn-on', title: 'Turning it on' },
	{ id: 'email', title: 'Email codes' },
	{ id: 'passkeys', title: 'Passkeys' },
	{ id: 'passkey-qr', title: 'A passkey on your phone' },
	{ id: 'backup-codes', title: 'Backup codes' },
	{ id: 'signing-in', title: 'Signing in' },
	{ id: 'turn-off', title: 'Turning it off' },
	{ id: 'devices', title: 'Signed-in devices' },
	{ id: 'locked-out', title: 'Locked out' },
	{ id: 'appearance', title: 'Appearance' },
];

const Account = () => (
	<UserGuide
		href='/user-docs/account'
		sections={SECTIONS}
		open={{ href: '/settings', label: 'Open Settings' }}>
		<Section
			id='profile'
			title='Profile'
			lead='Your avatar → Settings.'>
			<P>
				Change your name, phone number and picture. Your email is how you sign in and can’t be changed here. Your role in the
				organization you’re working in is shown too — the organization’s admins change it.
			</P>
		</Section>

		<Section
			id='password'
			title='Password'
			lead='Settings → Sign-in & security → Change password.'>
			<P>
				Enter your current password and the new one — at least 8 characters, and one you don’t use anywhere else. Forgot it?
				On the sign-in page press <A href='/auth/forgot-password'>Forgot password</A>; we email a link to set a new one. The
				email says the same thing whether or not an account exists, so nobody can use it to check who has one.
			</P>
		</Section>

		<Section
			id='overview'
			title='Two-factor sign-in'
			lead='Your password, plus one more thing only you have.'>
			<P>With two-factor sign-in on, a correct password isn’t enough. After it, we ask for one of these:</P>
			<Terms
				head={['Way', 'What you do']}
				rows={[
					['Passkey', 'Touch ID, Face ID, Windows Hello, your phone or a security key — one touch, nothing to type.'],
					['Email code', 'A 6-digit code sent to your email. It works for 10 minutes.'],
					['Backup code', 'One of 10 single-use codes you keep for when the others aren’t at hand.'],
				]}
			/>
			<P>
				It’s set per person: turning it on for you changes nothing for your teammates. It’s under{' '}
				<A href='/settings/security'>Settings → Sign-in & security</A>.
			</P>
		</Section>

		<Section
			id='turn-on'
			title='Turning it on'>
			<List
				ordered
				items={[
					<>
						Open <strong>Settings → Sign-in & security</strong> and find <strong>Two-factor authentication</strong>.
					</>,
					<>
						Press <strong>Turn on</strong> and enter your password.
					</>,
					<>
						Email codes are switched on, and 10 backup codes appear. Copy or download them now — they’re shown only once.
					</>,
					<>
						Recommended: <strong>Add passkey</strong>, so signing in is one touch.
					</>,
				]}
			/>
		</Section>

		<Section
			id='email'
			title='Email codes'>
			<List
				items={[
					'6 digits, valid for 10 minutes. Only the newest code works.',
					'You can ask for a new code every 30 seconds; after 5 wrong tries, send a new one.',
					'Email codes can be switched off only while you have a passkey — otherwise you’d have no way to finish signing in.',
				]}
			/>
		</Section>

		<Section
			id='passkeys'
			title='Passkeys'
			lead='A key your device keeps for you. Nothing to type or remember.'>
			<P>
				Press <strong>Add passkey</strong>, give it a name (we suggest one, like “Chrome on macOS”) and follow your browser’s
				prompt. Where it’s kept depends on your device:
			</P>
			<Terms
				head={['Where', 'What happens']}
				rows={[
					['Apple (Safari, iPhone, iPad, Mac)', 'Saved in iCloud Keychain, so your other Apple devices have it too.'],
					['Chrome', 'Saved to Google Password Manager, so Chrome on your other devices and Android have it.'],
					['Windows Hello / this browser', 'Saved on this computer only.'],
					['A security key', 'Plug in or tap a key such as a YubiKey.'],
				]}
			/>
			<P>
				Passkeys marked <strong>Synced</strong> are copied to your other devices by a password manager. You can add several,
				rename them, and remove ones you no longer use — removing one here stops it signing you in.
			</P>
		</Section>

		<Section
			id='passkey-qr'
			title='A passkey on your phone'
			lead='Add a passkey to your phone from your computer, with a QR code.'>
			<List
				ordered
				items={[
					<>
						Press <strong>Add passkey</strong> and choose <strong>On your phone or another device</strong>.
					</>,
					<>Enter your password. A QR code appears; it works once, for 10 minutes.</>,
					<>
						Scan it with your phone’s camera, open the link, check the name and press <strong>Create passkey</strong>. Confirm
						with Face ID, Touch ID or your screen lock.
					</>,
				]}
			/>
			<Note tone='warn'>
				Anyone holding the QR code could add a passkey to your account while it’s valid. Only scan it with your own phone — you
				get an email when it’s used. <strong>Copy link instead</strong> gives the same link for a device without a camera.
			</Note>
		</Section>

		<Section
			id='backup-codes'
			title='Backup codes'
			lead='For the day you have neither your passkey nor your email.'>
			<List
				items={[
					<>
						10 codes like <C>k7dm-q2xa</C>. Each works once; capitals and spaces don’t matter.
					</>,
					'Keep them in a password manager, or print them and put them somewhere safe.',
					'Settings shows how many are left. When you’re down to 3, make new ones.',
					<>
						<strong>Make new codes</strong> (with your password) gives you 10 fresh codes; the old ones stop working at once.
					</>,
				]}
			/>
		</Section>

		<Section
			id='signing-in'
			title='Signing in'
			lead='Email and password as usual — then one more step.'>
			<List
				ordered
				items={[
					<>
						With a passkey, press <strong>Continue with passkey</strong> and confirm with your fingerprint, face, PIN or phone.
					</>,
					<>Otherwise we email a code straight away. Type or paste it — it’s checked as soon as all 6 digits are in.</>,
					<>
						Need another way? <strong>Try another way</strong> offers email, passkey or a backup code.
					</>,
				]}
			/>
			<P>
				A passkey saved in Chrome on your laptop isn’t in Safari or on a colleague’s computer. There, pick “use a phone or
				tablet” in the browser’s prompt, or <strong>Try another way</strong> → <strong>Email me a code</strong>.
			</P>
		</Section>

		<Section
			id='turn-off'
			title='Turning it off'>
			<P>
				Press <strong>Turn off</strong> in Settings and enter your password. Your password alone signs you in again; backup
				codes stop working, and your passkeys stay listed for when you turn it back on.
			</P>
		</Section>

		<Section
			id='devices'
			title='Signed-in devices'
			lead='Every browser and phone your account is signed in on.'>
			<P>
				<A href='/settings/security#devices'>Settings → Sign-in & security → Signed-in devices</A> lists each one: the browser
				and system (“Chrome on macOS”), roughly where it is, when and how it signed in, and when it was last active. Yours is
				marked <strong>This device</strong>.
			</P>
			<List
				items={[
					<>
						<strong>Sign out</strong> on a row signs that device out at once.
					</>,
					<>
						<strong>Sign out other devices</strong> signs out everything but the device you’re on — after using a shared
						computer, say.
					</>,
					'The place comes from the internet connection, so a VPN or mobile network can show a nearby city or another country.',
				]}
			/>
			<Note tone='warn'>
				A device you don’t recognise means someone has your password: sign it out, change your password, and turn on two-factor
				sign-in.
			</Note>
		</Section>

		<Section
			id='locked-out'
			title='Locked out'>
			<P>
				Lost your passkey? Use an email code. Can’t get your email? Use a backup code. Without any of the three there’s no way
				past the second step — which is the point of it — so keep your backup codes somewhere safe, and contact support if
				you’re stuck.
			</P>
		</Section>

		<Section
			id='appearance'
			title='Appearance'
			lead='Your avatar → Themes.'>
			<H3>Colour themes</H3>
			<P>
				Pick a theme for the panel — its accent colour and how its surfaces look. The preview on each card shows it before you
				choose.
			</P>
			<H3>Light, dark or system</H3>
			<P>
				<strong>System</strong> follows your device, switching when it does. <strong>Light</strong> and{' '}
				<strong>Dark</strong> stay put.
			</P>
			<P>
				Your theme is saved to your account, so it follows you to other browsers and devices. Light, dark or system is
				remembered by each browser, so a laptop and a phone can differ.
			</P>
		</Section>
	</UserGuide>
);

export default Account;
