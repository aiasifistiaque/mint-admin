import React, { FC } from 'react';
import { Menu } from '@chakra-ui/react';
import {
	MenuContainer,
	EditManyModal,
	EditManySelectModal,
	EditDataSelectModal,
	MenuButton,
	ExportManyModal,
} from '../../../../';

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
			<MenuButton />
			<MenuContainer>
				{data?.map((item: any, i: number) => {
					const commonProps = {
						key: i,
						path,
						items,
						title: item?.title,
						prompt: item?.prompt,
						keyType: item?.keyType,
					};

					switch (item.type) {
						case 'edit':
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

export default SelectedMenu;