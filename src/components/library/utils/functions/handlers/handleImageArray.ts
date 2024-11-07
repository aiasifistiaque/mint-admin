import { Handler } from './';

const handleImageArray = ({
	e,
	type,
	dataKey,
	formData,
	setFormData,
	setChangedData,
}: Handler & { dataKey: string; type?: string }) => {
	if (type == 'delete') {
		setChangedData((prevState: any) => {
			const updatedData = Array.isArray(formData[dataKey])
				? formData[dataKey].filter((item: any) => item !== e)
				: [];
			return { ...prevState, [dataKey]: updatedData };
		});

		setFormData((prevState: any) => {
			const updatedData = Array.isArray(prevState[dataKey])
				? prevState[dataKey].filter((item: any) => item !== e)
				: [];
			return { ...formData, [dataKey]: updatedData };
		});
	} else {
		setChangedData((prevState: any) => {
			const updatedData = Array.isArray(formData[dataKey])
				? formData[dataKey].includes(e)
					? formData[dataKey]
					: [...formData[dataKey], e]
				: [e];
			return { ...prevState, [dataKey]: updatedData };
		});

		setFormData((prevState: any) => {
			const updatedData = Array.isArray(prevState[dataKey])
				? prevState[dataKey].includes(e)
					? prevState[dataKey]
					: [...prevState[dataKey], e]
				: [e];
			return { ...formData, [dataKey]: updatedData };
		});
	}
};

export default handleImageArray;
