'use client';

import React, { FC } from 'react';
import {
	Flex,
	Heading,
	useMediaQuery,
	FlexProps,
	Button,
	IconButton,
	withDefaultVariant,
} from '@chakra-ui/react';

import {
	useIsMobile,
	AuthWrapper,
	SpaceBetween,
	padding,
	sizes,
	useAppDispatch,
	ColorMode,
	Body,
	Column,
	LayoutWrapper,
	THEME,
	refresh,
	navigate,
	Align,
	Icon,
	EditorSidebar,
	useAppSelector,
	undo,
	redo,
	setDisplay,
} from '..';
import EditorNavbar from './EditorNavbar';
import { useUpdateContentMutation } from '../store/services/contentApi';
import { BiBorderRadius } from 'react-icons/bi';

const PX = { base: padding.BASE, md: padding.MD, lg: padding.LG };
const navbarStyleProps = {
	px: PX,
	w: { base: 'full', md: sizes.HOME_NAV_MAX_WIDTH },
	left: { base: 0, md: sizes.HOME_NAV_LEFT },
};

export type FlexPropsType = FlexProps & {
	children?: React.ReactNode;
};

type LayoutProps = FlexPropsType & {
	children: React.ReactNode;
	title: string;
	path?: string;
	type?: 'default' | 'pos';
	hideColorMode?: boolean;
	sidebarData?: any;
	data: any;
	dataPath: string;
};

const EditorLayout: FC<LayoutProps> = ({
	children,
	title,
	data,
	path = '/dashboard',
	hideColorMode = false,
	sidebarData,
	dataPath,
	...props
}) => {
	const dispatch = useAppDispatch();
	dispatch(navigate({ selected: path }));
	const [trigger, result] = useUpdateContentMutation();

	React.useEffect(() => {
		dispatch(refresh());
		dispatch(setDisplay('lg'));
	}, []);

	const { history, next, display } = useAppSelector(state => state.builder);
	const [isLargerThan800] = useMediaQuery('(min-width: 800px)');
	const type = isLargerThan800 ? (props?.type == 'pos' ? 'pos' : 'default') : 'pos';

	const isMobile = useIsMobile();
	const showMenu = isMobile || props?.type == 'pos';
	const navbarDataProps = { doc: data, sidebarData, showMenu };

	const handleUndo = () => {
		const formData = history[history?.length - 1];
		trigger({
			body: formData,
			path: dataPath,
			type: 'all',
		});
		dispatch(undo());
	};

	const largeDisplay = () => dispatch(setDisplay('lg'));
	const smallDisplay = () => dispatch(setDisplay('sm'));

	const handleRedo = () => {
		const formData = next[next?.length - 1];
		trigger({
			body: formData,
			path: 'hongo',
			type: 'all',
		});
		dispatch(redo());
	};

	const iconContainer = {
		borderRadius: 4,
		p: '2px',
		bg: '#eee',
		_dark: {
			bg: 'black',
		},
		h: '36px',
		align: 'center',
	};

	const iconStyle = {
		borderColor: 'transparent',
		variant: 'white',
		h: '32px',
		w: '44px',
		size: 'lg',
		borderRadius: 4,
		_hover: { bg: 'white' },
		_dark: {
			bg: 'navbar.dark',
			_hover: { bg: 'black' },
		},
	};

	return (
		<AuthWrapper>
			<LayoutWrapper>
				<EditorNavbar
					{...navbarStyleProps}
					{...navbarDataProps}>
					<SpaceBetween gap={4}>
						<Flex
							gap={2}
							align='center'>
							<Button
								isLoading={result.isLoading}
								onClick={handleUndo}
								isDisabled={history?.length < 1}
								variant='white'
								leftIcon={<Icon name='undo' />}>
								Undo
							</Button>
							<Flex {...iconContainer}>
								<IconButton
									{...iconStyle}
									aria-label='large display'
									onClick={largeDisplay}
									bg={display == 'lg' ? 'white' : '#eee'}
									_dark={{
										bg: display == 'lg' ? 'black' : '#333',
									}}
									borderRightRadius={0}
									icon={<Icon name='desktop' />}
								/>
								<IconButton
									{...iconStyle}
									aria-label='small display'
									onClick={smallDisplay}
									bg={display == 'sm' ? 'white' : '#eee'}
									_dark={{
										bg: display == 'sm' ? 'black' : '#333',
									}}
									borderLeftRadius={0}
									icon={<Icon name='mobile' />}
								/>
							</Flex>

							{/* <Button

								isLoading={result.isLoading}
								onClick={handleRedo}
								isDisabled={next.length < 1}
								variant='white'
								rightIcon={<Icon name='redo' />}>
								Redo
							</Button> */}
						</Flex>

						<Align gap={4}>
							<ColorMode
								size='20px'
								position='navbar'
							/>
						</Align>
					</SpaceBetween>
				</EditorNavbar>
				<Body
					_light={{
						bg: 'white',
					}}>
					{type == 'default' && (
						<EditorSidebar
							h='80vh'
							doc={data}
							data={sidebarData}
						/>
					)}
					<Flex
						flexDir='column'
						w='full'
						pl={type !== 'default' ? 0 : sizes.HOME_NAV_LEFT}
						{...props}>
						<Flex
							pt={props?.type == 'pos' ? 0 : type == 'pos' ? 12 : sizes.NAV_HEIGHT}
							flex={1}
							w='full'>
							<Main>{children}</Main>
						</Flex>
					</Flex>
				</Body>
				{!hideColorMode && <ColorMode />}
			</LayoutWrapper>
		</AuthWrapper>
	);
};

const Main = ({ children }: { children: React.ReactNode }) => (
	<Flex {...mainProps}>
		<Column
			pl={{ base: 0, md: 0 }}
			w='full'
			gap={4}>
			{children}
		</Column>
	</Flex>
);

const mainProps: FlexProps = {
	overflowY: 'hidden',
	h: `calc(100vh - ${sizes.NAV_HEIGHT})`,
	borderTopRightRadius: { base: `0`, md: THEME == 'basic' ? 0 : 'xl' },
	bg: { base: 'white', md: 'white' },
	_dark: { bg: 'background.dark', borderTopRightRadius: 0 },
	pb: '32px',
	w: 'full',
};

export default EditorLayout;
