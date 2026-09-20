import { VInput } from '@/components/library/utils/inputs';
import { registerFieldType } from '../registry';
import { NotYetImplementedCell, NotYetImplementedView } from './_shared';

const NumberInput = ({ item, isRequired, type, ...props }: any) => (
	<VInput
		type={type || 'number'}
		isRequired={isRequired}
		helper={item?.helper}
		{...props}
	/>
);

registerFieldType({
	id: 'number',
	family: 'number',
	input: NumberInput,
	changeMode: 'event',
	emptyValue: () => undefined,
	supportsInlineEdit: true,
	table: { type: 'number', cell: NotYetImplementedCell, align: 'end' },
	view: { type: 'string', render: NotYetImplementedView, layout: 'inline' },
	storage: 'number',
});
