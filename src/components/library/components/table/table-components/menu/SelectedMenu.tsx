import { FC } from 'react';
import { Menu, Button, Portal } from '@chakra-ui/react';

import {
	EditManyModal,
	SendBulkSmsModal,
	CalculateModal,
	EditManySelectModal,
	EditDataSelectModal,
} from '../../table-components/modals';

import { Icon } from '../../../../icon';
import { ArchiveRows, DeleteRows, DuplicateRows, StatusRows } from '../bulk/RowActions';
import CompareRows from '../bulk/CompareRows';
import MergeRows from '../bulk/MergeRows';
import { ExportRows, PrintRows } from '../bulk/ExportRows';
import { MenuContainer } from '../../../../menu';

type TableMenuProps = {
	path: string;
	data: any;
	hide: boolean;
	items: any[];
	/** The route's config: status and archive settings for those actions. */
	route?: any;
};

const SelectedMenu: FC<TableMenuProps> = ({ path, hide, data, items, route }) => {
	if (hide) return null;

	return (
		// The bulk actions' dialogs are rendered inside the menu's items. Chakra's
		// Menu unmounts its content when it closes (lazyMount + unmountOnExit by
		// default), which took the dialog an item just opened with it — Calculate,
		// Edit and the rest opened for a moment or not at all. Mounted once, kept.
		<Menu.Root unmountOnExit={false}>
			<Menu.Trigger
				as={Button}
				{...buttonCss}
				leftIcon={<Icon name='action-menu' />}>
				Menu
			</Menu.Trigger>
			<Portal>
				<MenuContainer>
					{data?.map((item: any, i: number) => {
						const bulkProps = { path, items, title: item?.title, route };
						// `key` goes on each element directly: React warns when it's spread in.
						const commonProps = {
							path,
							items,
							title: item?.title,
							prompt: item?.prompt,
							keyType: item?.keyType,
							icon: item?.icon,
						};

						switch (item.type) {
							case 'calculate':
								return (
									<CalculateModal
										key={i}
										{...commonProps}
										keys={item?.key}
										value={item?.value}
									/>
								);
							case 'edit':
								return (
									<EditManyModal
										key={i}
										{...commonProps}
										keys={item?.key}
										value={item?.value}
									/>
								);
							case 'update-api':
								return (
									<EditManyModal
										key={i}
										{...commonProps}
										keys={item?.key}
										value={item?.value}
									/>
								);

							case 'edit-select':
								return (
									<EditManySelectModal
										key={i}
										{...commonProps}
										keys={item?.key}
										options={item?.options}
									/>
								);
							case 'edit-many':
								return (
									<EditManySelectModal
										key={i}
										{...commonProps}
										keys={item?.key}
										options={item?.options}
									/>
								);
							// Columns, format (Excel / CSV / PDF), ticked rows or every matching row.
							case 'export':
								return (
									<ExportRows
										key={i}
										{...bulkProps}
									/>
								);
							case 'delete-many':
								return (
									<DeleteRows
										key={i}
										{...bulkProps}
									/>
								);
							case 'duplicate-many':
								return (
									<DuplicateRows
										key={i}
										{...bulkProps}
									/>
								);
							case 'archive':
								return route?.archive ? (
									<ArchiveRows
										key={i}
										{...bulkProps}
									/>
								) : null;
							case 'change-status':
								return (
									<StatusRows
										key={i}
										{...bulkProps}
									/>
								);
							case 'compare':
								return (
									<CompareRows
										key={i}
										{...bulkProps}
									/>
								);
							case 'merge':
								return (
									<MergeRows
										key={i}
										{...bulkProps}
									/>
								);
							case 'print':
								return (
									<PrintRows
										key={i}
										{...bulkProps}
									/>
								);
							case 'marketing-sms':
								return (
									<SendBulkSmsModal
										key={i}
										ids={items}
										path={path}
									/>
								);
							case 'edit-data-select':
								return (
									<EditDataSelectModal
										key={i}
										{...commonProps}
										dataModel={item?.dataModel}
										keys={item?.key}
										dataPath={item?.dataPath}
									/>
								);
							default:
								return null;
						}
					})}
				</MenuContainer>
			</Portal>
		</Menu.Root>
	);
};

const buttonCss: any = {
	variant: 'white',
	size: 'xs',
	h: '32px',
	pl: 2,
};

export default SelectedMenu;
