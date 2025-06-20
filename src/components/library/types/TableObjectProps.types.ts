import { SelectDataType, PromptType, TableObjectDataProps } from '.';
import { MenuItem } from './table';

type CommonTableProps = {
	title: string;
	subTitle?: string;
	path: string;
	filters?: boolean;
	button?: ButtonType;
	pagination?: boolean;
	clickable?: boolean;
	toPath?: string;
	isModal?: boolean;
	invalidate?: any;
	createModel?: any;
	export?: boolean;
	menu?: MenuItem[];
	select?: SelectDataType;
	preferences?: any;
	hidePreferences?: boolean;
	search?: boolean;
	showMenu?: boolean;
	topPagination?: boolean;
	limit?: number;
	preFilters?: any;
};

export type TableObjectProps = CommonTableProps & {
	data: TableObjectDataProps[];
};

export type BackendTableObjectProps = CommonTableProps & { fields: string[] };
export type ServerTableObjectProps = CommonTableProps;

type CommonButton = {
	title: string;
	icon?: string;
	path?: never;
	isModal?: true;
	dataModel?: any;
	layout?: any;
};

type RedirectButton = {
	title: string;
	icon?: string;
	path: string;
	isModal?: never;
	dataModel?: never;
	prompt?: never;
	layout?: any;
};

type ModalButton = {
	title: string;
	icon?: string;
	path?: never;
	isModal: true;
	dataModel: any;
	prompt?: PromptType;
	layout?: any;
};

type ButtonType = CommonButton | RedirectButton | ModalButton;
