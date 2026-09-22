import { InputData } from '../..';

type CreateModalProps = {
	data: InputData<any>[];
	trigger?: any;
	path: string;
	type?: 'post' | 'update';
	id?: string;
	title?: string;
	invalidate?: any;
	children?: any;
	doc?: any;
	populate?: any;
	isMenu?: boolean;
	item?: any;
	icon?: string;
	layout?: any;
	prompt?: {
		title?: string;
		body?: string;
		btnText?: string;
		successMsg?: string;
	};
	// Controlled mode: when `open` is passed (even `false`), the dialog's open
	// state is driven by the caller instead of an internal useDisclosure, and no
	// trigger is rendered — used by TableMenu so the dialog lives outside the
	// dropdown menu's own mount lifecycle.
	open?: boolean;
	onClose?: () => void;
};

export default CreateModalProps;
