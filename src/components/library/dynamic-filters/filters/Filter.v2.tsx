'use client';

import { Flex, FlexProps } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';

import { Icon, shadow } from '../..';

type FilterProps = FlexProps & {
	children: ReactNode;
	isActive?: boolean;
	onCancel?: any;
};

/**
 * A filter chip. It used to be a dashed #ebebeb hairline over a transparent
 * background — on a near-white page that read as decoration, not as something
 * you could click, and the "active" state was only a shade away from it.
 *
 * Now the idle chip sits on its own panel surface with a solid border and a
 * hairline shadow, the same way the search field and refresh button do, and the
 * active chip inverts so a filter that's narrowing the table is unmistakable.
 */
const Filter: FC<FilterProps> = ({ children, isActive = false, onCancel, ...props }) => {
	// `field.border`/`field.borderHover` — the same tokens the search input and
	// every other field-styled control next to this chip already use. An
	// earlier pass tried `border.muted` (#ebebeb) and found it read as
	// decoration on a near-white page; the panel fill plus hairline shadow
	// below already do that contrast job, so the border itself just needs to
	// match its neighbors instead of standing out from them.
	const idle: FlexProps = {
		bg: 'bg.panel',
		borderColor: 'field.border',
		color: 'fg',
		boxShadow: shadow.SUBTLE,
		_hover: {
			bg: 'bg.subtle',
			borderColor: 'field.borderHover',
		},
	};

	const active: FlexProps = {
		bg: 'bg.inverted',
		borderColor: 'bg.inverted',
		color: 'fg.inverted',
		boxShadow: shadow.SUBTLE,
		_hover: { opacity: 0.88 },
	};

	return (
		<Flex
			userSelect='none'
			cursor='pointer'
			borderRadius='full'
			borderWidth='1px'
			borderStyle='solid'
			fontWeight='500'
			transitionProperty='background-color, border-color, color, opacity'
			transitionDuration='120ms'
			_focusVisible={{
				outline: '2px solid',
				outlineColor: 'field.focusRing',
				outlineOffset: '1px',
			}}
			{...(isActive ? active : idle)}
			fontSize='13px'
			mr={1}
			mb={1}
			h='30px'
			px={2.5}
			gap={1.5}
			alignItems='center'
			display='inline-flex'
			{...props}>
			{!isActive && (
				// currentColor, so the icons track whichever fill the chip is on.
				<Icon
					color='currentColor'
					name='config'
					size={14}
				/>
			)}
			<Flex
				fontSize='13px'
				fontWeight={isActive ? '600' : '500'}
				whiteSpace='nowrap'>
				{children}
			</Flex>
			{isActive && (
				<Flex
					onClick={onCancel}
					align='center'
					borderRadius='full'
					opacity={0.75}
					_hover={{ opacity: 1 }}>
					<Icon
						color='currentColor'
						name='close'
						size={15}
					/>
				</Flex>
			)}
		</Flex>
	);
};

export default Filter;
