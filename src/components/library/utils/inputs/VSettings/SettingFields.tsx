import React from 'react';
import { FC } from 'react';
import { Grid, Box, GridProps } from '@chakra-ui/react';
import { VCheckbox, VInput, VSelect } from '..';
import { Column, JsonView } from '../../../containers';
import { Label } from '../../..';
import { typeOptions } from './data';

interface SettingFieldsProps {
	formData: any;
	onChange: (e: any) => void;
}

const SettingFields: FC<SettingFieldsProps> = ({ formData, onChange }) => {
	return (
		<Column gap={6}>
			<Grid {...gridRowDouble}>
				<VInput
					label='Title'
					name='title'
					isRequired
					value={formData.title}
					onChange={onChange}
					placeholder='Enter Title'
				/>
				<VSelect
					label='Type'
					name='type'
					value={formData.type}
					onChange={onChange}
					defaultDisabled
					placeholder='Select Type'>
					{typeOptions?.map((option: any) => (
						<option
							key={option?.value}
							value={option?.value}>
							{option?.label}
						</option>
					))}
				</VSelect>
			</Grid>
			<Grid {...gridRowDouble}>
				<VCheckbox
					label='Is required'
					name='required'
					isChecked={formData.required}
					onChange={onChange}
				/>
				<VCheckbox
					label='Editable'
					name='edit'
					isChecked={formData.edit}
					onChange={onChange}
				/>
			</Grid>
			<Grid {...gridRowDouble}>
				<VCheckbox
					label='Is Searchable'
					name='search'
					isChecked={formData.search}
					onChange={onChange}
				/>
				<VCheckbox
					label='Is Filter Allowed'
					name='sort'
					isChecked={formData.sort}
					onChange={onChange}
				/>
			</Grid>
			<Grid {...gridRowDouble}>
				<VCheckbox
					label='Is Unique'
					name='unique'
					isChecked={formData.unique}
					onChange={onChange}
				/>
				<VCheckbox
					label='Trim String value'
					name='trim'
					isChecked={formData.trim}
					onChange={onChange}
				/>
			</Grid>
			<Grid {...gridRowDouble}>
				<VInput
					type='number'
					label='Min value'
					name='min'
					value={formData.min}
					onChange={onChange}
				/>
				<VInput
					type='number'
					label='Max value'
					name='max'
					value={formData.max}
					onChange={onChange}
				/>
			</Grid>

			{/* Preview */}
			<Box {...previewBoxCss}>
				<Label mb={2}>Preview</Label>
				<JsonView data={formData} />
			</Box>
		</Column>
	);
};

const gridRowDouble: GridProps = {
	gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
	gap: 4,
};

const gridRowSingle: GridProps = {
	gridTemplateColumns: '1fr',
	gap: 4,
};

const cardContainerCss = {
	p: 4,
	border: '1px solid',
	borderColor: 'gray.200',
	borderRadius: 'md',
};

const previewBoxCss = {
	p: 4,
	bg: 'gray.50',
	borderRadius: 'md',
	mt: 6,
};

export default SettingFields;
