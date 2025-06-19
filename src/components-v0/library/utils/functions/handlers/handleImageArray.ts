////////////////////////// VERSION TWO
/*

REASON FOR VERSION TWO:
1. IMPLEMENTED NESTED IMAGE UPLOAD
2. EDIT AND DELETE BUG FIXED

*/

import { Handler } from '.';

// Helper function to safely get nested value
const getNestedValue = (obj: any, path: string) => {
	return path.split('.').reduce((acc, part) => {
		return acc && acc[part] !== undefined ? acc[part] : [];
	}, obj);
};

// Helper function to set nested value
const setNestedValue = (obj: any, path: string, value: any) => {
	const pathArray = path.split('.');
	const lastKey = pathArray.pop()!;

	// Clone the root object
	const newObj = { ...obj };

	// Traverse the path and clone each level
	let target = newObj;
	pathArray.forEach(part => {
		if (!(part in target) || typeof target[part] !== 'object') {
			target[part] = {};
		} else {
			target[part] = { ...target[part] }; // Clone each level
		}
		target = target[part];
	});

	// Set the final value
	target[lastKey] = value;
	return newObj; // Return the updated clone
};

const handleImageArray = ({
	e,
	type,
	dataKey,
	formData,
	setFormData,
	setChangedData,
}: Handler & { dataKey: string; type?: string }) => {
	const updateNestedState = (prevState: any) => {
		const currentArray = getNestedValue(prevState, dataKey);

		let updatedData;
		if (type === 'delete') {
			updatedData = Array.isArray(currentArray)
				? currentArray.filter((item: any) => item !== e)
				: [];
		} else {
			updatedData = Array.isArray(currentArray)
				? currentArray.includes(e)
					? currentArray
					: [...currentArray, e]
				: [e];
		}

		// Use the corrected setNestedValue to ensure immutability
		return setNestedValue(prevState, dataKey, updatedData);
	};

	setChangedData((prevState: any) => updateNestedState(prevState));
	setFormData((prevState: any) => updateNestedState(prevState));

	setChangedData((prevState: any) => updateNestedState(prevState));
	setFormData((prevState: any) => updateNestedState(prevState));
};

export default handleImageArray;

////////////////////////////// VERSION ONE ////////////////////////////

// import { Handler } from './';

// const handleImageArray = ({
// 	e,
// 	type,
// 	dataKey,
// 	formData,
// 	setFormData,
// 	setChangedData,
// }: Handler & { dataKey: string; type?: string }) => {
// 	if (type == 'delete') {
// 		setChangedData((prevState: any) => {
// 			const updatedData = Array.isArray(formData[dataKey])
// 				? formData[dataKey].filter((item: any) => item !== e)
// 				: [];
// 			return { ...prevState, [dataKey]: updatedData };
// 		});

// 		setFormData((prevState: any) => {
// 			const updatedData = Array.isArray(prevState[dataKey])
// 				? prevState[dataKey].filter((item: any) => item !== e)
// 				: [];
// 			return { ...formData, [dataKey]: updatedData };
// 		});
// 	} else {
// 		setChangedData((prevState: any) => {
// 			const updatedData = Array.isArray(formData[dataKey])
// 				? formData[dataKey].includes(e)
// 					? formData[dataKey]
// 					: [...formData[dataKey], e]
// 				: [e];
// 			return { ...prevState, [dataKey]: updatedData };
// 		});

// 		setFormData((prevState: any) => {
// 			const updatedData = Array.isArray(prevState[dataKey])
// 				? prevState[dataKey].includes(e)
// 					? prevState[dataKey]
// 					: [...prevState[dataKey], e]
// 				: [e];
// 			return { ...formData, [dataKey]: updatedData };
// 		});
// 	}
// };

// export default handleImageArray;
