'use client';
//fundtions and hooks

export {
	useAppDispatch,
	useAppSelector,
	useAuth,
	useCustomToast,
	useRedirect,
	useIsMobile,
	useFormData,
} from './hooks';

export { generateFormSections, getFieldValue, formatDataKey } from './functions';

export {
	TOKEN_NAME,
	REFRESH_TOKEN,
	STORE,
	CART_NAME,
	PLACEHOLDER_IMAGE,
	URL,
	currency,
	sizes,
	shadow,
	padding,
	zIndex,
	BASE_LIMIT,
	sidebarData,
	THEME,
} from './config';

export * as theme from './config';

export type ThemeProps = {
	TABLE: any;
	SIDEBAR: any;
};

//components
export {
	SpaceBetween,
	Column,
	Form,
	FormContainer,
	FormRow,
	FormSection,
	ModalFormSection,
} from './containers';

export { default as Icon } from './icon/Icon';

export { AuthWrapper, NotLoggedIn } from './wrappers';

export { SelfMenu, CreateMenu, MenuContainer, ModalContainer, CustomMenuitem } from './menu';
export { ColorMode, Toast, PopoverHeader, PopoverContainer, Pagination } from './components';

export {
	Navbar,
	Sidebar,
	Body,
	CreateNav,
	CreateBody,
	SidebarItem,
	SideDrawer,
	Layout,
	LayoutWrapper,
} from './nav';

export {
	FilterInput,
	FilterSelect,
	HInput,
	HPassword,
	InputContainer,
	ItemSelect,
	VCheckbox,
	VDataMenu,
	VDataSelect,
	VDataTags,
	VImage,
	VSelect,
	VTags,
	VTextarea,
	VSwitch,
	ViewOnly,
	SelectContainer,
	VInput,
	NoDataFound,
} from './utils/inputs';

export { default as Count } from './stat/Count';

export { Details, DetailItem } from './detail';
export { default as HeadingMenu } from './settings/heading-menu/HeadingMenu';

export { default as PageTable } from './pages/page-tables/PageTable';

export type {
	TableObjectDataProps,
	ViewModalDataModelProps,
	TableObjectProps,
	InputDataType,
	ModelType,
	InputData,
	CustomTableProps,
	SidebarItemType,
	TableItemProps,
	TableDataProps,
} from './types';

export {
	CustomTable,
	Headers,
	PageHeading,
	TableRowComponent,
	ResultContainer,
	PopModal,
	PopModalHeader,
	PopModalBody,
	PopModalFooter,
	PopModalCloseButton,
	TableHead,
	TableHeading,
	Title,
	TableSkeleton,
	TableSearch,
	TableRow,
	TableRefresh,
	Preferences,
	PosResultContainer,
	StickyBottomContainer,
	FilterContainer,
	SelectedItemsContainer,
	TableContainer,
	TableSearchContainer,
	TableSettingsMenuContainer,
	CustomTd,
	TableData,
	TableDateData,
	TableSelectItem,
	EditableTableData,
	TableMenu,
	MenuModalHeader,
	MenuModalBody,
	MenuModalCloseButton,
	MenuModalFooter,
	MenuModalOverlay,
	MenuModalContent,
	MenuModal,
	RowContainerBase,
	RowContainerMd,
	RowInput,
	RowSelect,
	ViewItemModal,
	DeleteItemModal,
	TableErrorMessage,
} from './components/table';

export {
	BooleanFilter,
	Filter,
	IsActiveFilter,
	MultiSelectFilter,
	SelectFilter,
	DateFilter,
	RangeFilter,
} from './dynamic-filters/filters';

export { default as DynamicFilters } from './dynamic-filters/DynamicFilters';

export { FormContent, FormDivision, FormInput, FormPage, FormItem } from './create-page';

export {
	SquareButton,
	AddImageButton,
	EditImageButton,
	FilterButton,
	DiscardButton,
} from './components/buttons';

export {
	UploadModal,
	CreateModal,
	UpdatePasswordModal,
	ModalContent,
	ModalHeader,
	ModalFooter,
} from './modals';

export { Label, HelperText } from './form';
export { OrderModal } from './pos';
