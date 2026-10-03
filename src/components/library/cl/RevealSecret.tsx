'use client';

import { FC, KeyboardEvent, ReactNode, useEffect, useState } from 'react';
import { Box, Button, CloseButton, Dialog, Flex, IconButton, Input, Link, Portal, Text, useClipboard } from '@chakra-ui/react';
import { Check, Copy, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { radius } from '../index';
import { docsPath } from '../config/lib/constants/panel';
import ModalFooter from '../modals/modal-components/CustomModalFooter';
import { useRevealSecretMutation } from '../store/services/secretApi';
import { MASK } from './SecretValue';

/**
 * A built model's Password field (backend secretFields.function.ts) in a
 * table cell or on a view page. The record never carries the value, so it
 * shows dots and an eye; the eye asks for the person's own sign-in password,
 * then shows the value — with copy — until hidden again or a minute passes.
 *
 * Every click and key stops here: the dialog is portalled, but React still
 * bubbles its events to the table row, which would open the record.
 */

type Props = {
	/** The model's route, e.g. `clients`. */
	path: string;
	id?: string;
	field: string;
	label?: string;
	size?: 'sm' | 'xs';
};

const SHOWN_FOR_MS = 60_000;

const errorOf = (e: any) => e?.data?.message || 'Couldn’t reveal it. Try again.';

const RevealSecret: FC<Props> = ({ path, id, field, label, size = 'sm' }) => {
	const [asking, setAsking] = useState(false);
	const [password, setPassword] = useState('');
	const [value, setValue] = useState<string | null>(null);
	const [reveal, { isLoading, error, reset }] = useRevealSecretMutation();
	const { copy, copied } = useClipboard({ value: value || '' });
	const iconSize = size === 'xs' ? 13 : 14;

	// Shown for a minute, then hidden again; a new record hides it at once.
	useEffect(() => {
		if (value === null) return;
		const t = setTimeout(() => setValue(null), SHOWN_FOR_MS);
		return () => clearTimeout(t);
	}, [value]);
	useEffect(() => setValue(null), [id, field]);

	const open = () => {
		reset();
		setPassword('');
		setAsking(true);
	};
	const submit = async () => {
		if (!password || !id) return;
		try {
			const res = await reveal({ path, id, field, password }).unwrap();
			setValue(res.value ?? '');
			setAsking(false);
			setPassword('');
		} catch {
			// Shown under the input.
		}
	};
	const stop = (e: { stopPropagation: () => void }) => e.stopPropagation();

	const iconButton = (labelText: string, icon: ReactNode, onClick: () => void) => (
		<IconButton
			size='2xs'
			variant='ghost'
			flexShrink={0}
			color='fg.muted'
			_hover={{ color: 'fg', bg: 'bg.muted' }}
			aria-label={labelText}
			title={labelText}
			onClick={onClick}>
			{icon}
		</IconButton>
	);

	return (
		<Box
			as='span'
			display='inline-flex'
			alignItems='center'
			gap={1}
			minW={0}
			onClick={stop}
			onKeyDown={(e: KeyboardEvent) => e.stopPropagation()}>
			<Text
				as='span'
				fontSize={size === 'xs' ? '12px' : '13px'}
				fontFamily={value !== null ? 'mono' : undefined}
				letterSpacing={value !== null ? undefined : '0.12em'}
				color={value !== null ? 'fg' : 'fg.muted'}
				truncate
				userSelect={value !== null ? 'text' : 'none'}>
				{value === null ? MASK : value || 'Not set'}
			</Text>
			{value === null
				? id && iconButton('Reveal', <Eye size={iconSize} />, open)
				: iconButton('Hide', <EyeOff size={iconSize} />, () => setValue(null))}
			{!!value && iconButton(copied ? 'Copied' : 'Copy', copied ? <Check size={iconSize} /> : <Copy size={iconSize} />, copy)}

			<Dialog.Root
				placement='center'
				size='sm'
				open={asking}
				onOpenChange={e => !e.open && setAsking(false)}>
				<Portal>
					<Dialog.Backdrop />
					<Dialog.Positioner>
						<Dialog.Content
							borderRadius={radius.MODAL}
							bg='bg.panel'
							borderWidth='1px'
							borderColor='border'>
							<Dialog.Header
								px={{ base: 4, md: 6 }}
								pt={{ base: 4, md: 5 }}
								pb={2}>
								<Dialog.Title fontSize='16px'>Enter your password</Dialog.Title>
								<Dialog.CloseTrigger asChild>
									<CloseButton size='sm' />
								</Dialog.CloseTrigger>
							</Dialog.Header>
							<Dialog.Body
								px={{ base: 4, md: 6 }}
								pt={0}
								pb={{ base: 4, md: 5 }}>
								<Flex
									direction='column'
									gap={3}>
									<Text
										fontSize='13px'
										color='fg.muted'>
										{label ? `${label} is` : 'This is'} stored encrypted. To see it, confirm it’s you with the password you sign in with.
									</Text>
									<Input
										size='sm'
										type='password'
										autoFocus
										autoComplete='current-password'
										placeholder='Your password'
										value={password}
										onChange={e => setPassword(e.target.value)}
										onKeyDown={e => e.key === 'Enter' && submit()}
									/>
									{error && (
										<Text
											fontSize='12.5px'
											color='red.fg'>
											{errorOf(error)}
										</Text>
									)}
									<Link
										href={docsPath('/docs/builder#models-password')}
										target='_blank'
										rel='noopener noreferrer'
										display='inline-flex'
										alignItems='center'
										gap={1}
										fontSize='xs'
										color='fg.muted'
										_hover={{ color: 'fg', textDecoration: 'underline' }}>
										How this works
										<ExternalLink size={11} />
									</Link>
								</Flex>
							</Dialog.Body>
							<ModalFooter>
								<Button
									px={3}
									size='sm'
									variant='outline'
									onClick={() => setAsking(false)}>
									Cancel
								</Button>
								<Button
									px={3}
									size='sm'
									loading={isLoading}
									disabled={!password}
									onClick={submit}>
									Reveal
								</Button>
							</ModalFooter>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog.Root>
		</Box>
	);
};

export default RevealSecret;
