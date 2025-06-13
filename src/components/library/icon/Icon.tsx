'use client';
import React, { FC } from 'react';
import { BsBuildingsFill, BsCalendar2Date, BsCollectionFill, BsThreeDots } from 'react-icons/bs';
import colors from '@/theme/colors.theme';
import { useColorModeValue } from '@chakra-ui/react';
import { TbArrowForward, TbDownload, TbSettings, TbSelector } from 'react-icons/tb';
import {
	LuAlignEndVertical,
	LuAlignHorizontalJustifyCenter,
	LuAlignHorizontalJustifyEnd,
	LuAlignHorizontalJustifyStart,
	LuAlignHorizontalSpaceAround,
	LuAlignStartVertical,
	LuAlignVerticalJustifyCenter,
	LuImagePlus,
} from 'react-icons/lu';
import { DiNpm } from 'react-icons/di';

import { TbFileInvoice, TbTruckDelivery, TbBrandPatreonFilled, TbFileExport } from 'react-icons/tb';
import {
	FaTruck,
	FaTshirt,
	FaDesktop,
	FaCheckCircle,
	FaPenAlt,
	FaRegEnvelope,
	FaUserFriends,
	FaUserTag,
	FaMapMarkerAlt,
	FaGitSquare,
	FaFacebookSquare,
} from 'react-icons/fa';

import { RiSettings3Fill, RiDiscountPercentFill, RiDeleteBinLine } from 'react-icons/ri';
import { TiPrinter } from 'react-icons/ti';
import {
	IoMdBarcode,
	IoIosArrowBack,
	IoMdAddCircleOutline,
	IoIosHome,
	IoIosAddCircleOutline,
	IoIosStar,
} from 'react-icons/io';
import {
	CiMenuBurger,
	CiStar,
	CiTextAlignCenter,
	CiTextAlignJustify,
	CiTextAlignLeft,
	CiTextAlignRight,
} from 'react-icons/ci';
import { GrSubtract, GrEdit } from 'react-icons/gr';
import { SiCkeditor4, SiGoogleanalytics } from 'react-icons/si';

import { FcFeedback } from 'react-icons/fc';
import {
	MdOutlineCancel,
	MdOutlineEdit,
	MdDelete,
	MdFeedback,
	MdFastfood,
	MdLocalPhone,
	MdInventory,
	MdSpaceDashboard,
	MdBrandingWatermark,
	MdEmail,
	MdAlignHorizontalCenter,
	MdAlignHorizontalLeft,
	MdAlignHorizontalRight,
} from 'react-icons/md';
import { HiUserGroup } from 'react-icons/hi';
// import { IoMdBarcode } from 'react-icons/io';

import {
	IoStorefront,
	IoEye,
	IoEyeOff,
	IoAdd,
	IoBagOutline,
	IoGridOutline,
	IoSearchOutline,
} from 'react-icons/io5';

import {
	FaUnlockKeyhole,
	FaTable,
	FaRegClock,
	FaPeopleGroup,
	FaFileInvoiceDollar,
	FaCircleInfo,
	FaRegCopy,
	FaCartShopping,
	FaMoneyCheckDollar,
	FaAddressCard,
	FaFileLines,
	FaIdCardClip,
} from 'react-icons/fa6';
import { GoListUnordered, GoHomeFill } from 'react-icons/go';
import {
	HiMiniRocketLaunch,
	HiMiniDevicePhoneMobile,
	HiArrowUturnLeft,
	HiArrowUturnRight,
} from 'react-icons/hi2';

import {
	GiMoneyStack,
	GiClick,
	GiBuyCard,
	GiBrokenPottery,
	GiReturnArrow,
	GiDiscussion,
} from 'react-icons/gi';
import { PiUserListFill, PiArticleMediumFill } from 'react-icons/pi';
import { AiOutlineThunderbolt } from 'react-icons/ai';

import {
	BiSolidCategory,
	BiSortAZ,
	BiSolidBookContent,
	BiSolidReport,
	BiTransferAlt,
} from 'react-icons/bi';

import { RxSpaceBetweenHorizontally, RxSpaceEvenlyHorizontally } from 'react-icons/rx';
import iconOptionsArrayData from './iconOptionsArrayData';

export type IconNameOptions = (typeof iconOptionsArrayData)[number];

type IconProps = {
	size?: number;
	color?: string;
	name: IconNameOptions;
};

const icons: any = {
	// dashboard: MdSpaceDashboard,
	repo: FaGitSquare,
	email: MdEmail,
	facebook: FaFacebookSquare,
	document: FaFileLines,
	employee: FaIdCardClip,
	meeting: GiDiscussion,
	npm: DiNpm,
	invoice: FaFileInvoiceDollar,
	author: FaPenAlt,
	blog: PiArticleMediumFill,
	views: SiGoogleanalytics,
	analytics: SiGoogleanalytics,
	'action-menu': GoListUnordered,
	clicks: GiClick,
	add: IoAdd,
	'add-circle': IoMdAddCircleOutline,
	'add-image': LuImagePlus,
	'add-tag': IoIosAddCircleOutline,
	arrow: TbArrowForward,
	'arrow-left': IoIosArrowBack,
	barcode: IoMdBarcode,
	brand: MdBrandingWatermark,
	'brand-alt': TbBrandPatreonFilled,
	cart: FaCartShopping,
	category: BiSolidCategory,
	check: FaCheckCircle,
	close: MdOutlineCancel,
	clock: FaRegClock,
	'clock-outline': FaRegClock,
	collections: BsCollectionFill,
	content: BiSolidBookContent,
	copy: FaRegCopy,
	customer: FaUserTag,
	customers: HiUserGroup,
	damage: GiBrokenPottery,
	dashboard: MdSpaceDashboard,
	date: BsCalendar2Date,
	delete: MdDelete,
	'delete-builder': RiDeleteBinLine,
	delivery: TbTruckDelivery,
	'delivery-fill': FaTruck,
	deploy: HiMiniRocketLaunch,
	desktop: FaDesktop,
	discount: RiDiscountPercentFill,
	dots: BsThreeDots,
	download: TbDownload,
	edit: MdOutlineEdit,
	'edit-builder': GrEdit,
	envelope: FaRegEnvelope,
	expense: FaMoneyCheckDollar,
	'export-doc': TbFileExport,
	eye: IoEye,
	'eye-off': IoEyeOff,
	feedback: FcFeedback,
	feedbacks: MdFeedback,
	fields: FaTable,
	home: GoHomeFill,
	info: FaCircleInfo,
	inventory: MdInventory,
	items: MdFastfood,
	leave: SiCkeditor4,
	location: BsBuildingsFill,
	map: FaMapMarkerAlt,
	menu: CiMenuBurger,
	mobile: HiMiniDevicePhoneMobile,
	order: TbFileInvoice,
	payment: GiMoneyStack,
	pos: TiPrinter,
	phone: MdLocalPhone,
	product: FaTshirt,
	purchase: GiBuyCard,
	rating: IoIosStar,
	'rating-fill': IoIosStar,
	'rating-outline': CiStar,
	redo: HiArrowUturnRight,
	report: BiSolidReport,
	return: GiReturnArrow,
	role: FaUnlockKeyhole,
	search: IoSearchOutline,
	select: TbSelector,
	settings: TbSettings,
	'settings-fill': RiSettings3Fill,
	shop: IoStorefront,
	staff: FaPeopleGroup,
	store: IoStorefront,
	subtract: GrSubtract,
	supplier: PiUserListFill,
	thunder: AiOutlineThunderbolt,
	transfer: BiTransferAlt,
	undo: HiArrowUturnLeft,
	user: FaUserFriends,
	sort: BiSortAZ,

	//zhoei icons
	'z-cart': IoBagOutline,
	'z-grid': IoGridOutline,

	//alignment
	'align-left': MdAlignHorizontalLeft,
	'align-center': MdAlignHorizontalCenter,
	'align-right': MdAlignHorizontalRight,

	//justify
	'justify-start': LuAlignHorizontalJustifyStart,
	'justify-end': LuAlignHorizontalJustifyEnd,
	'justify-center': LuAlignHorizontalJustifyCenter,
	'justify-space-between': RxSpaceBetweenHorizontally,
	'justify-space-around': LuAlignHorizontalSpaceAround,
	'justify-space-evenly': RxSpaceEvenlyHorizontally,

	//flex align
	'flex-start': LuAlignStartVertical,
	'flex-end': LuAlignEndVertical,
	'flex-center': LuAlignVerticalJustifyCenter,

	//text align
	'text-align-left': CiTextAlignLeft,
	'text-align-right': CiTextAlignRight,
	'text-align-center': CiTextAlignCenter,
	'text-align-justify': CiTextAlignJustify,
};

const Icon: FC<IconProps> = ({ name, ...props }) => {
	const IconComponent = icons[name] || IoIosHome;
	const brandColor = useColorModeValue(colors.brand.light, colors.brand.dark);
	const defaultColor = useColorModeValue('#4a4a4a', 'white');
	return (
		<IconComponent
			size={props.size}
			color={name == 'arrow' ? brandColor : props.color ? props.color : defaultColor}
			{...props}
		/>
	);
};

export default Icon;
