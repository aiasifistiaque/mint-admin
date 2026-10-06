'use client';

import { FC, useEffect, useState } from 'react';
import { Box, Button, Dialog, Flex, Input, Portal, Switch, Text, Textarea } from '@chakra-ui/react';
import { radius, ModalFooter, DiscardButton, UploadModal } from '@/components/library';
import { Dropdown } from '@/components/library/cl';
import type { SbPage, SbPageInput, SbSeo } from '@/components/library/store/services/siteBuilderApi';
import { Field } from './PropInputs';
import SiteGuide from './SiteGuide';

/**
 * A page's own settings (docs/site-builder #pages): name, address, menu,
 * layout and SEO. With no page, it adds a blank one.
 */

type Props = {
	open: boolean;
	page: SbPage | null;
	layouts: string[];
	saving: boolean;
	onClose: () => void;
	onSave: (input: SbPageInput) => void;
};

const slug = (s: string) =>
	s
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 60);

const EMPTY_SEO: SbSeo = { title: '', description: '', image: '', noIndex: false, canonical: '', keywords: [] };

const PageDialog: FC<Props> = ({ open, page, layouts, saving, onClose, onSave }) => {
	const isNew = !page;
	const [name, setName] = useState('');
	const [path, setPath] = useState('');
	const [pathTouched, setPathTouched] = useState(false);
	const [showInMenu, setShowInMenu] = useState(false);
	const [menuLabel, setMenuLabel] = useState('');
	const [priority, setPriority] = useState(0);
	const [layout, setLayout] = useState('default');
	const [seo, setSeo] = useState<SbSeo>(EMPTY_SEO);
	const [tried, setTried] = useState(false);

	useEffect(() => {
		if (!open) return;
		setName(page?.name || '');
		setPath(page?.path || '');
		setPathTouched(!!page);
		setShowInMenu(!!page?.showInMenu);
		setMenuLabel(page?.menuLabel || '');
		setPriority(page?.priority || 0);
		setLayout(page?.layout || 'default');
		setSeo({ ...EMPTY_SEO, ...(page?.draft.seo || {}) });
		setTried(false);
		// Only when it opens, or for another page — not on every refresh of the same one.
	}, [open, page?.id]); // eslint-disable-line react-hooks/exhaustive-deps

	const pathOk = /^\/$|^(\/[a-z0-9][a-z0-9-]{0,79}){1,6}$/.test(path);
	const save = () => {
		setTried(true);
		if (!name.trim() || !pathOk) return;
		onSave({ name: name.trim(), path, showInMenu, menuLabel: menuLabel.trim(), priority, layout, seo });
	};
	const set = (patch: Partial<SbSeo>) => setSeo(s => ({ ...s, ...patch }));

	return (
		<Dialog.Root
			placement='top'
			size='md'
			open={open}
			onOpenChange={e => !e.open && !saving && onClose()}>
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
							pb={3}>
							<Flex
								align='center'
								justify='space-between'
								gap={3}
								w='full'>
								<Dialog.Title fontSize='16px'>{isNew ? 'Add a page' : `${page?.name}: settings`}</Dialog.Title>
								<SiteGuide section='pages' />
							</Flex>
						</Dialog.Header>
						<Dialog.Body
							px={{ base: 4, md: 6 }}
							pt={0}
							pb={5}>
							<Flex
								direction='column'
								gap={4}>
								<Field
									title='Name'
									help='Shown in the panel, and in the menu unless you give it a menu label.'>
									<Input
										size='sm'
										autoFocus
										value={name}
										maxLength={80}
										placeholder='e.g. About us'
										onChange={e => {
											setName(e.target.value);
											if (!pathTouched && isNew) setPath(`/${slug(e.target.value) || ''}`);
										}}
									/>
									{tried && !name.trim() && (
										<Text
											fontSize='12px'
											color='red.fg'
											mt={1}>
											Give the page a name.
										</Text>
									)}
								</Field>
								<Field
									title='Address'
									help={page?.isHome ? 'The home page is always at /.' : 'Lowercase letters, digits and dashes, like /about or /services/cleaning.'}>
									<Input
										size='sm'
										fontFamily='mono'
										value={path}
										readOnly={!!page?.isHome}
										onChange={e => {
											setPathTouched(true);
											setPath(e.target.value.trim().toLowerCase());
										}}
									/>
									{tried && !pathOk && (
										<Text
											fontSize='12px'
											color='red.fg'
											mt={1}>
											An address starts with / and has lowercase letters, digits and dashes.
										</Text>
									)}
								</Field>
								<Flex
									gap={4}
									wrap='wrap'
									align='flex-end'>
									<Switch.Root
										size='sm'
										checked={showInMenu}
										onCheckedChange={e => setShowInMenu(!!e.checked)}>
										<Switch.HiddenInput />
										<Switch.Control />
										<Switch.Label fontSize='13px'>Show in the menu</Switch.Label>
									</Switch.Root>
									{showInMenu && (
										<Box flex={1}>
											<Field title='Menu label'>
												<Input
													size='sm'
													value={menuLabel}
													maxLength={40}
													placeholder={name || 'Same as the name'}
													onChange={e => setMenuLabel(e.target.value)}
												/>
											</Field>
										</Box>
									)}
									<Box w='110px'>
										<Field title='Order'>
											<Input
												size='sm'
												type='number'
												value={priority}
												onChange={e => setPriority(Math.max(-1000, Math.min(1000, Math.round(Number(e.target.value) || 0))))}
											/>
										</Field>
									</Box>
								</Flex>
								<Field
									title='Header and footer'
									help='“None” suits landing pages that stand on their own.'>
									<Dropdown
										size='sm'
										value={layout}
										onChange={setLayout}
										items={[...layouts.map(l => ({ value: l, label: l === 'default' ? 'The site’s header and footer' : l })), { value: 'none', label: 'None' }]}
									/>
								</Field>

								<Box
									pt={3}
									borderTopWidth='1px'>
									<Text
										fontSize='13px'
										fontWeight='600'
										mb={3}>
										Search engines and sharing
									</Text>
									<Flex
										direction='column'
										gap={3}>
										<Field
											title='Title'
											help='Empty: the page’s name. The title template in Site setup → SEO is added on every page but the home page.'>
											<Input
												size='sm'
												value={seo.title}
												maxLength={200}
												onChange={e => set({ title: e.target.value })}
											/>
										</Field>
										<Field
											title='Description'
											help='One or two sentences shown under the title in search results. Empty: the site’s default.'>
											<Textarea
												size='sm'
												rows={2}
												value={seo.description}
												maxLength={500}
												onChange={e => set({ description: e.target.value })}
											/>
										</Field>
										<Field
											title='Share image'
											help='Shown when the page’s link is shared. Empty: the site’s default.'>
											<Flex
												gap={2}
												align='center'>
												<Input
													size='sm'
													value={seo.image}
													placeholder='https://…'
													onChange={e => set({ image: e.target.value.trim() })}
												/>
												<UploadModal
													fileType='image'
													title='Choose a share image'
													handleImage={(url: string) => url && set({ image: url })}>
													<Button
														size='xs'
														variant='outline'>
														Choose
													</Button>
												</UploadModal>
											</Flex>
										</Field>
										<Field
											title='Canonical address'
											help='Only if this page’s content lives at another address too.'>
											<Input
												size='sm'
												value={seo.canonical}
												placeholder='https://…'
												onChange={e => set({ canonical: e.target.value.trim() })}
											/>
										</Field>
										<Switch.Root
											size='sm'
											checked={seo.noIndex}
											onCheckedChange={e => set({ noIndex: !!e.checked })}>
											<Switch.HiddenInput />
											<Switch.Control />
											<Switch.Label fontSize='13px'>Hide from search engines</Switch.Label>
										</Switch.Root>
									</Flex>
								</Box>
							</Flex>
						</Dialog.Body>
						<ModalFooter>
							<DiscardButton
								size='sm'
								onClick={onClose}
								disabled={saving}>
								Cancel
							</DiscardButton>
							<Button
								size='sm'
								loading={saving}
								onClick={save}>
								{isNew ? 'Add page' : 'Save'}
							</Button>
						</ModalFooter>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
};

export default PageDialog;
