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
	item?: any;
	layout?: any;
	prompt?: {
		title?: string;
		body?: string;
		btnText?: string;
		successMsg?: string;
	};
};

export default CreateModalProps;
