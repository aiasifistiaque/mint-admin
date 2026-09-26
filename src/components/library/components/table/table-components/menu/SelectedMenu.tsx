import { FC } from 'react';
import { Menu, Button, Portal } from '@chakra-ui/react';

import {
	EditManyModal,
	ExportManyModal,
	SendBulkSmsModal,
	CalculateModal,
	EditManySelectModal,
	EditDataSelectModal,
} from '../../table-components/modals';

import { Icon } from '../../../../icon';
import { MenuContainer } from '../../../../menu';

type TableMenuProps = {
	path: string;
	data: any;
	hide: boolean;
	items: any[];
};

const SelectedMenu: FC<TableMenuProps> = ({ path, hide, data, items }) => {
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
							case 'export':
								return (
									<ExportManyModal
										key={i}
										ids={items}
										path={path}
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
