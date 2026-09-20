import { FC, useMemo } from 'react';
import {
	FormDivision,
	FormInput,
	getFieldValue,
	getOnChangeHandler as resolveOnChangeHandler,
	FormDivisionAccordion,
	FormItemAccordion,
} from '../../..';
import { Accordion, Text } from '@chakra-ui/react';

type FormMainType = {
	fields: any;
	formData: any;
	setFormData: any;
	setChangedData: any;
	isModal?: boolean;
};

const FormMain: FC<FormMainType> = ({
	fields,
	formData,
	setFormData,
	setChangedData,
	isModal = false,
}) => {
	const sections = useMemo(() => {
		let section: any[] = [];
		let sections: any[][] = [];

		if (!fields || !Array.isArray(fields)) return [];

		fields.forEach((field: any, i: number) => {
			section.push(field);
			if (field.endOfSection || i === fields.length - 1) {
				sections.push(section);
				section = [];
			}
		});

		return sections;
	}, [fields]);

	// WO-12: was a local duplicate of functions/getOnChangeHandler.ts that had
	// drifted (extra icon/video cases FormPage.tsx's copy never got). Both shells
	// now call the one shared resolver.
	const getOnChangeHandler = (type: string, key?: string) =>
		resolveOnChangeHandler({ type, key, formData, setFormData, setChangedData });

	// return <Text>{JSON.stringify(fields)}</Text>;

	// return sections.map((section: any, i: number) => (
	// 	<FormDivision
	// 		key={i}
	// 		isModal={isModal}>
	// 		{section?.map((item: any, i: number) => (
	// 			<FormItem
	// 				isHidden={item?.renderCondition && !item?.renderCondition(formData)}
	// 				item={item}
	// 				key={i}>
	// 				<>
	// 					<FormInput
	// 						formData={formData}
	// 						setFormData={setFormData}
	// 						setChangedData={setChangedData}
	// 						isRequired={item?.isRequired || false}
	// 						name={item?.name}
	// 						label={item?.label}
	// 						type={item?.type}
	// 						value={getFieldValue({ name: item?.name, formData })}
	// 						onChange={getOnChangeHandler(item?.type, item?.name)}
	// 						model={item?.model}
	// 						placeholder={item?.placeholder}
	// 						options={item?.options}
	// 						dataModel={item?.dataModel}
	// 						item={item}
	// 					/>
	// 				</>
	// 				{/* // )} */}
	// 			</FormItem>
	// 		))}
	// 	</FormDivision>
	// ));

	const FormContainer = ({ children, collapsible, section }: any) => {
		if (collapsible) {
			return (
				<FormDivisionAccordion
					title={section?.[0]?.sectionTitle || 'Section Title'}
					isModal={isModal}>
					{children}
				</FormDivisionAccordion>
			);
		}
		return (
			<FormDivision
				mb={4}
				isModal={isModal}>
				{children}
			</FormDivision>
		);
	};

	const evaluateCondition = (item: any, formData: any) => {
		const condition = item?.renderIf;
		if (!condition) return false;
		const { field, operator, value } = condition;
		switch (operator) {
			case 'eq':
				return formData[field] !== value;
			default:
				return true;
		}
	};

	return (
		<Accordion.Root
			gap={4}
			multiple
			defaultValue={sections.map((_, i) => String(i))}>
			{sections.map((section: any, i: number) => (
				<FormDivisionAccordion
					title={section?.[0]?.sectionTitle || 'Section Title'}
					value={String(i)}
					key={i}
					isModal={isModal}>
					{section?.map((item: any, i: number) => (
						<FormItemAccordion
							collapsible={true}
							isHidden={
								evaluateCondition(item, formData) ||
								(item?.renderCondition && !item?.renderCondition(formData))
							}
							item={item}
							key={i}>
							<>
								<FormInput
									formData={formData}
									setFormData={setFormData}
									setChangedData={setChangedData}
									isRequired={item?.isRequired || false}
									name={item?.name}
									label={item?.label}
									type={item?.type}
									value={getFieldValue({ name: item?.name, formData })}
									onChange={getOnChangeHandler(item?.type, item?.name)}
									model={item?.model}
									placeholder={item?.placeholder}
									options={item?.options}
									dataModel={item?.dataModel}
									item={item}
								/>
							</>
						</FormItemAccordion>
					))}
				</FormDivisionAccordion>
			))}
		</Accordion.Root>
	);
};

export default FormMain;
