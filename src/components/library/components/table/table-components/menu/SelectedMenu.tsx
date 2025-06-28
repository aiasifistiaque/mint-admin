import { FC } from 'react';
import { Menu, MenuButton, Button } from '@chakra-ui/react';
import {
	MenuContainer,
	EditManyModal,
	EditManySelectModal,
	EditDataSelectModal,
	Icon,
	ExportManyModal,
	SendBulkSmsModal,
	CalculateModal,
} from '../../../..';

type TableMenuProps = {
	path: string;
	data: any;
	hide: boolean;
	items: any[];
};

const SelectedMenu: FC<TableMenuProps> = ({ path, hide, data, items }) => {
	if (hide) return null;

	return (
		<Menu>
			<MenuButton
				as={Button}
				{...buttonCss}
				leftIcon={<Icon name='action-menu' />}>
				Menu
			</MenuButton>
			<MenuContainer>
				{data?.map((item: any, i: number) => {
					const commonProps = {
						key: i,
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
									{...commonProps}
									keys={item?.key}
									value={item?.value}
								/>
							);
						case 'edit':
							return (
								<EditManyModal
									{...commonProps}
									keys={item?.key}
									value={item?.value}
								/>
							);
						case 'update-api':
							return (
								<EditManyModal
									{...commonProps}
									keys={item?.key}
									value={item?.value}
								/>
							);

						case 'edit-select':
							return (
								<EditManySelectModal
									{...commonProps}
									keys={item?.key}
									options={item?.options}
								/>
							);
						case 'edit-many':
							return (
								<EditManySelectModal
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
		</Menu>
	);
};

const buttonCss: any = {
	variant: 'white',
	size: 'xs',
	h: '32px',
	pl: 2,
};

export default SelectedMenu;
