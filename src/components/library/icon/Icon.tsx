'use client';
import React, { FC } from 'react';
import { IoIosHome, IoIosAddCircleOutline } from 'react-icons/io';
import { IoAdd } from 'react-icons/io5';
import { TbSelector } from 'react-icons/tb';
import { BsCalendar2Date } from 'react-icons/bs';
import colors from '@/theme/colors.theme';
import { useColorModeValue } from '@chakra-ui/react';
import { TbArrowForward } from 'react-icons/tb';
import { TbSettings } from 'react-icons/tb';
import { LuImagePlus } from 'react-icons/lu';
import { GoHomeFill } from 'react-icons/go';
import { ImPriceTag } from 'react-icons/im';
import { BiSolidCategory } from 'react-icons/bi';
import { TbFileInvoice } from 'react-icons/tb';
import { MdBrandingWatermark } from 'react-icons/md';
import { RiCoupon2Fill } from 'react-icons/ri';
import { FaUserFriends } from 'react-icons/fa';
import { FaUserTag } from 'react-icons/fa';
import { FaUnlockKeyhole } from 'react-icons/fa6';
import { TbTruckDelivery } from 'react-icons/tb';
import { RiSettings3Fill } from 'react-icons/ri';
import { FaTable } from 'react-icons/fa6';
import { TiPrinter } from 'react-icons/ti';
import { IoMdBarcode } from 'react-icons/io';
import { CiMenuBurger } from 'react-icons/ci';
import { GrSubtract } from 'react-icons/gr';
import { SiCkeditor4 } from 'react-icons/si';
import { FaRegEdit } from 'react-icons/fa';
import { MdFastfood } from 'react-icons/md';
import { BsCollectionFill } from 'react-icons/bs';
import { FcFeedback } from 'react-icons/fc';
import { MdFeedback } from 'react-icons/md';
import { FaRegClock } from 'react-icons/fa6';
import { BsThreeDots } from 'react-icons/bs';
import { MdOutlineCancel } from 'react-icons/md';
import { MdOutlineEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { HiUserGroup } from 'react-icons/hi';
// import { IoMdBarcode } from 'react-icons/io';
import { FaCartShopping } from 'react-icons/fa6';
import { IoStorefront } from 'react-icons/io5';
import { BiSolidBookContent } from 'react-icons/bi';
import { BiSolidReport } from 'react-icons/bi';
import { FaMoneyCheckAlt } from 'react-icons/fa';
import { TbBrandPatreonFilled } from 'react-icons/tb';
import { GiBuyCard } from 'react-icons/gi';
import { FaTruck } from 'react-icons/fa';
import { FaCircleInfo } from 'react-icons/fa6';

export type IconNameOptions =
	| 'add'
	| 'add-image'
	| 'add-tag'
	| 'arrow'
	| 'barcode'
	| 'brand'
	| 'brand-alt'
	| 'cart'
	| 'category'
	| 'clock-outline'
	| 'close'
	| 'collections'
	| 'content'
	| 'coupon'
	| 'customer'
	| 'customers'
	| 'dashboard'
	| 'date'
	| 'delete'
	| 'delivery'
	| 'delivery-fill'
	| 'dots'
	| 'edit'
	| 'expense'
	| 'expense-categories'
	| 'feedback'
	| 'feedbacks'
	| 'fields'
	| 'home'
	| 'items'
	| 'info'
	| 'leave'
	| 'menu'
	| 'order'
	| 'pos'
	| 'product'
	| 'purchase'
	| 'report'
	| 'role'
	| 'select'
	| 'settings'
	| 'settings-fill'
	| 'shop'
	| 'store'
	| 'subtract'
	| 'user';

type IconProps = {
	size?: number;
	color?: string;
	name: IconNameOptions;
};

const icons: any = {
	arrow: TbArrowForward,
	add: IoAdd,
	subtract: GrSubtract,
	date: BsCalendar2Date,
	select: TbSelector,
	settings: TbSettings,
	'add-tag': IoIosAddCircleOutline,
	home: GoHomeFill,
	'add-image': LuImagePlus,
	product: ImPriceTag,
	dashboard: IoIosHome,
	category: BiSolidCategory,
	order: TbFileInvoice,
	brand: MdBrandingWatermark,
	coupon: RiCoupon2Fill,
	user: FaUserFriends,
	customer: FaUserTag,
	role: FaUnlockKeyhole,
	delivery: TbTruckDelivery,
	'settings-fill': RiSettings3Fill,
	fields: FaTable,
	pos: TiPrinter,
	barcode: IoMdBarcode,
	menu: CiMenuBurger,
	leave: SiCkeditor4,
	edit: MdOutlineEdit,
	items: MdFastfood,
	collections: BsCollectionFill,
	feedback: FcFeedback,
	feedbacks: MdFeedback,
	'clock-outline': FaRegClock,
	dots: BsThreeDots,
	close: MdOutlineCancel,
	delete: MdDelete,
	customers: HiUserGroup,
	cart: FaCartShopping,
	store: IoStorefront,
	shop: IoStorefront,
	content: BiSolidBookContent,
	report: BiSolidReport,
	expense: FaMoneyCheckAlt,
	'brand-alt': TbBrandPatreonFilled,
	purchase: GiBuyCard,
	'delivery-fill': FaTruck,
	info: FaCircleInfo,
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
